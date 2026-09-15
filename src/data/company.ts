/**
 * 会社情報の一元管理ファイル。
 *
 * ■ 基本ルール
 *   すべての項目を { value, verified, todo } の形で持ちます。
 *   - verified: false または value: null の項目は、画面にも構造化データにも一切出力されません。
 *   - 推測値・ダミー値を絶対に入れないでください。
 *   - 判明した時点で value を埋めて verified: true にすれば、会社概要・フッター・
 *     求人詳細・構造化データすべてに自動反映されます。
 *
 * ■ 未確認項目の確認先
 *   README の「オーナーへ確認が必要な情報」に一覧化しています。
 */

export type Field = {
  /** 未確認の場合は null */
  value: string | null;
  /** 事実確認が取れているか。false の間は公開画面に出しません */
  verified: boolean;
  /** 未確認の場合の確認事項 */
  todo?: string;
};

const unverified = (todo: string): Field => ({ value: null, verified: false, todo });
const confirmed = (value: string): Field => ({ value, verified: true });

/** 表示してよい値だけを取り出す。未確認なら null を返します */
export const show = (field: Field): string | null => (field.verified && field.value ? field.value : null);

export const company = {
  /** ブランド表記（ロゴ表記より確認済み） */
  brandName: confirmed('JUNGLE TRANSPORT'),
  /** 正式名称（オーナー確認済み） */
  legalName: confirmed('JUNGLE'),
  /** 屋号 */
  tradeName: confirmed('JUNGLE TRANSPORT'),

  representative: unverified('代表者名。会社概要とOrganization構造化データに使用します'),
  postalCode: unverified('本店所在地の郵便番号'),
  /** 所在地（オーナー確認済み・公開可） */
  addressRegion: confirmed('兵庫県'),
  addressLocality: confirmed('神戸市西区'),
  streetAddress: confirmed('玉津町出合44-1'),

  tel: confirmed('090-7756-2400'),
  telHours: unverified('電話の受付時間（例: 9:00〜18:00）'),

  founded: unverified('設立年月'),
  capital: unverified('資本金'),
  employees: unverified('稼働ドライバー数・従業員数'),
  licenseNumber: unverified('貨物軽自動車運送事業の届出番号（届出年月日と運輸支局名を含む）'),
  corporateNumber: unverified('法人番号（法人の場合）。個人事業の場合はその旨'),

  /** 事業内容（Instagramプロフィールで確認済み） */
  businessSummary: confirmed('軽貨物配送（個人宅向け宅配・企業向け配送）／引越し／遺品回収／不動産関連業務'),
  /** 稼働エリア（Instagram求人投稿で確認済み） */
  serviceArea: confirmed('兵庫県明石市・神戸市西部を中心とした地域'),
} as const;

/** 住所を1行にまとめる。未確認部分は出力しません */
export function formattedAddress(): string | null {
  const region = show(company.addressRegion);
  const locality = show(company.addressLocality);
  if (!region || !locality) return null;
  const postal = show(company.postalCode);
  const street = show(company.streetAddress);
  return `${postal ? `〒${postal} ` : ''}${region}${locality}${street ?? ''}`;
}

/**
 * LocalBusiness 構造化データを出力してよいか。
 * 番地まで確認できた住所がないと、Googleのローカル検索では逆効果になるため、
 * streetAddress が確認できるまで false のままにします。
 */
export const canPublishLocalBusiness = () => Boolean(show(company.streetAddress));

/* -------------------------- 会社概要ページのテーブル -------------------------- */

export type CompanyRow = { label: string; value: string | null; note?: string };

/** value が null の行は自動的に非表示になります */
export const companyProfileRows = (): CompanyRow[] =>
  [
    { label: '正式名称', value: show(company.legalName) },
    { label: 'ブランド表記', value: show(company.brandName), note: 'ロゴ・サイト上の表記' },
    { label: '代表者', value: show(company.representative) },
    { label: '所在地', value: formattedAddress() },
    { label: '電話番号', value: show(company.tel), note: '配送のご依頼・採用のお問い合わせを承ります' },
    { label: '受付時間', value: show(company.telHours) },
    { label: '設立', value: show(company.founded) },
    { label: '資本金', value: show(company.capital) },
    { label: '事業内容', value: show(company.businessSummary) },
    { label: '主な稼働エリア', value: show(company.serviceArea) },
    { label: '従業員数', value: show(company.employees) },
    { label: '貨物軽自動車運送事業 届出番号', value: show(company.licenseNumber) },
    { label: '法人番号', value: show(company.corporateNumber) },
    {
      label: 'お問い合わせ',
      value: 'お電話／Instagram ダイレクトメッセージ（ドライバー応募は当サイトの応募フォーム）',
    },
  ].filter((row) => row.value !== null) as CompanyRow[];

/**
 * 未確認項目の一覧。会社概要ページと README に反映されます。
 * company の各フィールドから自動生成するため、値を埋めれば自動的に消えます。
 */
export const companyTodos = (): string[] =>
  Object.values(company)
    .filter((f): f is Field => typeof f === 'object' && f !== null && 'verified' in f)
    .filter((f) => !f.verified && f.todo)
    .map((f) => f.todo as string);
