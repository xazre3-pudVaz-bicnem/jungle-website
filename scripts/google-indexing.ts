/**
 * Google Indexing API 通知スクリプト（任意実行）
 *
 * 求人ページを公開・更新したとき、または募集を終了したときに、
 * Googleへ通知するためのスクリプトです。実行は任意で、ビルドには影響しません。
 *
 * ■ 使い方
 *   npm run indexing:update -- https://example.com/jobs/akashi-light-cargo-driver
 *   npm run indexing:delete -- https://example.com/jobs/akashi-light-cargo-driver
 *
 *   URLを省略した場合は、src/data/jobs.ts の status: 'open' の求人すべてを対象にします。
 *   （delete の場合は status: 'closed' の求人すべてが対象になります）
 *
 * ■ 必要な環境変数（いずれかの方法で認証情報を渡してください）
 *   A) GOOGLE_APPLICATION_CREDENTIALS … サービスアカウントJSONファイルへのパス
 *   B) GOOGLE_SERVICE_ACCOUNT_JSON    … サービスアカウントJSONの中身そのもの
 *   C) GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY … 個別に指定
 *
 *   SITE_URL … 求人slugからURLを組み立てる際に使用（例: https://jungle-transport.jp）
 *
 * ■ 認証情報の扱い
 *   秘密鍵をコードやGitHubへ直接書かないでください。
 *   .gitignore で gcp-service-account.json と .env* を除外しています。
 *
 * ■ 事前準備
 *   Google Cloud側の設定手順は README.md の「Indexing APIの設定」をご覧ください。
 */

import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

type ServiceAccount = { client_email: string; private_key: string };

const INDEXING_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/indexing';

/* ------------------------------- 認証情報の取得 ------------------------------- */

function loadServiceAccount(): ServiceAccount {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const raw = readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8');
    return JSON.parse(raw) as ServiceAccount;
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (email && key) {
    // .env に \n をエスケープして保存している場合に対応
    return { client_email: email, private_key: key.replace(/\\n/g, '\n') };
  }

  throw new Error(
    [
      'Google のサービスアカウント認証情報が見つかりません。',
      '以下のいずれかを設定してください：',
      '  GOOGLE_APPLICATION_CREDENTIALS=./gcp-service-account.json',
      '  GOOGLE_SERVICE_ACCOUNT_JSON={"client_email":"...","private_key":"..."}',
      '  GOOGLE_SERVICE_ACCOUNT_EMAIL と GOOGLE_PRIVATE_KEY',
      '設定手順は README.md をご覧ください。',
    ].join('\n'),
  );
}

/* --------------------------- アクセストークンの取得 --------------------------- */

const base64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function getAccessToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPE,
      aud: TOKEN_ENDPOINT,
      exp: now + 3600,
      iat: now,
    }),
  );

  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  const signature = base64url(signer.sign(account.private_key));
  const assertion = `${header}.${claim}.${signature}`;

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`アクセストークンの取得に失敗しました (${response.status}): ${await response.text()}`);
  }

  const json = (await response.json()) as { access_token: string };
  return json.access_token;
}

/* ------------------------------- URLの通知 -------------------------------- */

async function notify(url: string, type: 'URL_UPDATED' | 'URL_DELETED', token: string) {
  const response = await fetch(INDEXING_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type }),
  });

  if (!response.ok) {
    console.error(`  ✗ ${url} … 失敗 (${response.status}) ${await response.text()}`);
    return false;
  }

  console.log(`  ✓ ${url} … ${type}`);
  return true;
}

/* -------------------------- 対象URLの組み立て（省略時） -------------------------- */

async function resolveTargetUrls(action: 'update' | 'delete'): Promise<string[]> {
  const siteUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  if (!siteUrl) {
    throw new Error('URLを省略する場合は、環境変数 SITE_URL に本番URLを設定してください。');
  }

  // jobs.ts をそのまま読み込むため、TypeScriptの型ストリップ実行が必要です
  const { jobs } = (await import('../src/data/jobs.ts')) as typeof import('../src/data/jobs');
  const wanted = action === 'update' ? 'open' : 'closed';
  return jobs.filter((job) => job.status === wanted).map((job) => `${siteUrl}/jobs/${job.slug}`);
}

/* --------------------------------- main ---------------------------------- */

async function main() {
  const [action, ...urlArgs] = process.argv.slice(2);

  if (action !== 'update' && action !== 'delete') {
    console.error('使い方: npm run indexing:update -- <URL>  /  npm run indexing:delete -- <URL>');
    process.exitCode = 1;
    return;
  }

  const urls = urlArgs.length > 0 ? urlArgs : await resolveTargetUrls(action);

  if (urls.length === 0) {
    console.log('通知対象のURLがありません。');
    return;
  }

  const account = loadServiceAccount();
  const token = await getAccessToken(account);
  const type = action === 'update' ? 'URL_UPDATED' : 'URL_DELETED';

  console.log(`Google Indexing API へ ${type} を通知します（${urls.length}件）`);

  let failed = 0;
  for (const url of urls) {
    const ok = await notify(url, type, token);
    if (!ok) failed += 1;
  }

  if (failed > 0) {
    console.error(`\n${failed}件の通知に失敗しました。`);
    process.exitCode = 1;
    return;
  }

  console.log('\n完了しました。');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  // process.exit() は保留中の非同期処理を強制終了させるため、終了コードのみ設定します
  process.exitCode = 1;
});
