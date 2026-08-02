import { NextResponse } from 'next/server';
import {
  atLimitedOptions,
  entrySchema,
  experienceOptions,
  labelOf,
  licenseOptions,
  startTimingOptions,
  vehicleOptions,
  workDaysOptions,
} from '@/lib/entry-schema';

/**
 * 応募フォームの送信先。
 *
 * ■ メール送信について
 *   Resend の REST API を使用します。以下の環境変数が必要です。
 *     - RESEND_API_KEY      … Resend の APIキー
 *     - CONTACT_FROM_EMAIL  … 送信元（Resendで認証済みのドメインのアドレス）
 *     - CONTACT_TO_EMAIL    … 応募通知の受信先
 *
 *   環境変数が未設定でもビルドは失敗しません。
 *   未設定の状態で送信された場合は「送信できなかったこと」と
 *   「設定が必要な環境変数」を返し、架空の送信成功は返しません。
 */

const REQUIRED_ENV = ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL'] as const;

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: '送信内容を読み取れませんでした。' }, { status: 400 });
  }

  // --- サーバー側バリデーション（最終判断） ---
  const parsed = entrySchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, message: '入力内容をご確認ください。', fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // --- ハニーポット：値が入っていれば自動送信とみなして静かに終了 ---
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  // --- メール送信設定の確認 ---
  const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    console.error(`[entry] メール送信設定が未完了です。未設定の環境変数: ${missingEnv.join(', ')}`);
    return NextResponse.json(
      {
        ok: false,
        code: 'MAIL_NOT_CONFIGURED',
        message:
          '現在、フォームからの送信を受け付けられない状態です。お手数ですが、Instagramのダイレクトメッセージよりご連絡ください。',
        missingEnv,
      },
      { status: 503 },
    );
  }

  const rows: [string, string][] = [
    ['お名前', data.name],
    ['ふりがな', data.kana],
    ['電話番号', data.tel],
    ['メールアドレス', data.email],
    ['お住まいの市区町村', data.city],
    ['普通自動車免許', labelOf(licenseOptions, data.license)],
    ['AT限定', labelOf(atLimitedOptions, data.atLimited)],
    ['配送用車両', labelOf(vehicleOptions, data.vehicle)],
    ['希望する勤務地', data.preferredArea || '（未記入）'],
    ['希望する稼働日数', labelOf(workDaysOptions, data.workDays)],
    ['稼働開始希望時期', labelOf(startTimingOptions, data.startTiming)],
    ['配送経験', labelOf(experienceOptions, data.experience)],
    ['ご質問・ご相談', data.message || '（未記入）'],
  ];

  const html = `
    <h2>JUNGLE 応募フォームからの新規応募</h2>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><th align="left" style="background:#f5f5f3;white-space:nowrap">${escapeHtml(label)}</th><td>${escapeHtml(
              value,
            ).replace(/\n/g, '<br>')}</td></tr>`,
        )
        .join('')}
    </table>
  `;

  const text = rows.map(([label, value]) => `${label}：${value}`).join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: `【応募】${data.name} 様（${data.city}）｜JUNGLE 軽貨物ドライバー`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(`[entry] Resend APIエラー (${response.status}): ${detail}`);
      return NextResponse.json(
        {
          ok: false,
          message:
            '送信処理に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、Instagramのダイレクトメッセージよりご連絡ください。',
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error('[entry] メール送信に失敗しました', error);
    return NextResponse.json(
      {
        ok: false,
        message:
          '送信処理に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、Instagramのダイレクトメッセージよりご連絡ください。',
      },
      { status: 502 },
    );
  }

  // 実際に送信が成功した場合のみ ok: true を返します
  return NextResponse.json({ ok: true });
}
