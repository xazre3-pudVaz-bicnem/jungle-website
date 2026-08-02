# JUNGLE TRANSPORT 公式サイト

兵庫県明石市・神戸市西部エリアで軽貨物配送を行う **JUNGLE TRANSPORT** のコーポレートサイト兼、軽貨物ドライバー採用サイトです。

- **技術構成**：Next.js 16（App Router）／ TypeScript ／ Tailwind CSS v4
- **レンダリング**：全ページ Server Component による静的生成（SSG）
- **デプロイ前提**：Vercel

---

## 目次

1. [ローカル起動](#ローカル起動)
2. [ビルド](#ビルド)
3. [Vercelへのデプロイ](#vercelへのデプロイ)
4. [会社情報の変更場所](#会社情報の変更場所)
5. [求人情報の追加方法](#求人情報の追加方法)
6. [求人情報の終了方法](#求人情報の終了方法)
7. [採用コラムの追加方法](#採用コラムの追加方法)
8. [画像の差し替え方法](#画像の差し替え方法)
9. [問い合わせメールの設定](#問い合わせメールの設定)
10. [Search Console 登録方法](#search-console-登録方法)
11. [Googleしごと検索の確認方法](#googleしごと検索の確認方法)
12. [リッチリザルトテスト](#リッチリザルトテスト)
13. [Indexing APIの設定](#indexing-apiの設定)
14. [環境変数一覧](#環境変数一覧)
15. [ページ一覧](#ページ一覧)
16. [情報の取り扱い方針](#情報の取り扱い方針)

---

## ローカル起動

```bash
npm install
npm run dev
```

http://localhost:3000 で確認できます。環境変数を設定しなくても起動します。

---

## ビルド

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript の型チェック
npm run build      # 本番ビルド
npm run start      # ビルド結果をローカルで起動
```

---

## Vercelへのデプロイ

1. GitHub にリポジトリを作成し、push します。
2. Vercel で「New Project」→ 該当リポジトリを Import します。
3. Framework Preset は **Next.js** が自動選択されます。ビルドコマンドの変更は不要です。
4. **Settings → Environment Variables** に、[環境変数一覧](#環境変数一覧)の値を登録します。
   - `NEXT_PUBLIC_SITE_URL` には、独自ドメインを設定した後の本番URLを入れてください（canonical・OGP・サイトマップの絶対URLに使われます）。
5. Deploy を実行します。
6. 独自ドメインを **Settings → Domains** で追加します。
7. ドメイン確定後、`NEXT_PUBLIC_SITE_URL` を更新して再デプロイしてください。

---

## 会社情報の変更場所

サイト内には会社情報をハードコードしていません。すべて `src/data/` のファイルから読み込んでいます。

| 変更したい内容 | ファイル |
| --- | --- |
| サイト名・本番URL・ナビゲーション・SNSリンク | `src/data/site.ts` |
| 会社名・住所・代表者・設立・会社概要テーブル | `src/data/company.ts` |
| 事業内容・安全品質の考え方 | `src/data/services.ts` |
| 求人情報 | `src/data/jobs.ts` |
| よくある質問 | `src/data/faq.ts` |
| 応募の流れ・1日の流れ・働く特徴 | `src/data/process.ts` |
| 採用コラム | `src/data/columns.ts` と `src/data/columns/` |

### 未確認情報の扱い

`company.ts` と `jobs.ts` では、**未確認の項目に `null` を設定しています**。

- `null` の項目は画面にも構造化データにも一切出力されません
- 判明した時点で値を入れるだけで、会社概要・フッター・JobPosting すべてに反映されます
- **推測値やダミーの電話番号・住所・代表者名を入れないでください**

電話番号・LINE・メールを公開できるようになったら、`src/data/site.ts` の `socialLinks` を編集してください。`null` から値を入れると、ヘッダー・フッター・モバイル追従CTA・会社概要に自動で表示されます。

```ts
// src/data/site.ts
export const socialLinks = {
  instagram: 'https://www.instagram.com/jungle.hyougo/' as string,
  line: null as string | null,   // ← 公式LINEのURLを入れると各所にボタンが出ます
  tel: null as string | null,    // ← 電話番号を入れると電話CTAが出ます
  email: null as string | null,
};
```

---

## 求人情報の追加方法

`src/data/jobs.ts` の `jobs` 配列に 1 件追加するだけで、以下がすべて自動生成されます。

- 求人詳細ページ `/jobs/<slug>`
- 求人一覧 `/jobs` への掲載
- サイトマップへの追加
- JobPosting 構造化データ（`status: 'open'` のときのみ）
- トップページ・採用トップ・応募フォームからの内部リンク

```ts
{
  slug: 'kobe-nishi-light-cargo-driver',   // URL になります
  status: 'open',                           // 'open' | 'closed' | 'draft'
  title: '軽貨物ドライバー（神戸西エリア）',
  summary: '一覧・検索結果に出る短い説明（120文字以内推奨）',
  datePosted: '2026-08-01',
  validThrough: null,                       // 期限がある場合のみ日付を設定
  contractLabel: '業務委託（個人事業主としての契約）',
  employmentType: 'CONTRACTOR',
  location: { region: '兵庫県', locality: '神戸市', postalCode: null, street: null },
  areas: ['兵庫県神戸市西区'],
  deliveryAreas: ['神戸西エリア'],
  salary: { /* 下記参照。不明なら null */ },
  duties: ['...'],
  requirements: ['...'],
  welcome: ['...'],
  benefits: ['...'],
  specs: [{ label: '勤務時間', value: null, note: '面談時にご確認ください' }],
  notes: ['...'],
  toConfirm: ['...'],
}
```

### 重要なルール

- **1ページにつき1求人**。求人詳細ページ以外に JobPosting を設置しないでください。
- `specs` の `value` に `null` を入れると、画面には「面談時にご確認ください」と表示され、構造化データからは除外されます。**確認できていない条件を推測で埋めないでください。**
- 報酬を掲載する場合は、`salary.basis` に**計算根拠を必ず書いてください**。根拠のない金額は画面に出さない設計です。
- `validThrough` は、実際に募集期限がある場合だけ設定します。常時募集や期限不明のときは `null` のままにしてください（適当な未来日を入れない）。

### 報酬（baseSalary / estimatedSalary）の切り替え

現在の求人では `salary.useBaseSalary: false` に設定しています。

- **`false`（現状）** … `estimatedSalary` として出力されます。Instagramで確認できるのが「未経験でも月収30万円〜可能」という**報酬例**であり、確定した報酬体系（日額・件数単価・歩合率）が未確認のためです。
- **`true`** … `baseSalary`（確定給与）として出力されます。**実際の報酬体系が確認できてから** `true` に変更してください。

`salary` 自体を `null` にすると、報酬の表示と構造化データの給与プロパティが両方とも出力されなくなります。

---

## 求人情報の終了方法

`status` を変更するだけで、サイト全体の挙動が切り替わります。

| status | 一覧への表示 | 詳細ページ | JobPosting | サイトマップ |
| --- | --- | --- | --- | --- |
| `open` | 表示する | 通常表示 | **出力する** | 含める |
| `closed` | 表示しない | 「募集終了」表示・**noindex** | 出力しない | 含めない |
| `draft` | 表示しない | **404** | 出力しない | 含めない |

### 推奨する手順

1. `src/data/jobs.ts` の該当求人の `status` を `'closed'` に変更する
2. デプロイする
3. Google へ削除を通知する（任意）

```bash
npm run indexing:delete -- https://<本番URL>/jobs/<slug>
```

求人ページごと削除したい場合は、配列から要素を削除してください。その場合 URL は 404 になります（`dynamicParams = false` のため）。

---

## 採用コラムの追加方法

`src/data/columns/basics.ts` または `practical.ts` に `Column` オブジェクトを追加します。追加するだけで、一覧・詳細ページ・サイトマップ・Article 構造化データが生成されます。

本文は `blocks` 配列で組み立てます。使用できるブロック：

| type | 用途 |
| --- | --- |
| `h2` / `h3` | 見出し |
| `p` | 段落 |
| `ul` / `ol` | 箇条書き／番号付きリスト |
| `note` | 黄色い罫線付きの注意書き |
| `table` | 比較表（`head` と `rows`） |
| `jobLink` | 関連求人への内部リンクブロック（募集終了の求人は自動でリンクを外します） |

`faqIds` に `src/data/faq.ts` の id を並べると、記事末尾にFAQが表示され、FAQPage 構造化データも出力されます。

---

## 画像の差し替え方法

`public/images/` にファイルを置いて再ビルドするだけで、対応箇所が自動的に写真へ切り替わります。

**画像が存在しない間は、黒地に黄色のラインを引いた仮レイアウトが表示されます。** 壊れた画像は表示されず、レイアウトも崩れません（`src/lib/images.ts` がビルド時にファイルの実在を判定しています）。

想定しているファイル名と使用箇所は `public/images/README.md` にまとめています。

- 形式は WebP または AVIF を推奨
- **Instagram の CDN URL を直接参照しないでください**（URLが失効します）
- alt は各ページに日本語で記述済みです。写真の内容が想定と異なる場合は alt も修正してください

### ロゴについて

ロゴは2種類を使い分けています。

| ファイル | 用途 | 参照元 |
| --- | --- | --- |
| `public/logo.jpg` | 構造化データの `Organization.logo` | `siteConfig.logo` |
| `public/logo-wordmark.webp` | ヘッダー・フッターの表示 | `siteConfig.logoWordmark` |

元の `logo.jpg` は正方形で余白が大きく、ヘッダーの高さに収めると文字が読めなくなるため、余白を切り落とした横長版を別に用意しています。

また、現在のロゴは**背景が白の JPG で透過情報を持たない**ため、暗い背景（ヒーロー上のヘッダー、フッター）にそのまま置くと白い四角が浮いてしまいます。そこで `src/components/ui/Logo.tsx` で、白い下地（チップ）の中にロゴを収める処理を入れています。

**透過PNG または SVG のロゴをご用意いただける場合**は、`public/` に配置して `siteConfig.logoWordmark` のパスを変更したうえで、`Logo.tsx` を呼び出している箇所に `chip={false}` を渡すと、下地なしで表示できます（`src/components/layout/Header.tsx` と `Footer.tsx` の2か所）。

### ファビコン

`src/app/` の `favicon.ico` / `icon.png` / `apple-icon.png` が使われます。ロゴ内のトラックのマークを黄色地に載せたものです。差し替える場合はこの3ファイルを置き換えてください。

### 画像コンポーネントの注意点

`<Photo>` は `next/image` の `fill` を成立させるため内部で `position: relative` を持っています。**`className` に `absolute` を渡さないでください**（指定が衝突して高さが 0 になります）。全面に敷きたい場合は、外側を `<div className="absolute inset-0">` で包んでください。

---

## 問い合わせメールの設定

応募フォームは [Resend](https://resend.com/) を使ってメールを送信します。

### 手順

1. Resend にアカウントを作成します。
2. **Domains** で送信元ドメインを追加し、表示される DNS レコードを設定して認証を完了させます。
3. **API Keys** で APIキーを発行します。
4. 以下の環境変数を Vercel（およびローカルの `.env.local`）に設定します。

```
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_FROM_EMAIL=noreply@<認証済みドメイン>
CONTACT_TO_EMAIL=<応募を受け取るメールアドレス>
```

### 未設定のときの挙動

3つの環境変数が揃っていない場合、フォーム送信時に **成功画面は表示されません**。代わりに以下が表示されます。

- 応募者向け：「Instagram のダイレクトメッセージよりご連絡ください」という案内
- 管理者向け：**未設定の環境変数名の一覧**

架空の送信成功を表示しない設計です。環境変数が未設定でも `npm run build` は成功します。

---

## Search Console 登録方法

1. [Google Search Console](https://search.google.com/search-console) で「プロパティを追加」→「URLプレフィックス」を選び、本番URLを入力します。
2. 所有権の確認方法で **HTMLタグ** を選びます。表示される `<meta name="google-site-verification" content="XXXX">` の **`content` の値だけ**をコピーします。
3. Vercel の環境変数に設定します。

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=XXXX
```

4. 再デプロイ後、Search Console で「確認」を押します。
5. 確認が完了したら、**サイトマップ** に `sitemap.xml` を送信します。

---

## Googleしごと検索の確認方法

1. 求人詳細ページ（`/jobs/<slug>`）が **ログインなしで閲覧できる**ことを確認します。
2. [リッチリザルトテスト](https://search.google.com/test/rich-results) に求人詳細ページのURLを入力し、`JobPosting` が検出されエラーが出ないことを確認します。
3. Search Console の **拡張 → 求人情報** で、検出状況とエラーを確認します。
4. `site:<本番URL>/jobs/` で検索し、インデックス状況を確認します。

### 本サイトの JobPosting 実装方針

- **求人一覧ページ（`/jobs`）には JobPosting を設置していません。** 詳細ページのみに設置しています。
- 1ページにつき1件の求人のみを掲載しています。
- `status: 'open'` の求人でのみ JobPosting を出力します。
- `description` には、画面に表示している仕事内容・応募資格・勤務時間・待遇・勤務地・必要な経験・必要な免許を HTML 形式で含めています。
- **構造化データの内容は、画面に表示している内容と一致させています。** 画面に出していない給与や待遇を構造化データにだけ入れることはありません。
- 応募方法を求人ページ内に明示し、`directApply: true` を設定しています。

---

## リッチリザルトテスト

<https://search.google.com/test/rich-results>

各ページで検出される構造化データ：

| ページ | 構造化データ |
| --- | --- |
| 全ページ共通 | `Organization`, `WebSite` |
| `/` | `FAQPage` |
| `/service` | `Service`, `Organization`, `BreadcrumbList` |
| `/company` | `Organization`, `BreadcrumbList` |
| `/jobs/<slug>` | **`JobPosting`**, `BreadcrumbList` |
| `/jobs` | `BreadcrumbList` のみ（JobPosting は設置しない） |
| `/faq` `/recruit` `/work` `/beginner` | `FAQPage`, `BreadcrumbList` |
| `/columns/<slug>` | `Article`, `FAQPage`, `BreadcrumbList` |

---

## Indexing APIの設定

求人の公開・更新・募集終了を Google へ通知するスクリプトです。**実行は任意**で、設定していなくてもビルド・デプロイに影響しません。

### Google Cloud 側の設定

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成します。
2. **APIとサービス → ライブラリ** で「Indexing API」を検索し、**有効にする** をクリックします。

### サービスアカウントの作成

3. **IAMと管理 → サービスアカウント → サービスアカウントを作成** を選びます。
4. 名前を入力して作成します（ロールの付与は不要です）。
5. 作成したサービスアカウントを開き、**キー → 鍵を追加 → 新しい鍵を作成 → JSON** を選択します。
6. ダウンロードされた JSON をプロジェクト直下に `gcp-service-account.json` として保存します。
   **このファイルは `.gitignore` 済みです。絶対にコミットしないでください。**

### Search Console への権限追加

7. JSON 内の `client_email`（`xxx@xxx.iam.gserviceaccount.com`）をコピーします。
8. Search Console → 対象プロパティ → **設定 → ユーザーと権限 → ユーザーを追加**
9. コピーしたメールアドレスを追加し、権限を **オーナー** に設定します。
   （Indexing API はオーナー権限が必要です）

### 環境変数の登録

以下のいずれか1つの方法で設定します。

```bash
# A) JSONファイルのパスを指定（ローカル実行向け）
GOOGLE_APPLICATION_CREDENTIALS=./gcp-service-account.json

# B) JSONの中身をそのまま設定（CI／Vercel向け）
GOOGLE_SERVICE_ACCOUNT_JSON={"client_email":"...","private_key":"..."}

# C) 個別に指定（改行は \n でエスケープ）
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# URLを省略して実行する場合に必要
SITE_URL=https://<本番URL>
```

### 求人公開時の通知

```bash
# URLを指定して通知
npm run indexing:update -- https://<本番URL>/jobs/akashi-light-cargo-driver

# URLを省略すると status: 'open' の求人すべてを通知
npm run indexing:update
```

### 求人終了時の削除通知

```bash
# URLを指定して通知
npm run indexing:delete -- https://<本番URL>/jobs/akashi-light-cargo-driver

# URLを省略すると status: 'closed' の求人すべてを通知
npm run indexing:delete
```

---

## 環境変数一覧

| 変数名 | 必須 | 用途 | 未設定時の挙動 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 推奨 | canonical / OGP / サイトマップの絶対URL | `src/data/site.ts` の既定値を使用 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | 任意 | Search Console の所有権確認 | verification メタタグを出力しない |
| `RESEND_API_KEY` | フォーム利用時 | Resend の APIキー | フォーム送信不可・設定案内を表示 |
| `CONTACT_FROM_EMAIL` | フォーム利用時 | 送信元アドレス | 同上 |
| `CONTACT_TO_EMAIL` | フォーム利用時 | 応募通知の受信先 | 同上 |
| `GOOGLE_APPLICATION_CREDENTIALS` | 任意 | Indexing API 用 JSON のパス | スクリプト実行時のみエラー |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 任意 | Indexing API 用 JSON の中身 | 同上 |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | 任意 | Indexing API 用のメールアドレス | 同上 |
| `GOOGLE_PRIVATE_KEY` | 任意 | Indexing API 用の秘密鍵 | 同上 |
| `SITE_URL` | 任意 | Indexing API でURLを省略実行する場合 | 同上 |

**いずれも未設定のまま `npm run build` は成功します。**

---

## ページ一覧

| パス | 内容 | 主な対策キーワード |
| --- | --- | --- |
| `/` | トップページ | 兵庫 軽貨物／JUNGLE 兵庫 |
| `/service` | 事業内容 | 兵庫 軽貨物配送／明石 配送会社 |
| `/about` | JUNGLEについて | JUNGLE 軽貨物 |
| `/recruit` | 採用トップ | 兵庫 軽貨物ドライバー 求人 |
| `/jobs` | 求人一覧（JobPosting なし） | 兵庫 軽貨物 求人 |
| `/jobs/[slug]` | 求人詳細（**JobPosting あり**） | 明石 軽貨物ドライバー 求人 |
| `/work` | 仕事内容 | 兵庫 配送ドライバー |
| `/beginner` | 未経験の方へ | 軽貨物ドライバー 未経験 兵庫 |
| `/daily-flow` | 1日の流れ | 軽貨物ドライバー 1日 |
| `/faq` | よくある質問 | 軽貨物 業務委託 質問 |
| `/company` | 会社概要 | JUNGLE 会社概要 |
| `/columns` | 採用コラム一覧 | 軽貨物ドライバー とは |
| `/columns/[slug]` | 採用コラム詳細（8記事） | 記事ごとに設定 |
| `/entry` | 応募フォーム | — |
| `/entry/thanks` | 送信完了（**noindex**） | — |
| `/privacy` | プライバシーポリシー | — |
| `/job-policy` | 求人情報掲載・更新方針 | — |

---

## 情報の取り扱い方針

このサイトは、**JUNGLE公式Instagram（[@jungle.hyougo](https://www.instagram.com/jungle.hyougo/)）で確認できた情報のみ**を掲載する方針で構築されています。

### Instagram で確認できた情報

- 軽貨物ドライバーを募集中（事業拡大にともなう募集）
- 対象エリア：兵庫エリア／明石・神戸西エリア
- 仕事内容：軽自動車での宅配・企業配送
- 未経験者も応募可能、女性も歓迎
- 「未経験でも月収30万円〜可能」という**報酬例**の記載
- 車両リースあり／日当保証あり
- 要普通自動車免許
- 応募方法：Instagram のダイレクトメッセージ
- 事業内容：軽貨物配送のほか、不動産・引越し・遺品回収など
- ブランド表記：ロゴより「JUNGLE TRANSPORT」

### 別途ご提供いただいて掲載済みの情報

- 正式名称：**JUNGLE**（`company.legalName`。ロゴ表記の「JUNGLE TRANSPORT」はブランド表記として併用）
- 電話番号：**090-7756-2400**（`socialLinks.tel`）
  - ヘッダー配下の各所ではなく、フッター・会社概要・応募フォーム・応募CTA・スマホ追従CTA・`Organization` 構造化データに自動反映されます
- 写真20点（`public/images/`）

### 未確認のため掲載していない情報（TODO）

以下は `src/data/company.ts` の `companyTodos` と、`src/data/jobs.ts` の `toConfirm` / `specs` に集約しています。判明した時点でデータファイルを編集すれば、サイト全体に反映されます。

- 本店所在地／郵便番号
- 代表者名／設立年月／資本金／従業員数
- 貨物軽自動車運送事業の届出番号
- 公開可能なメールアドレス／公式LINEの有無／電話の受付時間
- 報酬の具体的な計算方法（日額・件数単価・歩合率）
- 日当保証の金額／車両リースの月額と契約条件
- 勤務時間・稼働日数・休日の具体的な条件
- 直行直帰の可否／服装・身だしなみの規定
- 経費の負担範囲（ガソリン代・保険料など）
- 募集期限

**確認できていない情報を推測で埋めないでください。** ダミーの電話番号・住所・給与・代表者名を本番画面に表示しない設計になっています。
