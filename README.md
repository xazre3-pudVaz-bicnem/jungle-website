# JUNGLE TRANSPORT 公式サイト

兵庫県明石市・神戸市西区で軽貨物配送を行う **JUNGLE TRANSPORT** のコーポレートサイト兼、軽貨物ドライバー採用サイトです。

- **本番URL**：<https://www.jungle-transport24.com/>
- **技術構成**：Next.js 16（App Router）／ TypeScript ／ Tailwind CSS v4
- **レンダリング**：全ページ Server Component による静的生成（SSG）
- **デプロイ前提**：Vercel

## 関連ドキュメント

| ドキュメント | 内容 |
| --- | --- |
| [docs/seo-keyword-map.md](docs/seo-keyword-map.md) | ページごとの役割と狙う検索意図。ページ追加前に必ず確認 |
| [docs/owner-checklist.md](docs/owner-checklist.md) | **オーナーへ確認が必要な情報**（優先度順） |
| [docs/offpage-seo.md](docs/offpage-seo.md) | Googleビジネスプロフィール・Search Console・オフページ施策 |
| [public/images/README.md](public/images/README.md) | 画像の一覧と差し替え方法 |

---

## 目次

1. [ローカル起動とビルド](#ローカル起動とビルド)
2. [Vercelへのデプロイ](#vercelへのデプロイ)
3. [会社情報の変更場所](#会社情報の変更場所)
4. [求人情報の追加方法](#求人情報の追加方法)
5. [求人情報の終了方法](#求人情報の終了方法)
6. [地域ページの追加方法](#地域ページの追加方法)
7. [採用ガイド・コラムの追加方法](#採用ガイドコラムの追加方法)
8. [画像の差し替え方法](#画像の差し替え方法)
9. [問い合わせメールの設定](#問い合わせメールの設定)
10. [アクセス解析（GA4）](#アクセス解析ga4)
11. [Search Console 登録方法](#search-console-登録方法)
12. [Googleしごと検索の確認方法](#googleしごと検索の確認方法)
13. [Indexing APIの設定](#indexing-apiの設定)
14. [構造化データの方針](#構造化データの方針)
15. [環境変数一覧](#環境変数一覧)
16. [ページ一覧](#ページ一覧)
17. [情報の取り扱い方針](#情報の取り扱い方針)

---

## ローカル起動とビルド

```bash
npm install
npm run dev        # 開発サーバー（http://localhost:3000）

npm run lint       # ESLint
npm run typecheck  # TypeScript の型チェック
npm run build      # 本番ビルド
npm run start      # ビルド結果をローカルで起動
```

環境変数を設定しなくても起動・ビルドできます。

---

## Vercelへのデプロイ

1. GitHub にリポジトリを作成し、push します。
2. Vercel で「New Project」→ 該当リポジトリを Import します。
3. Framework Preset は **Next.js** が自動選択されます。ビルドコマンドの変更は不要です。
4. **Settings → Environment Variables** に [環境変数一覧](#環境変数一覧) の値を登録します。
5. **Settings → Domains** で `www.jungle-transport24.com` を設定し、`jungle-transport24.com`（wwwなし）からのリダイレクトを有効にします。
   - 現在すでに `http` / `https` / wwwあり・なし のすべてが `https://www.jungle-transport24.com/` へ 308 リダイレクトされる設定になっています。
6. Deploy を実行します。

> **`NEXT_PUBLIC_SITE_URL` について**
> 未設定でも `https://www.jungle-transport24.com` が既定値になります。
> 別ドメインへ移行する場合のみ設定してください。

---

## 会社情報の変更場所

サイト内には会社情報をハードコードしていません。すべて `src/data/` から読み込んでいます。

| 変更したい内容 | ファイル |
| --- | --- |
| サイト名・本番URL・ナビゲーション・SNS・GA設定 | `src/data/site.ts` |
| 会社名・住所・代表者・電話・届出番号 | `src/data/company.ts` |
| 事業内容・サービス個別ページ | `src/data/services.ts` |
| 求人情報 | `src/data/jobs.ts` |
| 対応エリア（地域ページ） | `src/data/areas.ts` |
| 採用ガイド | `src/data/recruit-guides.ts` |
| よくある質問 | `src/data/faq.ts` |
| 応募の流れ・1日の流れ・働く特徴 | `src/data/process.ts` |
| 採用コラム | `src/data/columns.ts` と `src/data/columns/` |

### 未確認情報の扱い

`company.ts` の各項目は `{ value, verified, todo }` の形で管理しています。

```ts
representative: unverified('代表者名。会社概要とOrganization構造化データに使用します'),
tel: confirmed('090-7756-2400'),
```

- `verified: false` または `value: null` の項目は、**画面にも構造化データにも一切出力されません**
- 値を入れて `confirmed()` に変えるだけで、会社概要・フッター・求人詳細・JSON-LD すべてに反映されます
- 未確認の項目は `/company` ページと [docs/owner-checklist.md](docs/owner-checklist.md) に自動で一覧表示されます
- **推測値やダミーの住所・代表者名を入れないでください**

### LocalBusiness 構造化データについて

番地まで確認できた住所がない状態で `LocalBusiness` を出力すると、ローカル検索でかえって不利になります。
そのため `company.streetAddress` が確認できるまで出力を止めています（`canPublishLocalBusiness()` で制御）。
**所在地（兵庫県神戸市西区玉津町出合44-1）を確認済みのため、現在は出力されています。**

---

## 求人情報の追加方法

`src/data/jobs.ts` の `jobs` 配列に1件追加するだけで、以下がすべて自動生成されます。

- 求人詳細ページ `/jobs/<slug>`
- 求人一覧 `/jobs` への掲載
- サイトマップへの追加
- JobPosting 構造化データ（`status: 'open'` **かつ** `verified: true` のときのみ）
- トップ・採用トップ・地域ページ・採用ガイドからの内部リンク

### 重要なルール

- **1ページにつき1求人**。求人詳細ページ以外に JobPosting を設置しないでください
  （求人一覧・採用ガイド・地域ページには設置していません）
- `specs` の `value` に `null` を入れると、画面には「面談時にご確認ください」と表示され、構造化データからは除外されます
- `summaryTable: true` を付けた項目が、ページ冒頭の「募集概要」テーブルに出ます
- 報酬を掲載する場合は `salary.basis` に**計算根拠を必ず書いてください**
- `validThrough` は実際に募集期限がある場合だけ設定します（適当な未来日を入れない）
- 求人内容を更新したら `updatedAt` も更新してください（サイトマップの lastModified に使われます）

### `verified` フラグの意味

「掲載している内容の裏取りが済んでいるか」を表します。

- **`true`（現状）** … JobPosting に出力する項目（職種名・仕事内容・勤務地・契約形態・応募資格・待遇・応募方法）がすべて確認済み。未確認の条件は `value: null` で除外されています
- **`false`** … JobPosting を出力しません。Googleしごと検索には掲載されなくなります

掲載済みの内容に疑義が生じた場合は `false` に戻してください。

### 報酬（baseSalary / estimatedSalary）の切り替え

現在は `salary.useBaseSalary: false` です。

- **`false`（現状）** … `estimatedSalary` として出力。確認できるのが「未経験でも月収30万円〜可能」という**報酬例**であり、単位と計算根拠が未確認のためです
- **`true`** … `baseSalary`（確定給与）として出力。**報酬体系が確認できてから**変更してください

`salary` 自体を `null` にすると、報酬の表示と給与プロパティが両方とも出力されなくなります。

---

## 求人情報の終了方法

`status` を変更するだけで、サイト全体の挙動が切り替わります。

| status | 一覧への表示 | 詳細ページ | JobPosting | サイトマップ |
| --- | --- | --- | --- | --- |
| `open` | 表示する | 通常表示 | **出力する**（verified時） | 含める |
| `closed` | 表示しない | 「募集終了」表示・**noindex** | 出力しない | 含めない |
| `draft` | 表示しない | **404** | 出力しない | 含めない |

### 推奨する手順

1. `src/data/jobs.ts` の該当求人の `status` を `'closed'` に変更する
2. デプロイする
3. Google へ削除を通知する

```bash
npm run indexing:delete -- https://www.jungle-transport24.com/jobs/<slug>
```

求人ページごと削除したい場合は配列から要素を削除してください。URL は 404 になります（`dynamicParams = false` のため）。

---

## 地域ページの追加方法

`src/data/areas.ts` に追加します。**以下がすべて確認できた地域だけ**作成してください。

- 実際に配送している
- 実際に求人対象となっている
- 通勤または稼働が可能
- 説明できる現場情報がある

### 品質基準

- 地域名を差し替えただけのページを作らない（他地域と重複しない内容にする）
- 地理・道路・街の構成は、公開情報として確認できる事実のみを書く
- JUNGLEの運用実態（配送比率・件数・積み込み場所）は、裏取りできるまで `unverifiedNotes` に置く
- **文字数を満たすための水増しをしない**

現在は明石市・神戸市西区の2件です。垂水区は稼働実態が未確認のため作成していません（確認できたら追加してください）。

---

## 採用ガイド・コラムの追加方法

### 採用ガイド（`/recruit/[slug]`）

`src/data/recruit-guides.ts` に追加します。

- **求人詳細ページのコピーにしないでください**。応募前の疑問に検索意図ごとに答えるページです
- **JobPosting を設置しません**
- 必ず求人詳細ページへ「正式な募集要項はこちら」としてリンクします

### コラム（`/columns/[slug]`）

`src/data/columns/basics.ts` または `practical.ts` に追加します。

本文は `blocks` 配列で組み立てます。

| type | 用途 |
| --- | --- |
| `h2` / `h3` | 見出し |
| `p` | 段落 |
| `ul` / `ol` | 箇条書き／番号付きリスト |
| `note` | 黄色い罫線付きの注意書き |
| `table` | 比較表（`head` と `rows`） |
| `jobLink` | 関連求人への内部リンク（募集終了の求人は自動でリンクを外します） |

必須のメタ項目：

- `primaryKeyword` … 主軸キーワード（**1記事1クエリ**で設計する）
- `secondaryKeywords` … 補助キーワード
- `searchIntent` … 検索意図（固定ページとの役割分担を明確にするため）
- `verifiedFacts` … 記事内でJUNGLE固有の事実として書いている内容
- `updatedAt` … **内容を実際に修正したときだけ更新**（日付だけの自動更新は禁止）

### 執筆ルール

- 一般論とJUNGLEの条件を明確に分ける（コラム＝業界一般／固定ページ＝JUNGLEの話）
- JUNGLEの条件は確認済み情報だけを書く
- 冒頭で結論を示す
- 表や比較を使う
- 関連する求人・固定ページへリンクする
- 同じ導入文や見出し構成を使い回さない

### 今後追加を検討する記事（優先度A）

一度に大量公開せず、1記事ずつ品質を確認しながら追加してください。

1. 明石市の軽貨物ドライバー求人を選ぶときの確認項目
2. 兵庫県で軽貨物ドライバーを始める方法
3. 軽貨物の車両リース費用で確認すべきこと
4. 業務委託ドライバーの経費一覧
5. 軽貨物ドライバーの日当保証とは
6. 未経験者の同乗研修では何をするのか
7. 明石市の宅配で走る主要エリア
8. 宅配と企業配送はどちらが向いているか

**いずれも [docs/owner-checklist.md](docs/owner-checklist.md) の一次情報が集まってから書くほうが質が上がります。**

---

## 画像の差し替え方法

`public/images/` にファイルを置いて再ビルドするだけで、対応箇所が自動的に写真へ切り替わります。
画像が存在しない間は黒地に黄色のラインを引いた仮レイアウトが表示され、**壊れた画像は表示されません**。

ファイル名は検索エンジンが内容を推測できるよう、被写体と地域が分かる英語名にしています
（`akashi-light-cargo-driver-hero.webp` など）。一覧は [public/images/README.md](public/images/README.md) を参照してください。

- 形式は WebP または AVIF を推奨
- **Instagram の CDN URL を直接参照しないでください**（URLが失効します）
- alt は各ページに日本語で記述済みです。写真を差し替えたら alt も修正してください
- `image1.webp` `ChatGPT Image.png` のような無意味・長い日本語のファイル名は使わないでください

### ロゴ

| ファイル | 用途 | 参照元 |
| --- | --- | --- |
| `public/logo.jpg` | 構造化データの `Organization.logo` | `siteConfig.logo` |
| `public/logo-wordmark-transparent.webp` | ヘッダー（スクロール後の白背景） | `siteConfig.logoWordmark.onLight` |
| `public/logo-wordmark-on-dark.webp` | ヘッダー（ヒーロー上の透過時）・フッター | `siteConfig.logoWordmark.onDark` |

元の `logo.jpg` は正方形で余白が大きく、ヘッダーの高さに収めると文字が読めないため、余白を切り落とした横長版を用意しています。
横長版はどちらも白背景を透過済みです。暗い背景では黒の「TRANSPORT」とトラックが見えなくなるため、黒の部分を白にした版を用意し、
`<Logo tone="dark" />` で切り替えています。`public/logo-wordmark.webp` は透過前の元画像です。

### ファビコン

`src/app/` の `favicon.ico` / `icon.png` / `apple-icon.png` を使用しています。

### 画像コンポーネントの注意点

`<Photo>` は `next/image` の `fill` を成立させるため内部で `position: relative` を持っています。
**`className` に `absolute` を渡さないでください**（指定が衝突して高さが 0 になります）。
全面に敷きたい場合は外側を `<div className="absolute inset-0">` で包んでください。

---

## 問い合わせメールの設定

フォームは2種類あり、**目的別に窓口を分けています**。

| フォーム | 用途 | API |
| --- | --- | --- |
| `/entry` | ドライバー応募 | `/api/entry` |
| `/contact/business` | 法人からの配送依頼 | `/api/business-contact` |

いずれも [Resend](https://resend.com/) を使ってメールを送信します。

### 手順

1. Resend にアカウントを作成
2. **Domains** で送信元ドメインを追加し、DNS レコードを設定して認証を完了
3. **API Keys** で APIキーを発行
4. 以下の環境変数を Vercel（およびローカルの `.env.local`）に設定

```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_FROM_EMAIL=noreply@<Resendで認証したドメイン>
CONTACT_TO_EMAIL=ex.jsb.seco24@icloud.com

# 法人問い合わせだけ別のアドレスで受けたい場合（任意）
BUSINESS_CONTACT_TO_EMAIL=<法人問い合わせを受け取るメールアドレス>
```

> **`CONTACT_FROM_EMAIL` に iCloud のアドレスは使えません**
>
> 送信元（`CONTACT_FROM_EMAIL`）は **Resend で所有権を認証したドメインのアドレス**である必要があります。
> `ex.jsb.seco24@icloud.com` のようなフリーメールは、送信元としては指定できません。
>
> - **受信先（`CONTACT_TO_EMAIL`）** … `ex.jsb.seco24@icloud.com` をそのまま指定できます
> - **送信元（`CONTACT_FROM_EMAIL`）** … `jungle-transport24.com` を Resend の Domains に追加し、
>   DNS レコード（SPF / DKIM）を設定したうえで `noreply@jungle-transport24.com` などを指定してください
>
> ドメイン認証を行うまでは、Resend の検証用アドレス `onboarding@resend.dev` を
> `CONTACT_FROM_EMAIL` に指定することで動作確認だけは行えます（本番運用には使わないでください）。
>
> フォームからの通知は `reply_to` に応募者・依頼者のアドレスが入るため、
> 受信したメールにそのまま返信すれば相手に届きます。

### 未設定のときの挙動

環境変数が揃っていない場合、**成功画面は表示されません**。代わりに以下が表示されます。

- 利用者向け：お電話またはInstagramへの案内
- 管理者向け：**未設定の環境変数名の一覧**

架空の送信成功を表示しない設計です。環境変数が未設定でも `npm run build` は成功します。

---

## アクセス解析（GA4）

`NEXT_PUBLIC_GA_ID` に測定ID（`G-XXXXXXXXXX`）を設定すると計測タグが読み込まれます。
**未設定の場合はタグを一切出力しません。**

### 計測しているイベント

| イベント名 | 発火タイミング |
| --- | --- |
| `job_detail_view` | 求人詳細ページの閲覧 |
| `entry_form_start` | 応募フォームの入力開始 |
| `entry_form_submit` | 応募フォームの送信完了 |
| `business_contact_start` | 法人問い合わせフォームの入力開始 |
| `business_contact_submit` | 法人問い合わせフォームの送信完了 |
| `tel_tap` | 電話番号のタップ |
| `instagram_tap` | Instagramリンクのタップ |
| `job_to_entry` | 求人ページから応募フォームへの遷移 |
| `column_to_job` | コラムから求人ページへの遷移 |

実装は `src/lib/analytics.ts` と `src/components/analytics/` にあります。

> Cookie を使った計測を行うため、運用実態に合わせて `/privacy` のアクセス解析の記載を確認してください。

---

## Search Console 登録方法

**ドメインプロパティでの登録を推奨します**（wwwの有無を両方カバーできます）。

1. [Google Search Console](https://search.google.com/search-console) で「プロパティを追加」→「**ドメイン**」を選択
2. `jungle-transport24.com` を入力
3. 表示された TXT レコードをドメインの DNS に追加して所有権を確認

URLプレフィックスで登録する場合：

1. `https://www.jungle-transport24.com/` を指定
2. 「HTMLタグ」を選び、表示される `content` の値だけをコピー
3. 環境変数に設定して再デプロイ

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=XXXX
```

### 登録後に行う作業

1. **サイトマップ**に `sitemap.xml` を送信
2. **URL検査**で主要ページのインデックス登録をリクエスト
3. **拡張 → 求人情報** で JobPosting の検出状況を確認
4. **ページのインデックス登録**で除外理由を確認
5. **手動による対策**でペナルティが無いことを確認

詳細な手順は [docs/offpage-seo.md](docs/offpage-seo.md) を参照してください。

---

## Googleしごと検索の確認方法

1. 求人詳細ページが**ログインなしで閲覧できる**ことを確認
2. [リッチリザルトテスト](https://search.google.com/test/rich-results) に
   `https://www.jungle-transport24.com/jobs/akashi-light-cargo-driver` を入力し、
   `JobPosting` が検出されエラーが出ないことを確認
3. Search Console の **拡張 → 求人情報** で検出状況とエラーを確認
4. 「明石 軽貨物ドライバー 求人」で検索し、求人ボックスへの掲載を確認

### 本サイトの JobPosting 実装方針

- **求人詳細ページのみに設置**。求人一覧・採用ガイド・地域ページには設置していません
- `status: 'open'` かつ `verified: true` の求人でのみ出力します
- **構造化データの内容は画面の表示と一致させています**。画面に出していない条件を構造化データにだけ入れることはありません
- `jobLocation` には**実際に稼働する場所**（明石市・神戸市西区）を出力しています。会社所在地とは区別しています
- `validThrough` は募集期限が実在しないため出力していません
- 報酬は確定給与ではないため `estimatedSalary` として出力しています
- 応募方法をページ内に明示し、`directApply: true` を設定しています
- 職種名にキーワードを詰め込んでいません

---

## Indexing APIの設定

求人ページの公開・更新・募集終了を Google へ通知するスクリプトです。**実行は任意**で、設定していなくてもビルド・デプロイに影響しません。

> **Indexing API は求人詳細URLの通知にのみ使用してください。**
> 通常の記事やサービスページに使うことは Google のガイドラインで認められていません。

### Google Cloud 側の設定

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. **APIとサービス → ライブラリ** で「Indexing API」を検索し、**有効にする**

### サービスアカウントの作成

3. **IAMと管理 → サービスアカウント → サービスアカウントを作成**（ロールの付与は不要）
4. 作成したサービスアカウントを開き、**キー → 鍵を追加 → 新しい鍵を作成 → JSON**
5. ダウンロードした JSON をプロジェクト直下に `gcp-service-account.json` として保存
   **このファイルは `.gitignore` 済みです。絶対にコミットしないでください。**

### Search Console への権限追加

6. JSON 内の `client_email` をコピー
7. Search Console → 対象プロパティ → **設定 → ユーザーと権限 → ユーザーを追加**
8. コピーしたメールアドレスを追加し、権限を **オーナー** に設定

### 実行

```bash
# 求人の公開・更新を通知
npm run indexing:update -- https://www.jungle-transport24.com/jobs/akashi-light-cargo-driver

# URLを省略すると status: 'open' の求人すべてを通知
npm run indexing:update

# 募集終了を通知
npm run indexing:delete -- https://www.jungle-transport24.com/jobs/akashi-light-cargo-driver
```

---

## 構造化データの方針

実装は `src/lib/structured-data.ts` に集約しています。

| ページ | 出力される構造化データ |
| --- | --- |
| 全ページ | `Organization`（`publisher` / `provider` の `@id` 参照を解決するため） |
| `/` | `WebSite`、`FAQPage` |
| `/jobs/[slug]` | **`JobPosting`**、`BreadcrumbList`、`WebPage`、`FAQPage` |
| `/jobs` | `BreadcrumbList` のみ（**JobPosting は設置しない**） |
| `/recruit/[slug]` | `WebPage`、`BreadcrumbList`、`FAQPage`（**JobPosting は設置しない**） |
| `/area` | `CollectionPage`、`BreadcrumbList` |
| `/area/[slug]` | `WebPage`、`BreadcrumbList`、`FAQPage` |
| `/service` | `Service`、`BreadcrumbList` |
| `/service/[slug]` | `Service`、`WebPage`、`BreadcrumbList`、`FAQPage` |
| `/columns/[slug]` | `Article`、`BreadcrumbList`、`WebPage`、`FAQPage` |
| `/authors/jungle-recruitment` | `Person`、`WebPage`、`BreadcrumbList` |

### 守っているルール

- 画面に表示していない情報を構造化データだけに入れない
- 未確認（`verified: false`）の情報は出力しない
- 口コミが無いので `AggregateRating` は出力しない
- `LocalBusiness` は番地まで確認できた住所がある場合のみ出力する
- URL はすべて本番ドメインの絶対URLにする
- `FAQPage` は画面にFAQが表示されるページでのみ出力する
- `WebSite` はトップページのみ

---

## 環境変数一覧

| 変数名 | 必須 | 用途 | 未設定時の挙動 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 任意 | canonical / OGP / サイトマップの絶対URL | `https://www.jungle-transport24.com` を使用 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | 任意 | Search Console の所有権確認 | verification メタタグを出力しない |
| `NEXT_PUBLIC_GA_ID` | 任意 | Google Analytics 4 の測定ID | 計測タグを読み込まない |
| `RESEND_API_KEY` | フォーム利用時 | Resend の APIキー | フォーム送信不可・設定案内を表示 |
| `CONTACT_FROM_EMAIL` | フォーム利用時 | 送信元アドレス | 同上 |
| `CONTACT_TO_EMAIL` | フォーム利用時 | 応募通知の受信先 | 同上 |
| `BUSINESS_CONTACT_TO_EMAIL` | 任意 | 法人問い合わせの受信先を分ける場合 | `CONTACT_TO_EMAIL` を使用 |
| `GOOGLE_APPLICATION_CREDENTIALS` | 任意 | Indexing API 用 JSON のパス | スクリプト実行時のみエラー |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 任意 | Indexing API 用 JSON の中身 | 同上 |
| `SITE_URL` | 任意 | Indexing API でURLを省略実行する場合 | 同上 |

**いずれも未設定のまま `npm run build` は成功します。**

---

## ページ一覧

全38ページ。狙う検索意図の詳細は [docs/seo-keyword-map.md](docs/seo-keyword-map.md) を参照してください。

| パス | 内容 | 主な対策キーワード |
| --- | --- | --- |
| `/` | トップページ | 兵庫 軽貨物配送／明石 軽貨物配送 |
| `/service` | 事業内容 | 明石 配送会社 |
| `/service/home-delivery` | 個人宅向け宅配 | 明石 軽貨物 宅配 |
| `/service/business-delivery` | 企業向け配送 | 明石 企業配送 |
| `/contact/business` | 法人向け問い合わせ | 明石 配送 依頼 |
| `/area` | 対応エリア一覧 | 明石 神戸西 配送エリア |
| `/area/akashi` | 明石市 | 明石市 軽貨物配送 |
| `/area/kobe-nishi` | 神戸市西区 | 神戸市西区 軽貨物配送 |
| `/about` | JUNGLEについて | JUNGLE 軽貨物 |
| `/company` | 会社概要 | JUNGLE TRANSPORT 会社概要 |
| `/recruit` | 採用トップ | 兵庫 軽貨物ドライバー 求人 |
| `/recruit/akashi` | 明石で働く | 明石 軽貨物ドライバー 求人 |
| `/recruit/kobe-nishi` | 神戸市西区で働く | 神戸市西区 軽貨物ドライバー 求人 |
| `/recruit/beginner` | 未経験から始める | 軽貨物ドライバー 未経験 兵庫 |
| `/recruit/no-vehicle` | 車を持っていない方へ | 軽貨物ドライバー 車なし 兵庫 |
| `/recruit/contractor` | 業務委託について | 明石 業務委託ドライバー |
| `/jobs` | 求人一覧（**JobPostingなし**） | 兵庫 軽貨物 求人一覧 |
| `/jobs/[slug]` | 求人詳細（**JobPostingあり**） | 明石 軽貨物ドライバー 求人 |
| `/work` | 仕事内容 | 明石 軽貨物 仕事内容 |
| `/beginner` | 未経験の方へ | 軽貨物 未経験 必要なもの |
| `/daily-flow` | 1日の流れ | 軽貨物ドライバー 1日の流れ |
| `/faq` | よくある質問 | 軽貨物 業務委託 質問 |
| `/columns` `/columns/[slug]` | 採用コラム（8記事） | 記事ごとに設定 |
| `/authors/jungle-recruitment` | 運営者情報（E-E-A-T） | — |
| `/entry` | 応募フォーム | — |
| `/entry/thanks` | 送信完了（**noindex**） | — |
| `/contact/business/thanks` | 送信完了（**noindex**） | — |
| `/privacy` `/job-policy` | ポリシー | — |

---

## 情報の取り扱い方針

このサイトは、**確認が取れた情報のみを掲載する**方針で構築されています。

### 確認できている情報

公式Instagram（[@jungle.hyougo](https://www.instagram.com/jungle.hyougo/)）およびオーナーからの提供：

- 正式名称：**JUNGLE**／ブランド表記：**JUNGLE TRANSPORT**（ロゴより）
- 電話番号：**090-7756-2400**
- メールアドレス：**ex.jsb.seco24@icloud.com**
- 対象エリア：兵庫県明石市・神戸市西区
- 事業内容：軽貨物配送（宅配・企業配送）／引越し／遺品回収／不動産関連業務
- 募集条件：業務委託契約、要普通自動車運転免許、未経験可、女性歓迎
- 「未経験でも月収30万円〜可能」という**報酬例**
- 車両リースあり／日当保証あり
- 応募方法：当サイトのフォーム／お電話／Instagram のDM

### 未確認のため掲載していない情報

`src/data/company.ts` の `companyTodos()`、`src/data/jobs.ts` の `toConfirm`、
`src/data/areas.ts` の `unverifiedNotes`、`src/data/services.ts` の `unverifiedNotes` に集約しています。

**優先度順の一覧は [docs/owner-checklist.md](docs/owner-checklist.md) を参照してください。**

### 絶対にやらないこと

- 未確認の情報を推測で埋める
- 実在しない求人・勤務地を作る
- 地域名だけを差し替えたページを量産する
- 内容がほぼ同じ記事を大量生成する
- 全記事の日付だけを自動更新する
- 架空の口コミ・取引実績を掲載する
- 実際に行っていないサービスを掲載する
- 検索エンジンにだけ見せる文章を入れる
