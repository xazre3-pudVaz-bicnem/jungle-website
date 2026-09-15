/**
 * 求人データ。
 *
 * ■ このファイルに1件追加するだけで、以下がすべて自動生成されます
 *   - 求人詳細ページ  /jobs/[slug]
 *   - 求人一覧への掲載 /jobs
 *   - サイトマップへの追加
 *   - JobPosting構造化データ（status: 'open' かつ verified: true のときのみ出力）
 *   - トップ・採用トップ・地域ページ・採用ガイドからの内部リンク
 *
 * ■ 掲載ルール
 *   - status: 'open'   … 募集中。一覧に表示・サイトマップに掲載
 *   - status: 'closed' … 募集終了。詳細ページは「募集終了」表示でnoindex、JobPostingは出力しない
 *   - status: 'draft'  … 下書き。一覧・サイトマップ・検索結果すべてに出さない（404）
 *   - verified: false  … 条件の裏取りが未了。ページは出すが JobPosting は出力しない
 *
 * ■ 絶対に守ること
 *   - 画面に表示する内容と構造化データを一致させること
 *   - 確認できていない条件は value: null のままにすること（推測で埋めない）
 *   - 業務委託を「正社員」「アルバイト」のように表現しないこと
 *   - 職種名にキーワードを詰め込まないこと
 */

export type JobStatus = 'open' | 'closed' | 'draft';

/** 求人条件の1項目。value が null の項目は構造化データに出ません */
export type JobSpec = {
  label: string;
  value: string | null;
  /** 補足・注意書き */
  note?: string;
  /** 募集概要テーブル（ページ冒頭）に出す項目 */
  summaryTable?: boolean;
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
  unitText: 'MONTH' | 'DAY' | 'HOUR' | 'YEAR';
  /**
   * true にすると baseSalary（確定給与）として構造化データに出力します。
   *
   * 現在は false。理由：確認できるのは「未経験でも月収30万円〜可能」という報酬"例"であり、
   * 単位（日額／月額／件数単価）と計算根拠が未確認のためです。
   * 報酬体系が確認でき次第 true に変更してください。false の間は estimatedSalary として出力されます。
   */
  useBaseSalary: boolean;
};

export type Job = {
  slug: string;
  status: JobStatus;
  /**
   * 事実確認が取れているか。
   * false の間は JobPosting 構造化データを出力しません
   * （未確認の条件でGoogleしごと検索に掲載すると掲載資格を失うリスクがあるため）。
   */
  verified: boolean;
  /** 職種名（H1・JobPosting.title に使用）。キーワードを詰め込まない */
  title: string;
  /** 検索結果・一覧用の短い説明 */
  summary: string;
  datePosted: string;
  /** 内容を実際に更新した日。サイトマップの lastModified に使用 */
  updatedAt: string;
  /**
   * 募集期限（ISO 8601）。実際に期限がある場合だけ設定してください。
   * 常時募集・期限不明の場合は null のままにします（適当な未来日を入れない）。
   */
  validThrough: string | null;
  contractLabel: string;
  /** schema.org employmentType。業務委託は 'CONTRACTOR' */
  employmentType: 'CONTRACTOR' | 'FULL_TIME' | 'PART_TIME' | 'TEMPORARY' | 'OTHER';
  /**
   * 勤務地（実際に稼働する場所）。会社所在地とは別物として扱います。
   * 複数の市区町村で稼働する場合は配列に追加してください。
   */
  jobLocations: { region: string; locality: string; postalCode: string | null; street: string | null }[];
  areas: string[];
  deliveryAreas: string[];
  salary: JobSalary | null;
  /** 仕事内容（JobPosting.responsibilities にも使用） */
  duties: string[];
  /** 応募資格（JobPosting.qualifications にも使用） */
  requirements: string[];
  /** 必要な経験（JobPosting.experienceRequirements に使用） */
  experienceRequirements: string;
  /** 必要な学歴（JobPosting.educationRequirements に使用） */
  educationRequirements: string;
  /** 求められるスキル（JobPosting.skills に使用） */
  skills: string[];
  welcome: string[];
  benefits: string[];
  specs: JobSpec[];
  notes: string[];
  /** 未確認のため面談時に確認が必要な項目 */
  toConfirm: string[];
};

/**
 * ■ 情報の出典について
 * JUNGLE 公式Instagram（@jungle.hyougo）のプロフィール・求人投稿で確認できた内容と、
 * オーナーから直接提供された情報のみを掲載しています。
 *
 * 【確認できた事実】
 *   - 軽貨物ドライバーを募集中（事業拡大にともなう募集）
 *   - 対象エリア：兵庫エリア／明石・神戸西エリア
 *   - 仕事内容：軽自動車での宅配・企業配送
 *   - 未経験者も応募可能、女性も歓迎／要普通自動車免許
 *   - 「未経験でも月収30万円〜可能」という報酬例の記載
 *   - 車両リースあり／日当保証あり
 *   - 応募方法：Instagramのダイレクトメッセージ／当サイトのフォーム／電話
 *
 * 【未確認のため掲載していない項目】
 *   specs 内で value: null、または toConfirm に集約しています。
 *   READMEの「オーナーへ確認が必要な情報」も参照してください。
 */
export const jobs: Job[] = [
  {
    slug: 'akashi-light-cargo-driver',
    status: 'open',
    /*
     * verified は「掲載している内容の裏取りが済んでいるか」を表します。
     * true にしている理由：JobPosting に出力する項目（職種名・仕事内容・勤務地・
     * 契約形態・応募資格・待遇・応募方法）はすべて確認済みの事実です。
     * 未確認の条件（報酬の計算方法・稼働時間など）は specs で value: null にしてあり、
     * 画面にも構造化データにも出力されません。
     *
     * 逆に、確認済みとして掲載している内容に疑義が生じた場合は false に戻してください。
     * false の間は JobPosting が出力されず、Googleしごと検索には掲載されなくなります。
     */
    verified: true,
    title: '軽貨物ドライバー（明石市・神戸市西部／宅配・企業配送）',
    summary:
      '兵庫県明石市と神戸市西部を配送エリアとする軽貨物ドライバーの募集です。軽自動車で個人宅への宅配と企業向けの配送を担当します。業務委託契約で、普通自動車運転免許があれば未経験の方も応募いただけます。',
    datePosted: '2026-07-14',
    updatedAt: '2026-08-02',
    validThrough: null,
    contractLabel: '業務委託（個人事業主としての契約）',
    employmentType: 'CONTRACTOR',
    jobLocations: [
      { region: '兵庫県', locality: '明石市', postalCode: null, street: null },
      { region: '兵庫県', locality: '神戸市西区', postalCode: null, street: null },
    ],
    areas: ['兵庫県明石市', '兵庫県神戸市西区'],
    deliveryAreas: ['明石市全域', '神戸市西区'],
    salary: {
      headline: '未経験でも月収30万円〜可能',
      basis: [
        'JUNGLE公式Instagramの求人投稿に記載している報酬例です。',
        '日当保証があるため、稼働の初期段階から一定の報酬が確保される仕組みです。',
        '実際の報酬は、契約内容・稼働日数・担当案件・必要経費によって変動します。',
      ],
      minValue: 300000,
      maxValue: null,
      unitText: 'MONTH',
      useBaseSalary: false,
    },
    duties: [
      '軽自動車（軽バン）を使用した個人宅向けの宅配業務',
      '企業・事業所向けの配送業務',
      '荷物の積み込み・仕分け・配達完了処理',
      '配送前後の車両点検と日常管理',
    ],
    requirements: [
      '普通自動車運転免許（必須）',
      '軽貨物配送の実務経験は不問。未経験の方も応募いただけます',
      '個人事業主として業務委託契約を結べる方',
    ],
    experienceRequirements: '軽貨物配送の実務経験は不問です。未経験の方も応募いただけます。',
    educationRequirements: '学歴不問',
    skills: ['安全運転', '荷物の丁寧な取り扱い', '配送ルートの組み立て', '受け渡し時の基本的な応対'],
    welcome: [
      '未経験から新しい仕事に挑戦したい方',
      '女性ドライバーの応募も歓迎しています',
      '配送・運転の経験をお持ちの方',
    ],
    benefits: [
      '車両リース制度あり（配送用の車両をお持ちでない方も相談可能）',
      '日当保証あり',
      '未経験者向けの同乗研修・サポート体制',
    ],
    specs: [
      { label: '職種', value: '軽貨物ドライバー（宅配・企業配送）', summaryTable: true },
      { label: '契約形態', value: '業務委託（個人事業主としての契約）', summaryTable: true },
      { label: '募集エリア', value: '兵庫県明石市／兵庫県神戸市西区', summaryTable: true },
      { label: '配送エリア', value: '明石市全域／神戸市西区', summaryTable: true },
      { label: '応募資格', value: '普通自動車運転免許をお持ちの方（学歴・配送経験は不問）', summaryTable: true },
      {
        label: '報酬',
        value: '月収30万円〜可能（報酬例）',
        note: '計算根拠は「報酬について」をご確認ください',
        summaryTable: true,
      },
      { label: '稼働時間', value: null, note: '担当案件により異なります', summaryTable: true },
      { label: '稼働日数', value: null, note: '面談時に希望を伺ったうえで決定します', summaryTable: true },
      { label: '車両', value: 'リース制度あり／お持ちの車両の持ち込みも相談可', summaryTable: true },
      { label: '研修', value: '同乗研修あり（未経験の方向け）', summaryTable: true },
      {
        label: '応募方法',
        value: '当サイトの応募フォーム／お電話／Instagramのダイレクトメッセージ',
        summaryTable: true,
      },

      { label: '必要な免許', value: '普通自動車運転免許', note: '大型免許や二種免許は不要です' },
      { label: 'AT限定免許', value: null, note: '配送車両がAT車かどうかを含めてご確認ください' },
      { label: '報酬の計算方法', value: null, note: '日額・件数単価・歩合の別と単価' },
      { label: '日当保証', value: 'あり', note: '保証金額と適用条件は面談時にご確認ください' },
      { label: '報酬の支払日', value: null, note: '締め日と支払日' },
      { label: '1日の配送件数', value: null, note: '担当案件により異なります' },
      { label: '積み込み場所', value: null, note: '配送センター・集荷先の場所' },
      { label: '配送開始時間', value: null },
      { label: '配送終了時間', value: null },
      { label: '休憩', value: null, note: '配達の合間にご自身の判断で取得いただけます' },
      { label: '休日', value: null, note: '希望を伺ったうえで調整します' },
      { label: '車両リース料', value: null, note: '月額と契約期間、途中解約の条件' },
      { label: 'ガソリン代', value: null, note: '自己負担か会社負担か' },
      { label: '任意保険', value: null, note: '加入方法と負担の別' },
      { label: 'ロイヤリティ・手数料', value: null, note: '報酬から差し引かれる項目の有無' },
      { label: '直行直帰', value: null, note: '案件により異なります' },
      { label: '服装・身だしなみ', value: null, note: '担当案件の規定に準じます' },
      { label: '必要な手続き', value: '開業届の提出、車両の事業用登録（黒ナンバー）', note: '進め方はご案内します' },
      { label: '経験者の扱い', value: '経験・実績を考慮のうえご相談します' },
      { label: '面談方法', value: null, note: '対面・オンラインの別と所要時間' },
      { label: '稼働開始までの期間', value: null, note: '車両の準備状況により変動します' },
      { label: '募集開始日', value: '2026年7月14日' },
      { label: '募集終了日', value: null, note: '現在のところ期限は設けていません' },
    ],
    notes: [
      '本求人は業務委託契約です。雇用契約ではないため、労働基準法上の労働者としての各種保護（有給休暇・残業代・最低賃金など）は適用されません。',
      '記載の報酬は報酬例であり、実際の報酬や手取り額を保証するものではありません。契約内容、稼働日数、案件、必要経費などにより異なります。',
      '業務委託契約では、ガソリン代・駐車場代・車両維持費・保険料・車両リース料などの経費が個人負担となる場合があります。手取り額は報酬総額から経費を差し引いた金額になります。',
      '確定申告など、個人事業主としての税務手続きはご自身で行っていただく必要があります。',
      '掲載内容と実際の契約条件が異なる場合は、面談時にご提示する契約内容が優先されます。',
    ],
    toConfirm: [
      '報酬の計算方法（日額・件数単価・歩合率）と単価',
      '日当保証の金額と適用条件',
      '報酬の締め日と支払日',
      '車両リースの月額費用・契約期間・途中解約の条件',
      '1日の想定配送件数と積み込み場所',
      '稼働開始時間・終了時間・週あたりの稼働日数',
      '経費の負担範囲（ガソリン代・任意保険・駐車場代）',
      'ロイヤリティや手数料の有無',
      'AT限定免許での応募可否',
      '直行直帰の可否と服装の規定',
    ],
  },
];

/* ---------------------------------- helpers --------------------------------- */

/** 募集中の求人だけを返す（一覧・トップページ用） */
export const openJobs = () => jobs.filter((job) => job.status === 'open');

/** 静的生成の対象。draft は生成しない（closed は募集終了ページとして残す） */
export const publishedJobs = () => jobs.filter((job) => job.status !== 'draft');

export const getJob = (slug: string) => jobs.find((job) => job.slug === slug);

/**
 * JobPosting 構造化データを出力してよい求人か。
 * 募集中かつ事実確認が済んでいる場合のみ true になります。
 */
export const canEmitJobPosting = (job: Job) => job.status === 'open' && job.verified;

/** 指定した市区町村を勤務地に含む募集中の求人 */
export const openJobsInLocality = (locality: string) =>
  openJobs().filter((job) => job.jobLocations.some((loc) => loc.locality === locality));

/** 募集概要テーブル（ページ冒頭）に出す条件 */
export const summarySpecs = (job: Job) => job.specs.filter((spec) => spec.summaryTable);

/** 詳細テーブルに出す条件（概要テーブルに出したものを除く） */
export const detailSpecs = (job: Job) => job.specs.filter((spec) => !spec.summaryTable);
