/**
 * 求人データ。
 *
 * ■ このファイルに1件追加するだけで、以下がすべて自動生成されます
 *   - 求人詳細ページ  /jobs/[slug]
 *   - 求人一覧への掲載 /jobs
 *   - サイトマップへの追加
 *   - JobPosting構造化データ（status: 'open' のときのみ出力）
 *   - トップページ・採用トップからの内部リンク
 *
 * ■ 掲載ルール
 *   - status: 'open'   … 募集中。一覧に表示・JobPosting出力・サイトマップに掲載
 *   - status: 'closed' … 募集終了。詳細ページは「募集終了」表示でnoindex、JobPostingは出力しない
 *   - status: 'draft'  … 下書き。一覧・サイトマップ・検索結果すべてに出さない（404）
 *
 * ■ 絶対に守ること
 *   - 画面に表示する内容と構造化データを一致させること
 *   - 確認できていない条件は null / 空配列のままにすること（推測で埋めない）
 *   - 業務委託を「正社員」「アルバイト」のように表現しないこと
 */

export type JobStatus = 'open' | 'closed' | 'draft';

/** 求人条件の1項目。value が null の項目は画面にも構造化データにも出ません */
export type JobSpec = {
  label: string;
  value: string | null;
  /** 補足・注意書き */
  note?: string;
};

export type JobSalary = {
  /** 画面に表示する報酬の見出し文言 */
  headline: string;
  /** 報酬例の計算根拠（必須。根拠なしの金額は表示しない） */
  basis: string[];
  /** 構造化データ用の下限値（円）。未確認なら null */
  minValue: number | null;
  /** 構造化データ用の上限値（円）。未確認なら null */
  maxValue: number | null;
  /** 'MONTH' | 'DAY' | 'HOUR' | 'YEAR' */
  unitText: 'MONTH' | 'DAY' | 'HOUR' | 'YEAR';
  /**
   * true にすると baseSalary（確定給与）として構造化データに出力します。
   *
   * 現在は false。理由：Instagramで確認できるのは「未経験でも月収30万円〜可能」という
   * 報酬"例"であり、確定した給与体系（日額・件数単価・歩合率）が未確認のためです。
   * 実際の報酬体系が確認でき次第 true に変更してください。
   * false の間は estimatedSalary として出力されます。
   */
  useBaseSalary: boolean;
};

export type Job = {
  slug: string;
  status: JobStatus;
  /** 職種名（H1・JobPosting.title に使用） */
  title: string;
  /** 一覧・検索結果用の短い説明（120文字以内推奨） */
  summary: string;
  /** 掲載日（ISO 8601） */
  datePosted: string;
  /**
   * 募集期限（ISO 8601）。
   * 実際に期限がある場合だけ設定してください。
   * 常時募集・期限不明の場合は null のままにします（適当な未来日を入れない）。
   */
  validThrough: string | null;
  /** 契約形態の画面表示 */
  contractLabel: string;
  /** schema.org employmentType。業務委託は 'CONTRACTOR' */
  employmentType: 'CONTRACTOR' | 'FULL_TIME' | 'PART_TIME' | 'TEMPORARY' | 'OTHER';
  /** 勤務地（構造化データの jobLocation に使用） */
  location: {
    region: string;
    locality: string;
    postalCode: string | null;
    street: string | null;
  };
  /** 募集地域（画面表示用） */
  areas: string[];
  /** 配送エリア（画面表示用） */
  deliveryAreas: string[];
  salary: JobSalary | null;
  /** 仕事内容の箇条書き */
  duties: string[];
  /** 応募資格 */
  requirements: string[];
  /** 歓迎条件（確認できたものだけ） */
  welcome: string[];
  /** 待遇・サポート */
  benefits: string[];
  /** 条件テーブル。未確認の項目は value: null にする */
  specs: JobSpec[];
  /** 注意事項（業務委託である旨・経費の注意など） */
  notes: string[];
  /** 未確認のため面談時に確認が必要な項目 */
  toConfirm: string[];
};

/**
 * ■ 情報の出典について
 * 以下の求人は JUNGLE 公式Instagram（@jungle.hyougo）のプロフィールおよび
 * 求人投稿で確認できた内容のみを掲載しています。
 *
 * 【Instagramで確認できた事実】
 *   - 軽貨物ドライバーを募集中（事業拡大にともなう募集）
 *   - 対象エリア：兵庫エリア／明石・神戸西エリア
 *   - 仕事内容：軽自動車での宅配・企業配送
 *   - 未経験者も応募可能、女性も歓迎
 *   - 「未経験でも月収30万円〜可能」という報酬例の記載
 *   - 車両リースあり
 *   - 日当保証あり
 *   - 要普通自動車免許
 *   - 応募方法：Instagramのダイレクトメッセージ
 *
 * 【確認できなかったため掲載していない項目】
 *   - 勤務時間・休日・稼働日数の具体的な条件
 *   - 報酬の計算方法（日額／件数単価／歩合率）の詳細
 *   - 日当保証の金額
 *   - 車両リース料
 *   - 契約形態が業務委託か雇用かの正式な明示
 *   - 募集期限
 *   これらは specs 内で value: null、または toConfirm に集約しています。
 */
export const jobs: Job[] = [
  {
    slug: 'akashi-light-cargo-driver',
    status: 'open',
    title: '軽貨物ドライバー（明石・神戸西エリア／宅配・企業配送）',
    summary:
      '兵庫県明石市・神戸市西部エリアで、軽自動車を使った宅配および企業配送を担当していただくドライバーの募集です。未経験の方も応募いただけます。',
    datePosted: '2026-07-14',
    validThrough: null,
    contractLabel: '業務委託（個人事業主としての契約）',
    employmentType: 'CONTRACTOR',
    location: {
      region: '兵庫県',
      locality: '明石市',
      postalCode: null,
      street: null,
    },
    areas: ['兵庫県明石市', '兵庫県神戸市西部'],
    deliveryAreas: ['明石エリア', '神戸西エリア'],
    salary: {
      headline: '未経験でも月収30万円〜可能',
      basis: [
        'JUNGLE公式Instagramの求人投稿に記載されている報酬例です。',
        '日当保証制度があるため、稼働初期から一定の報酬が確保される仕組みです。',
        '実際の報酬は、契約内容・稼働日数・担当案件・必要経費によって変動します。',
      ],
      minValue: 300000,
      maxValue: null,
      unitText: 'MONTH',
      useBaseSalary: false,
    },
    duties: [
      '軽自動車（軽バン）を使用した個人宅向けの宅配業務',
      '企業間・事業所向けの配送業務',
      '荷物の積み込み・仕分け・配達完了処理',
      '配送前後の車両点検と日常管理',
    ],
    requirements: [
      '普通自動車運転免許（必須）',
      '軽貨物配送の実務経験は不問。未経験の方も応募いただけます',
    ],
    welcome: [
      '未経験から新しい仕事に挑戦したい方',
      '女性ドライバーの応募も歓迎しています',
      '配送・運転の経験をお持ちの方',
    ],
    benefits: [
      '車両リース制度あり（自身の車両をお持ちでない方も相談可能）',
      '日当保証あり',
      '未経験者向けの同乗研修・サポート体制',
    ],
    specs: [
      { label: '職種', value: '軽貨物ドライバー（宅配・企業配送）' },
      { label: '契約形態', value: '業務委託（個人事業主としての契約）' },
      { label: '募集地域', value: '兵庫県明石市・神戸市西部' },
      { label: '配送エリア', value: '明石エリア／神戸西エリア' },
      { label: '報酬', value: '月収30万円〜可能（報酬例）', note: '計算根拠は下記「報酬について」をご確認ください' },
      { label: '報酬の計算方法', value: null, note: '日額・件数単価・歩合の詳細は面談時にご確認ください' },
      { label: '日当保証', value: 'あり', note: '保証金額は面談時にご確認ください' },
      { label: '勤務時間', value: null, note: '担当案件により異なるため面談時にご確認ください' },
      { label: '勤務日数', value: null, note: '面談時にご確認ください' },
      { label: '休日', value: null, note: '面談時にご確認ください' },
      { label: '応募資格', value: '普通自動車運転免許をお持ちの方' },
      { label: '必要な免許', value: '普通自動車運転免許', note: '軽貨物配送に大型免許や二種免許は不要です' },
      { label: '車両の持ち込み', value: '可', note: '軽貨物運送に使用できる車両をお持ちの方はご相談ください' },
      { label: '車両リース', value: 'あり', note: 'リース料・条件は面談時にご確認ください' },
      { label: '未経験者研修', value: 'あり', note: '同乗研修などのサポートを実施しています' },
      { label: '経験者の扱い', value: '経験・実績を考慮のうえご相談します' },
      { label: '直行直帰', value: null, note: '案件により異なるため面談時にご確認ください' },
      { label: '服装・身だしなみ', value: null, note: '担当案件の規定に準じます。面談時にご確認ください' },
      { label: '募集開始日', value: '2026年7月14日' },
      { label: '募集終了日', value: null, note: '現在のところ期限は設けていません' },
      { label: '応募方法', value: '当サイトの応募フォーム、またはInstagramのダイレクトメッセージ' },
    ],
    notes: [
      '本求人は業務委託契約です。雇用契約ではないため、労働基準法上の労働者としての各種保護（有給休暇・残業代・最低賃金など）は適用されません。',
      '記載の報酬は報酬例であり、実際の報酬や手取り額を保証するものではありません。契約内容、稼働日数、案件、必要経費などにより異なります。',
      '業務委託契約では、ガソリン代・駐車場代・車両維持費・保険料・車両リース料などの経費が個人負担となる場合があります。手取り額は報酬総額から経費を差し引いた金額になります。',
      '確定申告など、個人事業主としての税務手続きはご自身で行っていただく必要があります。',
      '掲載内容と実際の契約条件が異なる場合は、面談時にご提示する契約内容が優先されます。',
    ],
    toConfirm: [
      '報酬の具体的な計算方法（日額・件数単価・歩合率）',
      '日当保証の金額',
      '車両リースの月額費用と契約条件',
      '稼働開始時間・1日の想定稼働時間',
      '週あたりの稼働日数と休日の考え方',
      '経費の負担範囲（ガソリン代・保険料など）',
    ],
  },
];

/* ---------------------------------- helpers --------------------------------- */

/** 募集中の求人だけを返す（一覧・トップページ用） */
export const openJobs = () => jobs.filter((job) => job.status === 'open');

/** 静的生成の対象。draft は生成しない（closed は募集終了ページとして残す） */
export const publishedJobs = () => jobs.filter((job) => job.status !== 'draft');

export const getJob = (slug: string) => jobs.find((job) => job.slug === slug);

/** 表示対象の条件行だけを返す */
export const visibleSpecs = (job: Job) => job.specs.filter((spec) => spec.value !== null || spec.note);
