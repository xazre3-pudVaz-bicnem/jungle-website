/**
 * 拠点と対応エリアの一元管理ファイル。
 *
 * ■ 出典
 *   2026-11-06 にオーナー（代表）から直接確認した内容です。
 *   - 拠点：兵庫県・神奈川県
 *   - 対応エリア（配送エリア・求人の募集地域とも同じ範囲）
 *       兵庫県　神戸市・明石市・加古川市
 *       神奈川県　横浜市・川崎市
 *       東京都　西東京エリア（全域）・大田区・品川区
 *
 * ■ 使い方
 *   トップページ・フッター・会社概要・対応エリア一覧・採用トップ・構造化データ（areaServed）が
 *   ここを参照しています。エリアが変わったらこのファイルを直せば表記がまとめて切り替わります。
 *   地域ごとの詳しいページは areas.ts（/area/[slug]）と recruit-guides.ts（/recruit/[slug]）にあり、
 *   cities[].slug がそれぞれの slug と対応しています。
 *
 * ※ jobs.ts は Indexing API のスクリプトから直接読み込まれるため、このファイルを import していません。
 *   求人の勤務地を変更するときは jobs.ts もあわせて修正してください。
 */

export type CoverageCity = {
  /** 画面に出す名称 */
  name: string;
  /** 都道府県名を含む正式な表記（構造化データ・一覧に使用） */
  fullName: string;
  /** /area/[slug]・/recruit/[slug] の slug */
  slug: string;
};

export type CoverageRegion = {
  prefecture: '兵庫県' | '神奈川県' | '東京都';
  /** 英字表記（デザイン要素） */
  en: string;
  /** 拠点を置いている都県か */
  isBase: boolean;
  cities: CoverageCity[];
};

export const coverageRegions: CoverageRegion[] = [
  {
    prefecture: '兵庫県',
    en: 'Hyogo',
    isBase: true,
    cities: [
      { name: '神戸市', fullName: '兵庫県神戸市', slug: 'kobe' },
      { name: '明石市', fullName: '兵庫県明石市', slug: 'akashi' },
      { name: '加古川市', fullName: '兵庫県加古川市', slug: 'kakogawa' },
    ],
  },
  {
    prefecture: '神奈川県',
    en: 'Kanagawa',
    isBase: true,
    cities: [
      { name: '横浜市', fullName: '神奈川県横浜市', slug: 'yokohama' },
      { name: '川崎市', fullName: '神奈川県川崎市', slug: 'kawasaki' },
    ],
  },
  {
    prefecture: '東京都',
    en: 'Tokyo',
    isBase: false,
    // 西東京エリアは全域、23区内は大田区・品川区（2026-11-06 オーナー確認）
    cities: [{ name: '西東京エリア・大田区・品川区', fullName: '東京都（西東京エリア・大田区・品川区）', slug: 'tokyo' }],
  },
];

/** 都県ごとの表記（例：兵庫県（神戸市・明石市・加古川市）） */
export const regionLabel = (region: CoverageRegion) =>
  `${region.prefecture}（${region.cities.map((city) => city.name).join('・')}）`;

/** 都県ごとの表記の配列。改行して並べる場面で使用します */
export const coverageLines = coverageRegions.map(regionLabel);

/** 1行の表記（例：兵庫県（…）／神奈川県（…）／東京都（…）） */
export const coverageText = coverageLines.join('／');

/** 拠点の表記（例：兵庫県・神奈川県） */
export const baseText = coverageRegions
  .filter((region) => region.isBase)
  .map((region) => region.prefecture)
  .join('・');

/** 見出し向けの短い表記（例：兵庫・神奈川・東京） */
export const coverageShort = coverageRegions.map((region) => region.prefecture.replace(/[都府県]$/, '')).join('・');
