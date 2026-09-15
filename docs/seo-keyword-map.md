# キーワードマップ

ページごとの役割と狙う検索意図の一覧です。**同じ検索語を複数ページで奪い合わないこと**を最優先に設計しています。
ページを追加する前に、このマップで既存ページと競合しないかを確認してください。

## 役割の分け方

| 種類 | 役割 | 例 |
| --- | --- | --- |
| 公式固定ページ | JUNGLEの実際の事業内容・求人条件・制度を説明する | `/service` `/work` `/jobs/[slug]` |
| 地域ページ | エリアごとの配送実態と地理を説明する | `/area/akashi` |
| 採用ガイド | 応募前の疑問に条件別に答える（求人票のコピーではない） | `/recruit/beginner` |
| コラム | 軽貨物業界一般の仕組みと判断材料を説明する | `/columns/...` |

**固定ページ＝JUNGLEの話／コラム＝業界一般の話** という切り分けを守ってください。

---

## クラスター1：求人

| URL | 主軸キーワード | 補助キーワード | 検索意図 |
| --- | --- | --- | --- |
| `/recruit` | 兵庫 軽貨物ドライバー 求人 | 兵庫 ドライバー 募集 | 兵庫県で軽貨物の仕事を探している |
| `/jobs` | 兵庫 軽貨物 求人一覧 | JUNGLE 軽貨物 求人 | 募集中の求人をまとめて見たい |
| `/jobs/akashi-light-cargo-driver` | **明石 軽貨物ドライバー 求人** | 明石 配送ドライバー 求人／明石 業務委託ドライバー | 明石の求人条件を具体的に知りたい（**最重要ページ**） |
| `/recruit/akashi` | 明石 軽貨物ドライバー 求人（情報収集段階） | 明石市 ドライバー 募集 | 明石で働く場合の実態を知りたい |
| `/recruit/kobe-nishi` | 神戸市西区 軽貨物ドライバー 求人 | 神戸西 軽貨物 求人 | 西区で働く場合の実態を知りたい |
| `/recruit/beginner` | 軽貨物ドライバー 未経験 兵庫 | 明石 配送ドライバー 未経験 | 未経験でも始められるか知りたい |
| `/recruit/no-vehicle` | 軽貨物ドライバー 車なし 兵庫 | 軽貨物 車両リース 明石 | 車がなくても始められるか知りたい |
| `/recruit/contractor` | 明石 業務委託ドライバー | 兵庫 軽貨物 業務委託 | 業務委託の仕組みと注意点を知りたい |

> `/jobs/akashi-light-cargo-driver` と `/recruit/akashi` の関係
> 求人詳細＝**募集要項そのもの**（JobPostingあり）。採用ガイド＝**応募前の疑問への回答**（JobPostingなし）。
> ガイドからは必ず求人詳細へリンクし、「正式な募集要項はこちら」と明示しています。

## クラスター2：仕事内容

| URL | 主軸キーワード | 検索意図 |
| --- | --- | --- |
| `/work` | 明石 軽貨物 仕事内容 | JUNGLEで担当する仕事の中身を知りたい |
| `/daily-flow` | 軽貨物ドライバー 1日の流れ | 稼働日の進み方を知りたい |
| `/beginner` | 軽貨物 未経験 必要なもの | JUNGLEの未経験者向け制度を知りたい |
| `/columns/light-cargo-driver-job-description` | 軽貨物ドライバー 仕事内容（業界一般） | 職種そのものを理解したい |

> `/work` と `/columns/light-cargo-driver-job-description` のすみ分け
> `/work` は「JUNGLEで担当する仕事」、コラムは「軽貨物ドライバーという職種の一般的な説明」。
> `/beginner` と `/recruit/beginner` は、前者が制度の説明、後者が検索流入用のガイドです。

## クラスター3：契約・報酬

| URL | 主軸キーワード |
| --- | --- |
| `/columns/contractor-driver-explained` | 業務委託ドライバー とは |
| `/columns/driver-income-and-expenses` | 軽貨物ドライバー 報酬 経費 |
| `/columns/own-vehicle-vs-lease` | 軽貨物 車両リース 持ち込み 違い |
| `/columns/required-license-for-light-cargo` | 軽貨物ドライバー 必要な免許 |
| `/columns/checkpoints-before-applying` | 軽貨物 求人 選び方 |
| `/job-policy` | （検索流入は狙わない。信頼性の担保） |

## クラスター4：地域

| URL | 主軸キーワード |
| --- | --- |
| `/area` | 明石 神戸西 配送エリア |
| `/area/akashi` | 明石市 軽貨物配送 |
| `/area/kobe-nishi` | 神戸市西区 軽貨物配送 |
| `/columns/working-in-akashi` | 明石 軽貨物ドライバー 特徴 |

## クラスター5：法人向け配送

| URL | 主軸キーワード |
| --- | --- |
| `/service` | 明石 配送会社／兵庫 軽貨物配送 |
| `/service/home-delivery` | 明石 軽貨物 宅配／明石 個人宅配送 |
| `/service/business-delivery` | 明石 企業配送／神戸西 ルート配送 |
| `/contact/business` | 明石 配送 依頼 |

## トップ・会社

| URL | 主軸キーワード |
| --- | --- |
| `/` | 兵庫 軽貨物配送／明石 軽貨物配送／JUNGLE TRANSPORT |
| `/about` | JUNGLE 軽貨物 考え方 |
| `/company` | JUNGLE TRANSPORT 会社概要 |
| `/authors/jungle-recruitment` | （検索流入は狙わない。E-E-A-Tの担保） |

---

## ページを追加するときのチェック

1. 既存ページと主軸キーワードが重複していないか
2. そのページにしか書けない内容があるか（地域名の差し替えだけになっていないか）
3. 一般論とJUNGLEの条件が混ざっていないか
4. 求人詳細以外に JobPosting を置いていないか
5. 親ページ・子ページ・関連求人への内部リンクがあるか
