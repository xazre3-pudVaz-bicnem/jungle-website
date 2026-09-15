# コード外で必要なSEO施策

サイトの実装だけでは完結しない施策の手順です。
**特にローカル検索（明石・神戸西での検索）は、Googleビジネスプロフィールの整備が最も効果的です。**

---

## 1. Googleビジネスプロフィール（最優先）

「明石 軽貨物」「明石 配送会社」といったローカル検索で表示されるために必要です。

1. <https://business.google.com/> でビジネスプロフィールを作成
2. ビジネス名は **サイト表記と完全に一致させる**（例：`JUNGLE TRANSPORT`）
3. カテゴリは「宅配業者」「運送会社」など実態に合うものを選択
4. 住所を登録（非公開にしてサービス提供地域のみ表示することも可能）
5. サービス提供地域に **明石市／神戸市西区** を登録
6. 電話番号は **090-7756-2400**（サイト・Instagramと完全一致させる）
7. ウェブサイトに **<https://www.jungle-transport24.com/>** を登録
8. ハガキ等でオーナー確認を完了させる
9. 実際の配送写真を投稿する（サイトで使用している写真と同じもので可）
10. 確認が完了したらプロフィールURLを `src/data/site.ts` の `googleBusinessProfile` に設定
    → `Organization.sameAs` に自動追加されます

## 2. NAP情報の統一

**N**ame / **A**ddress / **P**hone を、掲載するすべての場所で**一字一句同じ表記**にします。表記ゆれはローカル検索の評価を下げます。

| 項目 | 統一する表記 |
| --- | --- |
| 名称 | JUNGLE TRANSPORT |
| 正式名称 | JUNGLE |
| 電話番号 | 090-7756-2400 |
| 住所 | （番地確定後に統一表記を決める） |

統一する対象：公式サイト／Googleビジネスプロフィール／Instagram／求人媒体／各種ディレクトリ

## 3. Instagramからの導線

1. プロフィールのリンク欄に <https://www.jungle-transport24.com/> を設定
2. 求人投稿のキャプションに求人詳細ページのURLを記載
   → `https://www.jungle-transport24.com/jobs/akashi-light-cargo-driver`
3. プロフィール文にサイトと同じ事業者定義を入れる
   → 「兵庫県明石市・神戸市西区で個人宅向け宅配と企業向け配送を行う軽貨物配送事業者」
4. ハイライトに「求人」「配送のご依頼」を作り、それぞれの導線を作る

## 4. Search Console

1. <https://search.google.com/search-console> で **ドメインプロパティ** を追加
   - `jungle-transport24.com` を入力（www の有無を両方カバーできます）
   - DNSのTXTレコードで所有権を確認（ドメイン管理画面で追加）
   - URLプレフィックスで登録する場合は `https://www.jungle-transport24.com/` を指定し、
     `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` に content の値を設定
2. **サイトマップを送信**：`sitemap.xml`
3. **URL検査**で以下を個別にインデックス登録リクエスト
   - `/`
   - `/jobs/akashi-light-cargo-driver`
   - `/recruit` `/recruit/akashi` `/recruit/kobe-nishi`
   - `/area/akashi` `/area/kobe-nishi`
   - `/service/home-delivery` `/service/business-delivery`
4. **拡張 → 求人情報**：JobPosting の検出状況とエラーを確認
5. **ページのインデックス登録**：除外されているページとその理由を確認
6. **手動による対策**：ペナルティが無いことを確認
7. 旧ドメイン（`jungle-transport.jp`）で登録していた場合は、そのプロパティは不要です

> **重要**：修正前は canonical が実在しないドメインを指していたため、インデックスされていない可能性が高い状態でした。
> デプロイ後は必ずサイトマップ送信とURL検査を行ってください。

## 5. Bing Webmaster Tools

1. <https://www.bing.com/webmasters> に登録
2. Search Console からインポートすると設定が引き継げます
3. サイトマップを送信

## 6. Googleしごと検索の確認

1. [リッチリザルトテスト](https://search.google.com/test/rich-results) に
   `https://www.jungle-transport24.com/jobs/akashi-light-cargo-driver` を入力
2. `JobPosting` が検出され、エラーが出ないことを確認
3. Search Console の「拡張 → 求人情報」で検出状況を確認
4. Google で「明石 軽貨物ドライバー 求人」と検索し、求人ボックスへの掲載を確認
5. 求人を更新・終了したときは Indexing API で通知（README参照）

## 7. 求人媒体への掲載

Indeed・求人ボックス・スタンバイなどは、公式サイトの求人ページをクロールして掲載する場合があります。
掲載条件をサイトと一致させ、媒体側にも同じ内容を登録してください。**媒体とサイトで条件が食い違うと応募者の不信につながります。**

## 8. 地域の事業者ディレクトリ

- 明石商工会議所などの地域団体
- 兵庫県の運送事業者一覧
- 軽貨物運送の業界団体

いずれも**実際に加入・登録している場合のみ**掲載してください。

## 9. 被リンク獲得（自然な範囲で）

- 取引先企業のサイトに「配送協力：JUNGLE TRANSPORT」として掲載してもらう（**掲載許可を得たうえで**）
- 地域の情報サイトへの掲載
- Instagramからの流入

> **禁止**：有料リンクの購入、リンクファーム、相互リンク目的だけのページ作成。
> Googleのガイドライン違反となり、手動対策の対象になります。

## 10. 継続的な運用

| 頻度 | 作業 |
| --- | --- |
| 求人内容の変更時 | `jobs.ts` を更新 → `updatedAt` も更新 → デプロイ → `npm run indexing:update` |
| 募集終了時 | `status: 'closed'` に変更 → デプロイ → `npm run indexing:delete` |
| 月1回 | Search Console のエラー・掲載状況を確認 |
| 情報が確認できたとき | `docs/owner-checklist.md` に従ってデータファイルを更新 |
| 記事を実際に修正したとき | `updatedAt` を更新（**日付だけの更新は行わない**） |

---

## やってはいけないこと

- 架空の口コミ・評価を作る（`AggregateRating` を実態なく出力しない）
- 架空の取引実績を掲載する
- 実在しない勤務地・求人を作る
- 地域名だけを差し替えたページを量産する
- 内容がほぼ同じ記事を大量生成する
- 全記事の日付だけを自動更新する
