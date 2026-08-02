import fs from 'node:fs';
import path from 'node:path';

/**
 * public 配下に画像が実在するかをビルド時に判定します。
 *
 * これにより、まだ写真が用意されていない箇所は自動的にフォールバック表示
 * （黒地＋黄色のライン）に切り替わり、壊れた画像が表示されることがありません。
 * public/images/ にファイルを追加して再ビルドするだけで、自動的に写真へ差し替わります。
 *
 * ※ Server Component からのみ呼び出してください。
 */
const cache = new Map<string, boolean>();

export function hasPublicImage(src: string): boolean {
  if (!src.startsWith('/')) return false;
  const cached = cache.get(src);
  if (cached !== undefined) return cached;

  let exists = false;
  try {
    exists = fs.existsSync(path.join(process.cwd(), 'public', src.replace(/^\//, '')));
  } catch {
    exists = false;
  }
  cache.set(src, exists);
  return exists;
}

/**
 * 想定している画像ファイルの一覧。
 * public/images/ に同名のファイルを置けば、対応する箇所が自動的に写真に差し替わります。
 */
export const imagePaths = {
  /** ヒーロー：ドライバー＋軽バン＋明石海峡大橋（横長・左に余白があり見出しを重ねられる） */
  hero: '/images/hero-jungle.webp',
  /** ヒーロー：夕景の明石海峡大橋と2台の軽バン（横長） */
  heroSunset: '/images/hero-sunset.webp',
  /** 明石海峡大橋を背にしたドライバーと車両（横長） */
  vanAkashi: '/images/van-akashi.webp',
  /** 夕景の住宅街で車両にもたれるドライバー（横長） */
  driver03: '/images/driver-03.webp',
  /** 住宅街を走行する軽バン（横長・躍動感） */
  van01: '/images/delivery-van-01.webp',
  /** 青空の下を走行する軽バン（横長） */
  van02: '/images/delivery-van-02.webp',

  /** 玄関先で荷物を手渡すドライバー */
  driver01: '/images/driver-01.webp',
  /** 端末を操作するドライバーと車両（縦位置のトリミングにも耐える） */
  driver02: '/images/driver-02.webp',
  /** 車両の前でタブレットを確認するドライバー */
  driverTablet: '/images/driver-tablet.webp',
  /** 車両後部へ段ボールを積み込む様子 */
  loading01: '/images/loading-01.webp',
  /** 手袋をした手で荷物を積み込む寄りの写真 */
  loading02: '/images/loading-02.webp',
  /** 高齢のお客様へ荷物を届ける場面 */
  delivery01: '/images/delivery-01.webp',
  /** 車両後部で荷物を確認する2人のドライバー */
  deliveryPair: '/images/delivery-pair.webp',
  /** 荷物棚のある配送拠点と軽バン */
  depot01: '/images/depot-01.webp',
  /** 台車で荷物を運ぶ配送拠点の様子 */
  depot02: '/images/depot-02.webp',
  /** 車両の前に並ぶ4人のスタッフ（ジャケット） */
  team01: '/images/team-01.webp',
  /** 車両の前に並ぶ4人のスタッフ（ポロシャツ） */
  team02: '/images/team-02.webp',
  /** 先輩が2人のスタッフへ説明する様子（研修） */
  training01: '/images/training-01.webp',
  /** 3人で書類を確認する様子（研修・打ち合わせ） */
  training02: '/images/training-02.webp',
  /** 荷物とスマートフォンでの完了処理 */
  scan01: '/images/scan-01.webp',

  logo: '/logo.jpg',
} as const;
