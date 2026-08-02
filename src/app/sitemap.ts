import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';
import { openJobs } from '@/data/jobs';
import { columns } from '@/data/columns';

/**
 * XMLサイトマップ。
 *
 * ■ 掲載ルール
 *   - 求人は status: 'open' のもののみ掲載します。
 *     draft は非公開、closed は noindex の募集終了ページのため、いずれも含めません。
 *   - 送信完了ページ（/entry/thanks）は noindex のため含めません。
 */

const url = (path: string) => `${siteConfig.url}${path}`;

/** 静的ページの一覧。lastModified はビルド日時を使用します */
const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] =
  [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/recruit', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/jobs', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/service', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/work', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/beginner', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/daily-flow', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/company', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/columns', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/entry', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/job-policy', priority: 0.4, changeFrequency: 'yearly' },
  ];

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();

  const statics: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: url(route.path),
    lastModified: buildDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 募集中の求人のみ
  const jobEntries: MetadataRoute.Sitemap = openJobs().map((job) => ({
    url: url(`/jobs/${job.slug}`),
    lastModified: new Date(job.datePosted),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const columnEntries: MetadataRoute.Sitemap = columns.map((column) => ({
    url: url(`/columns/${column.slug}`),
    lastModified: new Date(column.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...statics, ...jobEntries, ...columnEntries];
}
