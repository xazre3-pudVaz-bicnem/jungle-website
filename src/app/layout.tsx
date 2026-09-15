import type { Metadata, Viewport } from 'next';
import { Anton, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileCta } from '@/components/layout/MobileCta';
import { JsonLd } from '@/components/ui/JsonLd';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { OutboundTracker } from '@/components/analytics/OutboundTracker';
import { localBusinessJsonLd, organizationJsonLd } from '@/lib/structured-data';
import { siteConfig } from '@/data/site';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
  preload: true,
});

/** 数字・英字をデザイン要素として使うためのディスプレイ書体 */
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: '兵庫・明石の軽貨物配送｜JUNGLE',
    template: `%s｜${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  formatDetection: { telephone: false },
  ...(siteConfig.googleSiteVerification
    ? { verification: { google: siteConfig.googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJp.variable} ${anton.variable}`}>
      <body className="font-sans antialiased">
        {/*
          Organization は publisher / provider の @id 参照を解決するため全ページに出力します。
          WebSite はトップページにのみ出力します（サイト全体を表す情報のため）。
          LocalBusiness は番地まで確認できた住所がある場合のみ出力されます。
        */}
        <JsonLd data={[organizationJsonLd(), localBusinessJsonLd()]} />
        <GoogleAnalytics />
        <OutboundTracker />
        <Header />
        <main id="main" className="pb-14 lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileCta />
      </body>
    </html>
  );
}
