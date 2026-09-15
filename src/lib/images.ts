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
 * 画像パスの一覧。
 *
 * ファイル名は検索エンジンが内容を推測できるよう、被写体と地域が分かる英語名にしています
 * （`image1.webp` のような無意味な名前や日本語ファイル名は使いません）。
 * public/images/ に同名のファイルを置けば、対応する箇所が自動的に写真に差し替わります。
 */
export const imagePaths = {
  /* ---------------------------- 横長（ヒーロー向け） ---------------------------- */
  /** ドライバー＋軽バン＋明石海峡大橋。左に余白があり見出しを重ねられる */
  akashiHero: '/images/akashi-light-cargo-driver-hero.webp',
  /** 夕景の明石海峡大橋と2台の軽バン */
  bridgeVans: '/images/akashi-kaikyo-bridge-delivery-vans.webp',
  /** 明石海峡大橋を背にしたドライバーと車両 */
  vanBridge: '/images/light-cargo-van-akashi-bridge.webp',
  /** 夕景の住宅街で車両にもたれるドライバー */
  driverSunset: '/images/jungle-driver-residential-sunset.webp',
  /** 明石市内の住宅街を走行する軽バン */
  vanAkashiStreet: '/images/light-cargo-van-akashi-street.webp',
  /** 青空の下を走行する軽バン（神戸市西区の紹介に使用） */
  vanKobeNishi: '/images/kobe-nishi-delivery-van.webp',

  /* ------------------------------ 4:3（本文向け） ------------------------------ */
  /** 玄関先で荷物を手渡すドライバー */
  homeDelivery: '/images/akashi-home-delivery-driver.webp',
  /** 端末を操作するドライバーと車両（縦位置のトリミングにも耐える） */
  driverTerminal: '/images/jungle-driver-delivery-terminal.webp',
  /** 車両の前でタブレットを確認するドライバー */
  driverTablet: '/images/jungle-driver-tablet-check.webp',
  /** 車両後部へ段ボールを積み込む様子 */
  loadingPackages: '/images/jungle-driver-loading-packages.webp',
  /** 手袋をした手で荷物を積み込む寄りの写真 */
  loadingCloseup: '/images/light-cargo-loading-boxes-closeup.webp',
  /** 高齢のお客様へ荷物を届ける場面 */
  handoverSenior: '/images/home-delivery-handover-senior.webp',
  /** 車両後部で荷物を確認する2人のドライバー */
  driversCheck: '/images/jungle-drivers-package-check.webp',
  /** 荷物棚のある配送拠点と軽バン（企業配送の説明に使用） */
  businessWarehouse: '/images/business-delivery-warehouse.webp',
  /** 台車で荷物を運ぶ配送拠点の様子 */
  depotCart: '/images/delivery-depot-cart-loading.webp',
  /** 車両の前に並ぶ4人のスタッフ（ジャケット） */
  team: '/images/jungle-delivery-team.webp',
  /** 車両の前に並ぶ4人のスタッフ（ポロシャツ） */
  teamVans: '/images/jungle-delivery-team-vans.webp',
  /** 先輩が2人のスタッフへ説明する様子（研修） */
  training: '/images/jungle-driver-training.webp',
  /** 3人で書類を確認する様子（打ち合わせ） */
  briefing: '/images/jungle-driver-briefing.webp',
  /** 荷物とスマートフォンでの配達完了処理 */
  completionScan: '/images/delivery-completion-smartphone.webp',
} as const;
