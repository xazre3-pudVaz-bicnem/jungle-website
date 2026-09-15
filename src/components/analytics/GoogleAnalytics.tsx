import Script from 'next/script';
import { siteConfig } from '@/data/site';

/**
 * Google Analytics 4 の計測タグ。
 *
 * NEXT_PUBLIC_GA_ID が未設定のときは何も出力しません。
 * これにより、測定IDを用意していない状態でもビルド・表示に影響しません。
 *
 * Cookieを使った計測を行うため、運用の実態に合わせて
 * プライバシーポリシーの記載（アクセス解析の項）を確認してください。
 */
export function GoogleAnalytics() {
  const gaId = siteConfig.gaId;
  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
