/**
 * サイト全体の共通設定。
 * ここに書かれた値は全ページの metadata / 構造化データ / フッターから参照されます。
 */

export const siteConfig = {
  /** 表示用ブランド名（ロゴ表記に合わせる） */
  name: 'JUNGLE TRANSPORT',
  /** 短縮名。ページタイトル末尾などに使用 */
  shortName: 'JUNGLE',
  /** 本番URL。Vercelのプロジェクト設定 or .env の NEXT_PUBLIC_SITE_URL で上書き可能 */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://jungle-transport.jp',
  /** サイト全体のデフォルト説明文 */
  description:
    '兵庫県・明石市を拠点に軽貨物配送を行うJUNGLE TRANSPORT。宅配・企業配送を中心に、明石・神戸西エリアで走る軽貨物ドライバーを募集しています。',
  locale: 'ja_JP',
  /** OGP画像（1200×630）。/public に配置 */
  ogImage: '/ogp.webp',
  /** ロゴ画像（構造化データの logo に使用） */
  logo: '/logo.jpg',
  /**
   * ヘッダー・フッターの表示に使うロゴ。
   * 元の logo.jpg は正方形で余白が大きく、ヘッダーの高さに収めると文字が読めないため、
   * 余白を切り落とした横長版を用意しています。
   */
  logoWordmark: '/logo-wordmark.webp',
  /** Google Search Console の所有権確認コード（.env の NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION） */
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
} as const;

/**
 * 外部リンク。
 * 確認できていない連絡手段（電話・LINE・メール）は null のままにしてください。
 * null の項目はサイト上に一切表示されません。
 */
export const socialLinks = {
  /** Instagram：確認済み */
  instagram: 'https://www.instagram.com/jungle.hyougo/' as string,
  /** TODO: 公式LINEが存在する場合にURLを設定（未確認のため null） */
  line: null as string | null,
  /** 問い合わせ・応募用の電話番号（確認済み） */
  tel: '090-7756-2400' as string | null,
  /** TODO: 公開可能な問い合わせメールが確認でき次第設定（未確認のため null） */
  email: null as string | null,
} as const;

/** ヘッダーのグローバルナビゲーション */
export const headerNav = [
  { href: '/jobs', label: '求人情報' },
  { href: '/work', label: '仕事内容' },
  { href: '/beginner', label: '未経験の方へ' },
  { href: '/company', label: '会社情報' },
] as const;

/** フッターのナビゲーション（見出しごとにグルーピング） */
export const footerNav = [
  {
    heading: 'JUNGLEについて',
    links: [
      { href: '/about', label: 'JUNGLEについて' },
      { href: '/service', label: '事業内容' },
      { href: '/company', label: '会社概要' },
    ],
  },
  {
    heading: '採用情報',
    links: [
      { href: '/recruit', label: '採用トップ' },
      { href: '/jobs', label: '求人一覧' },
      { href: '/work', label: '仕事内容' },
      { href: '/beginner', label: '未経験の方へ' },
      { href: '/daily-flow', label: '1日の流れ' },
      { href: '/faq', label: 'よくある質問' },
      { href: '/columns', label: '採用コラム' },
    ],
  },
  {
    heading: '応募・その他',
    links: [
      { href: '/entry', label: '応募フォーム' },
      { href: '/privacy', label: 'プライバシーポリシー' },
      { href: '/job-policy', label: '求人情報掲載・更新方針' },
    ],
  },
] as const;
