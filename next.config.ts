import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 親ディレクトリにも lockfile があるため、ワークスペースのルートを明示する
  turbopack: {
    root: import.meta.dirname,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      /*
       * 2026-11-06：対応エリアを「神戸市西区」から「神戸市」全体に広げたため、
       * 検索エンジンに登録済みの旧URLを新しいページへ恒久的に転送します（評価を引き継ぐため 308）。
       */
      { source: '/area/kobe-nishi', destination: '/area/kobe', permanent: true },
      { source: '/recruit/kobe-nishi', destination: '/recruit/kobe', permanent: true },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    /*
     * 元画像は最大2200px幅のWebPです。
     * 既定値には 3840 が含まれており、素材より大きいサイズへ引き伸ばす変換が
     * 走ってしまうため（無駄な処理時間とファイルサイズ、同時リクエスト時の失敗の原因）、
     * 実際に必要な範囲へ絞っています。
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 2048],
    imageSizes: [128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
