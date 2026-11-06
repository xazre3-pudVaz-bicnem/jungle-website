/**
 * 事業内容。
 *
 * ■ 重要
 *   ここに掲載してよいのは、実際に提供していることが確認できた事業のみです。
 *   「定期便」「スポット便」など、提供実態が確認できていないサービスを掲載しないでください。
 *
 * 【Instagramプロフィールで確認できた事業】
 *   軽貨物ドライバー事業／不動産／引越し／遺品回収
 * 【求人投稿で確認できた配送の内訳】
 *   軽自動車での宅配・企業配送
 * 【オーナーから直接確認した事業（2026-11-06）】
 *   チャーター便（料金体系・対応時間などの詳細は未確認のため unverifiedNotes に整理）
 *
 * ■ 対応エリア
 *   coverage は coverage.ts の表記（coverageLines）をそのまま使っています。
 *
 * ■ 個別ページの作成条件
 *   hasDetailPage: true の事業だけが /service/[slug] として独立ページになります。
 *   引越し・遺品回収・不動産関連は「独立したサービスとして受注しているか」が
 *   未確認のため、/service 内のセクション掲載にとどめています。
 *   受注実態と対応範囲が確認できたら hasDetailPage を true にしてページを作成してください。
 */

import { coverageLines, coverageText } from './coverage';

export type ServiceFaq = { question: string; answer: string[] };

export type Service = {
  id: string;
  /** 英字ラベル（デザイン要素） */
  eyebrow: string;
  name: string;
  /** 構造化データにも使用する説明文 */
  description: string;
  /** 詳細の箇条書き */
  points: string[];
  /** 主たる事業かどうか */
  primary: boolean;
  /** 個別ページを持つか */
  hasDetailPage: boolean;
  /** ページのパス */
  path: string;

  /* ------- 以下は hasDetailPage: true の事業でのみ使用します ------- */
  /** ページタイトル */
  pageTitle?: string;
  /** meta description */
  pageDescription?: string;
  /** 冒頭の結論 */
  lead?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  heroImage?: string;
  heroImageAlt?: string;
  /** 対応可能な荷物 */
  cargo?: string[];
  /** 対応エリア */
  coverage?: string[];
  /** 対応時間 */
  hours?: { value: string | null; note: string };
  /** 受託までの流れ */
  flow?: { title: string; body: string }[];
  /** 安全・品質面での取り組み */
  quality?: string[];
  faqs?: ServiceFaq[];
  /** 未確認のため掲載していない項目 */
  unverifiedNotes?: string[];
  updatedAt?: string;
};

export const services: Service[] = [
  {
    id: 'home-delivery',
    eyebrow: 'Home Delivery',
    name: '個人宅向け配送（宅配）',
    description:
      '兵庫県と神奈川県を拠点に、通販商品などを個人のご自宅へお届けする宅配業務を行っています。軽自動車に積載できるサイズの荷物を、一軒ずつ確実にお届けします。',
    points: [
      '軽自動車（軽バン）による戸別配送',
      '担当エリアを決めて同じ地域を回る担当制',
      '不在時の再配達・置き配指定への対応',
    ],
    primary: true,
    hasDetailPage: true,
    path: '/service/home-delivery',
    pageTitle: '兵庫・神奈川の個人宅向け軽貨物配送（宅配）',
    pageDescription:
      'JUNGLE TRANSPORTが兵庫県・神奈川県・東京都の一部エリアで行っている個人宅向けの軽貨物配送（宅配）についてご説明します。対応できる荷物、配送エリア、受託までの流れ、配送品質への取り組みをまとめました。',
    lead:
      'JUNGLE TRANSPORTは、兵庫県と神奈川県を拠点に、個人のお客様のご自宅へ荷物をお届けする宅配業務を受託しています。軽自動車に積載できるサイズの荷物が対象です。',
    primaryKeyword: '神戸 軽貨物 宅配',
    secondaryKeywords: ['兵庫 宅配 配送会社', '横浜 軽貨物 宅配', '明石 個人宅配送'],
    heroImage: '/images/home-delivery-handover-senior.webp',
    heroImageAlt: '個人宅の玄関先で荷物をお届けするJUNGLE TRANSPORTのドライバー',
    cargo: [
      '通販商品などの小口荷物（軽自動車に積載できるサイズ）',
      '書類・小型の梱包物',
      '一人で持ち運べる重量の荷物',
    ],
    coverage: coverageLines,
    hours: {
      value: null,
      note: '対応可能な時間帯は案件の内容によって異なります。ご相談の際にお伝えください。',
    },
    flow: [
      { title: 'お問い合わせ', body: 'お電話、またはInstagramのダイレクトメッセージにて配送内容をお知らせください。' },
      { title: 'ヒアリング', body: '荷物の種類・サイズ・数量、集荷場所、配送先の範囲、希望する頻度を伺います。' },
      { title: '対応可否のご回答', body: '車両と稼働の状況を踏まえて、対応可能な範囲をご回答します。' },
      { title: 'お見積り・条件のご提示', body: '配送内容にもとづいて条件をご提示します。' },
      { title: '運用開始', body: '運び方や引き渡しの手順をすり合わせたうえで配送を開始します。' },
    ],
    quality: [
      '出発前の車両点検を日常業務として実施しています',
      '積み込みから受け渡しまで、荷物の扱い方を配送品質と考えています',
      '受け渡し時の挨拶と応対を、依頼元の信頼に関わるものとして重視しています',
      '過密なスケジュールを前提にしない運行計画を基本としています',
    ],
    faqs: [
      {
        question: '1件だけの配送でも依頼できますか。',
        answer: [
          '配送の内容と時期によって対応可否が変わります。まずは荷物の内容と希望日をお知らせください。',
          '継続的な配送か単発かによっても条件が変わりますので、ご相談時にお伝えいただけますとスムーズです。',
        ],
      },
      {
        question: '対応エリア以外にも配送できますか。',
        answer: [
          `現在の対応エリアは${coverageText}です。近隣地域への配送についてはご相談ください。`,
          '対応可能な範囲は稼働状況によって変わるため、確約はいたしかねます。まずはご希望のエリアをお知らせください。',
        ],
      },
      {
        question: '料金を教えてください。',
        answer: [
          '配送の内容（荷物のサイズ・数量・エリア・頻度）によって条件が異なるため、一律の料金は掲載していません。',
          'ご相談いただいた内容にもとづいてお見積りをご提示します。',
        ],
      },
    ],
    unverifiedNotes: [
      '対応可能な時間帯（早朝・夜間の可否）',
      '料金体系（距離制・件数制・時間制の別）',
      '1日あたりの対応可能件数',
      '取引実績（掲載許可を得られる範囲で）',
    ],
    updatedAt: '2026-11-06',
  },

  {
    id: 'business-delivery',
    eyebrow: 'Business Delivery',
    name: '企業向け配送（企業配送）',
    description:
      '企業・店舗・事業所の間で発生する荷物の配送を行っています。決まった時間に決まった場所へ届ける必要がある業務に対応します。',
    points: [
      '事業所間・店舗間の荷物配送',
      '到着時間の指定がある配送への対応',
      '継続的な配送業務の受託',
    ],
    primary: true,
    hasDetailPage: true,
    path: '/service/business-delivery',
    pageTitle: '兵庫・神奈川の企業向け軽貨物配送',
    pageDescription:
      'JUNGLE TRANSPORTが兵庫県・神奈川県・東京都の一部エリアで行っている企業向けの軽貨物配送についてご説明します。対応できる荷物、配送エリア、受託までの流れ、配送品質への取り組みをまとめました。',
    lead:
      'JUNGLE TRANSPORTは、兵庫県と神奈川県を拠点に、企業・店舗・事業所間の荷物配送を受託しています。到着時間の指定がある配送にも対応します。',
    primaryKeyword: '神戸 企業配送',
    secondaryKeywords: ['兵庫 軽貨物 企業配送', '横浜 軽貨物 ルート配送', '川崎 配送業務委託'],
    heroImage: '/images/business-delivery-warehouse.webp',
    heroImageAlt: '事業所で企業向けの荷物を仕分けするJUNGLE TRANSPORTのスタッフ',
    cargo: [
      '事業所間で発生する書類・部品・備品',
      '店舗への商品補充などの小口荷物',
      '軽自動車に積載できるサイズ・重量の荷物',
    ],
    coverage: coverageLines,
    hours: {
      value: null,
      note: '到着時間の指定を含めて、対応可能な時間帯はご相談ください。',
    },
    flow: [
      { title: 'お問い合わせ', body: 'お電話、またはInstagramのダイレクトメッセージにて配送内容をお知らせください。' },
      { title: 'ヒアリング', body: '集荷場所、配送先、荷物の種類と量、希望する時間帯と頻度を伺います。' },
      { title: '対応可否のご回答', body: '車両と稼働の状況を踏まえて、対応可能な範囲をご回答します。' },
      { title: 'お見積り・条件のご提示', body: '配送内容にもとづいて条件をご提示します。' },
      { title: 'テスト運行・運用開始', body: '必要に応じて手順を確認したうえで、配送を開始します。' },
    ],
    quality: [
      '到着時間の指定がある配送では、余裕を持った運行計画を組みます',
      '出発前の車両点検を日常業務として実施しています',
      '荷物の破損を防ぐため、積み方と固定方法を確認したうえで運びます',
      'ドライバーが単独で判断に迷った際に連絡を取り合える体制を保っています',
    ],
    faqs: [
      {
        question: '定期的な配送をお願いできますか。',
        answer: [
          '継続的な配送業務の受託についてもご相談いただけます。頻度・時間帯・ルートをお知らせください。',
          '車両と稼働の状況によって対応可能な範囲が変わるため、まずは条件を伺ったうえでご回答します。',
        ],
      },
      {
        question: '軽自動車で運べないサイズの荷物は依頼できますか。',
        answer: [
          'JUNGLE TRANSPORTが対応するのは軽自動車に積載できるサイズ・重量の荷物です。',
          'それを超える荷物については対応できかねます。荷物の寸法と重量をお知らせいただければ、対応可否をご回答します。',
        ],
      },
      {
        question: '急ぎの配送に対応してもらえますか。',
        answer: [
          'その時点の稼働状況によります。急ぎの荷物は、車両1台を貸し切るチャーター便としてご相談いただくこともできます。',
          'まずはご希望の日時と配送内容をお知らせください。対応可否をできるだけ早くご回答します。',
        ],
      },
    ],
    unverifiedNotes: [
      '対応可能な時間帯（早朝・夜間・土日の可否）',
      '料金体系と最低受注単位',
      '定期便として受託している実績の有無と件数',
      '取引先企業（掲載許可を得られる範囲で）',
      '請求・支払いの条件',
    ],
    updatedAt: '2026-11-06',
  },

  {
    id: 'charter',
    eyebrow: 'Charter',
    name: 'チャーター便（貸切配送）',
    description:
      '軽自動車（軽バン）1台を貸し切り、お預かりした荷物を集荷先から届け先まで直接お運びします。急ぎの荷物や、ほかの荷物と混載したくない配送にご利用いただけます。',
    points: [
      '軽バン1台を貸し切っての直送',
      'ほかの荷物と混載しない配送',
      '急ぎの荷物や時間指定のある配送のご相談',
    ],
    primary: true,
    hasDetailPage: true,
    path: '/service/charter',
    pageTitle: '軽貨物チャーター便（貸切配送）｜兵庫・神奈川・東京',
    pageDescription:
      'JUNGLE TRANSPORTの軽貨物チャーター便（貸切配送）についてご説明します。軽バン1台を貸し切り、集荷先から届け先まで直接お運びします。兵庫県・神奈川県・東京都の一部エリアでご依頼を承ります。',
    lead:
      'JUNGLE TRANSPORTは、軽自動車（軽バン）1台を貸し切って荷物をお運びするチャーター便にも対応しています。兵庫県と神奈川県を拠点に、急ぎの荷物や混載を避けたい荷物の配送をご相談いただけます。',
    primaryKeyword: '軽貨物 チャーター便',
    secondaryKeywords: ['神戸 チャーター便', '横浜 軽貨物 チャーター', '軽バン 貸切 配送'],
    heroImage: '/images/jungle-driver-loading-packages.webp',
    heroImageAlt: '軽貨物車両の後部へ荷物を積み込むJUNGLE TRANSPORTのドライバー',
    cargo: [
      '急ぎで届けたい荷物・書類',
      'ほかの荷物と混載したくない荷物',
      '軽自動車に積載できるサイズ・重量の荷物',
    ],
    coverage: coverageLines,
    hours: {
      value: null,
      note: '集荷・お届けの日時はご相談ください。車両と稼働の状況を踏まえてご回答します。',
    },
    flow: [
      { title: 'お問い合わせ', body: 'お電話、またはInstagramのダイレクトメッセージにてご依頼内容をお知らせください。' },
      { title: 'ヒアリング', body: '集荷場所と届け先、ご希望の日時、荷物の種類・サイズ・数量を伺います。' },
      { title: '対応可否とお見積りのご回答', body: '車両と稼働の状況を踏まえて、対応の可否と条件をご回答します。' },
      { title: 'ご依頼の確定', body: '日時と条件にご納得いただけましたら、ご依頼を確定します。' },
      { title: '集荷・お届け', body: '集荷先で荷物をお預かりし、ほかの荷物と混載せずに届け先まで直接お運びします。' },
    ],
    quality: [
      '1台を貸し切るため、集荷からお届けまで同じドライバーが荷物を運びます',
      '出発前の車両点検を日常業務として実施しています',
      '荷物の破損を防ぐため、積み方と固定方法を確認したうえで運びます',
      '到着時間の指定がある場合は、余裕を持った運行計画を組みます',
    ],
    faqs: [
      {
        question: '当日の依頼でも対応できますか。',
        answer: [
          'その時点の車両と稼働の状況によります。まずはご希望の日時、集荷場所と届け先、荷物の内容をお知らせください。',
          '対応可否をできるだけ早くご回答します。',
        ],
      },
      {
        question: '対応エリアの外への配送も依頼できますか。',
        answer: [
          `現在の対応エリアは${coverageText}です。エリアの外への配送も、まずはご相談ください。`,
          '距離や日時によって対応の可否と条件が変わるため、集荷場所と届け先を伺ったうえでご回答します。',
        ],
      },
      {
        question: '料金はどのように決まりますか。',
        answer: [
          '走行距離・所要時間・荷物の内容・日時などによって条件が異なるため、一律の料金は掲載していません。',
          'ご相談いただいた内容にもとづいてお見積りをご提示します。',
        ],
      },
    ],
    unverifiedNotes: [
      '料金体系（距離制・時間制の別、最低料金）',
      '対応可能な時間帯（早朝・夜間・土日祝の可否）',
      '対応エリア外・長距離への対応範囲',
      '使用する車両の種類と積載量（軽バン以外の車両があるか）',
      '当日のご依頼への対応可否の目安',
    ],
    updatedAt: '2026-11-06',
  },

  {
    id: 'moving',
    eyebrow: 'Moving',
    name: '引越し',
    description:
      '引越しに伴う荷物の運搬を行っています。「運ぶ」ことを軸に事業を広げてきたなかで、地域のお客様からのご依頼に対応してきました。',
    points: ['荷物の搬出・運搬・搬入', '兵庫エリアを中心とした対応'],
    primary: false,
    // 独立したサービスとしての受注実態・対応範囲が未確認のため個別ページは作成していません
    hasDetailPage: false,
    path: '/service',
  },
  {
    id: 'estate-clearance',
    eyebrow: 'Estate Clearance',
    name: '遺品回収',
    description:
      '遺品の整理・回収に伴う荷物の運搬を行っています。丁寧な取り扱いが求められる業務として対応しています。',
    points: ['遺品の搬出・運搬', '兵庫エリアを中心とした対応'],
    primary: false,
    hasDetailPage: false,
    path: '/service',
  },
  {
    id: 'real-estate',
    eyebrow: 'Real Estate',
    name: '不動産関連業務',
    description:
      '不動産に関わる業務にも取り組んでいます。配送・運搬の事業とあわせて、地域のお客様のご相談に対応しています。',
    points: ['不動産に関するご相談への対応'],
    primary: false,
    hasDetailPage: false,
    path: '/service',
  },
];

export const getService = (id: string) => services.find((s) => s.id === id);
export const detailServices = () => services.filter((s) => s.hasDetailPage);

/** 配送品質・安全に対する考え方 */
export const qualityPolicies = [
  {
    number: 1,
    title: '安全運転を最優先する',
    description:
      '配送の速さは、安全を確保したうえで初めて意味を持ちます。時間に追われた運転が事故につながるため、無理のない運行計画を組むことを基本としています。ドライバー一人ひとりに、出発前の車両点検を習慣として求めています。',
  },
  {
    number: 2,
    title: '荷物を丁寧に扱う',
    description:
      'お客様にとって、荷物は届いた状態がすべてです。積み込みから受け渡しまで、荷物の扱い方をそのまま配送品質と考えています。',
  },
  {
    number: 3,
    title: '受け渡しの応対を大切にする',
    description:
      '配送業務は、お客様と直接顔を合わせる数少ない場面です。挨拶と丁寧な応対は、依頼元の企業の信頼にも直結します。',
  },
  {
    number: 4,
    title: '無理な稼働を前提にしない',
    description:
      '過密なスケジュールは、事故と品質低下の両方を招きます。ドライバーが継続して働ける条件を整えることが、結果として安定した配送につながると考えています。',
  },
] as const;

/** サービス側の未確認項目（READMEのTODO一覧に使用） */
export const serviceTodos = () =>
  services.flatMap((s) => (s.unverifiedNotes ?? []).map((note) => `【${s.name}】${note}`));
