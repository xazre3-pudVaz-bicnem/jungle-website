/**
 * サイト全体の共通設定。
 * ここに書かれた値は全ページの metadata / 構造化データ / フッターから参照されます。
 */

/** 本番ドメイン（wwwあり・httpsで統一）。canonical・OGP・サイトマップの絶対URLの基準になります */
const PRODUCTION_URL = 'https://www.jungle-transport24.com';

export const siteConfig = {
  /** 表示用ブランド名（ロゴ表記に合わせる） */
  name: 'JUNGLE TRANSPORT',
  /** 短縮名。ページタイトル末尾などに使用 */
  shortName: 'JUNGLE',
  /**
   * 本番URL。
   * NEXT_PUBLIC_SITE_URL で上書きできますが、未設定でも本番ドメインになるようにしています
   * （以前は実在しないドメインが既定値になっており、canonical がすべて誤っていました）。
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL).replace(/\/$/, ''),
  /** サイト全体のデフォルト説明文 */
  description:
    'JUNGLE TRANSPORTは、兵庫県明石市・神戸市西部を中心に個人宅向け宅配と企業向け配送を行う軽貨物配送事業者です。軽貨物ドライバーを募集しています。',
  locale: 'ja_JP',
  /** OGP画像（1200×630）。/public に配置 */
  ogImage: '/ogp.webp',
  /** ロゴ画像（構造化データの logo に使用） */
  logo: '/logo.jpg',
  /**
   * ヘッダー・フッターの表示に使うロゴ。
   * 元の logo.jpg は正方形で余白が大きく、ヘッダーの高さに収めると文字が読めないため、
   * 余白を切り落とした横長版を用意しています。
   * どちらも白背景を透過済みです。
   */
  logoWordmark: {
    /** 明るい背景用（黄＋黒の元配色） */
    onLight: '/logo-wordmark-transparent.webp',
    /** 暗い背景用（黒の部分を白に反転） */
    onDark: '/logo-wordmark-on-dark.webp',
  },
  /** Google Search Console の所有権確認コード（.env の NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION） */
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  /** Google Analytics 4 の測定ID（.env の NEXT_PUBLIC_GA_ID）。未設定なら計測タグを出力しません */
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
} as const;

/**
 * 事業者の定義文。AI検索や検索結果で事業内容が正しく理解されるよう、
 * 主要ページで一貫した表現を使います。
 * ページごとにそのまま全文コピーせず、文脈に合わせて使い分けてください。
 */
export const businessDefinition =
  'JUNGLE TRANSPORTは、兵庫県明石市・神戸市西部を中心に、個人宅向けの宅配と企業向けの配送を行う軽貨物配送事業者です。';

/**
 * 外部リンク。
 * 確認できていない連絡手段（LINE・メール）は null のままにしてください。
 * null の項目はサイト上に一切表示されません。
 */
export const socialLinks = {
  /** Instagram：確認済み */
  instagram: 'https://www.instagram.com/jungle.hyougo/' as string,
  /** TODO: 公式LINEが存在する場合にURLを設定（未確認のため null） */
  line: null as string | null,
  /** 問い合わせ・応募用の電話番号（確認済み） */
  tel: '090-7756-2400' as string | null,
  /** 問い合わせ用メールアドレス（確認済み） */
  email: 'ex.jsb.seco24@icloud.com' as string | null,
  /**
   * TODO: GoogleビジネスプロフィールのURL。
   * 作成後にここへ設定すると Organization の sameAs に自動で追加されます。
   * ローカル検索対策として優先度が高い項目です（手順は README を参照）。
   */
  googleBusinessProfile: null as string | null,
} as const;

/** ヘッダーのグローバルナビゲーション */
export const headerNav = [
  { href: '/recruit', label: '採用情報' },
  { href: '/jobs', label: '求人一覧' },
  { href: '/service', label: '事業内容' },
  { href: '/area', label: '対応エリア' },
  { href: '/company', label: '会社情報' },
] as const;

/** フッターのナビゲーション（見出しごとにグルーピング） */
export const footerNav = [
  {
    heading: '事業・会社',
    links: [
      { href: '/service', label: '事業内容' },
      { href: '/service/home-delivery', label: '個人宅向け宅配' },
      { href: '/service/business-delivery', label: '企業向け配送' },
      { href: '/contact/business', label: '配送のご依頼（法人）' },
      { href: '/about', label: 'JUNGLEについて' },
      { href: '/company', label: '会社概要' },
    ],
  },
  {
    heading: '採用情報',
    links: [
      { href: '/recruit', label: '採用トップ' },
      { href: '/jobs', label: '求人一覧' },
      { href: '/recruit/akashi', label: '明石市で働く' },
      { href: '/recruit/kobe-nishi', label: '神戸市西区で働く' },
      { href: '/recruit/beginner', label: '未経験から始める' },
      { href: '/recruit/no-vehicle', label: '車を持っていない方へ' },
      { href: '/recruit/contractor', label: '業務委託について' },
    ],
  },
  {
    heading: '仕事を知る',
    links: [
      { href: '/work', label: '仕事内容' },
      { href: '/beginner', label: '未経験の方へ' },
      { href: '/daily-flow', label: '1日の流れ' },
      { href: '/area', label: '対応エリア' },
      { href: '/faq', label: 'よくある質問' },
      { href: '/columns', label: '採用コラム' },
    ],
  },
  {
    heading: '応募・その他',
    links: [
      { href: '/entry', label: '応募フォーム' },
      { href: '/authors/jungle-recruitment', label: '運営者情報' },
      { href: '/privacy', label: 'プライバシーポリシー' },
      { href: '/job-policy', label: '求人情報掲載・更新方針' },
    ],
  },
] as const;
