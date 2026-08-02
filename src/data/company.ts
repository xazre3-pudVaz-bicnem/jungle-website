/**
 * 会社情報。
 *
 * ■ 重要なルール
 * value が null の項目は「未確認」を意味し、画面には一切表示されません。
 * 推測値・ダミー値を入れないでください。判明した時点で value を埋めれば、
 * 会社概要ページ・フッター・構造化データすべてに自動反映されます。
 */

export type CompanyField = {
  /** 会社概要テーブルの項目名 */
  label: string;
  /** 未確認の場合は null（画面に出さない） */
  value: string | null;
  /** 補足説明（任意） */
  note?: string;
};

export const company = {
  /** 屋号・ブランド名（ロゴ表記より確認済み） */
  name: 'JUNGLE TRANSPORT',
  /** 正式名称（確認済み）。ロゴ表記の「JUNGLE TRANSPORT」はブランド表記として併用します */
  legalName: 'JUNGLE' as string | null,
  /** 事業拠点エリア（Instagramプロフィール「📍兵庫エリア」より） */
  areaLabel: '兵庫エリア',
  /** 主たる営業エリア（Instagram求人投稿「明石・神戸西エリア」より） */
  primaryArea: '明石・神戸西エリア',

  /**
   * 住所。すべて未確認のため null。
   * 判明したら埋めることで、会社概要ページとJobPostingのjobLocationに反映されます。
   */
  address: {
    postalCode: null as string | null,
    region: '兵庫県',
    locality: '明石市',
    street: null as string | null,
    /** 番地まで公開してよいかが未確認のため、市区町村までを構造化データに使用 */
    isStreetPublic: false,
  },

  /** TODO: 代表者名が未確認 */
  representative: null as string | null,
  /** TODO: 設立年月が未確認 */
  founded: null as string | null,
  /** TODO: 資本金が未確認 */
  capital: null as string | null,
  /** TODO: 従業員数・稼働ドライバー数が未確認 */
  employees: null as string | null,
  /** TODO: 貨物軽自動車運送事業の届出番号が未確認 */
  licenseNumber: null as string | null,
} as const;

/**
 * 会社概要ページのテーブル。
 * value が null の行は自動的に非表示になります。
 */
export const companyProfileRows: CompanyField[] = [
  { label: '正式名称', value: company.legalName },
  { label: 'ブランド表記', value: company.name, note: 'ロゴ・サイト上の表記' },
  { label: '代表者', value: company.representative },
  { label: '所在地', value: null, note: '公開情報が確認でき次第掲載します' },
  { label: '電話番号', value: '090-7756-2400', note: '配送のご依頼・採用のお問い合わせを承ります' },
  { label: '設立', value: company.founded },
  { label: '資本金', value: company.capital },
  {
    label: '事業内容',
    value: '軽貨物配送（宅配・企業配送）／不動産関連業務／引越し／遺品回収 ほか',
    note: 'Instagramプロフィール記載の事業内容にもとづきます',
  },
  { label: '主な稼働エリア', value: '兵庫県（明石市・神戸市西部を中心に）' },
  { label: '従業員数', value: company.employees },
  { label: '貨物軽自動車運送事業 届出番号', value: company.licenseNumber },
  { label: 'お問い合わせ', value: 'お電話／Instagram ダイレクトメッセージ／当サイトの応募フォーム' },
];

/**
 * 未確認情報の一覧。
 * /company ページと README に反映され、運用者が埋めるべき項目が一目で分かります。
 */
export const companyTodos = [
  '本店所在地・郵便番号',
  '代表者名',
  '設立年月',
  '資本金',
  '稼働ドライバー数・従業員数',
  '貨物軽自動車運送事業の届出番号',
  '公開可能な問い合わせメールアドレス',
  '公式LINEアカウントの有無とURL',
  '電話の受付時間',
] as const;
