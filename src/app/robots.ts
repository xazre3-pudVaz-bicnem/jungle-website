import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // 送信完了ページとAPIは検索結果に出す必要がありません
        disallow: ['/entry/thanks', '/api/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
