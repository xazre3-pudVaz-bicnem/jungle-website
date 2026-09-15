import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';
import { openJobs } from '@/data/jobs';
import { columns } from '@/data/columns';
import { areas } from '@/data/areas';
import { detailServices } from '@/data/services';
import { recruitGuides } from '@/data/recruit-guides';

/**
 * XMLサイトマップ。
 *
 * ■ 掲載するもの
 *   - index 可能な固定ページ
 *   - status: 'open' の求人
 *   - 公開済みのコラム／地域ページ／サービスページ／採用ガイド
 *
 * ■ 掲載しないもの
 *   - 下書き（draft）・募集終了（closed）の求人
 *   - 送信完了ページ（noindex）
 *   - APIルート
 *
 * ■ lastModified について
 *   デプロイのたびに全URLを現在日時へ更新すると、更新頻度の情報として意味を持たなくなるため、
 *   ページごとに「実際に内容を更新した日」を持たせています。
 *   ページの内容を修正したら、下の updatedAt もあわせて更新してください。
 */

const url = (path: string) => `${siteConfig.url}${path}`;

type Route = {
  path: string;
  /** 実際に内容を更新した日（YYYY-MM-DD） */
  updatedAt: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
};

/** 固定ページ。内容を修正したら updatedAt を更新してください */
const staticRoutes: Route[] = [
  { path: '/', updatedAt: '2026-08-02', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/recruit', updatedAt: '2026-08-02', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/jobs', updatedAt: '2026-08-02', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/service', updatedAt: '2026-08-02', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/area', updatedAt: '2026-08-02', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/work', updatedAt: '2026-08-02', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/beginner', updatedAt: '2026-08-02', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact/business', updatedAt: '2026-09-15', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/entry', updatedAt: '2026-08-02', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', updatedAt: '2026-08-02', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/daily-flow', updatedAt: '2026-08-02', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/faq', updatedAt: '2026-08-02', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/columns', updatedAt: '2026-08-02', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/company', updatedAt: '2026-08-02', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/authors/jungle-recruitment', updatedAt: '2026-08-02', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/job-policy', updatedAt: '2026-08-02', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/privacy', updatedAt: '2026-08-02', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const statics: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: url(route.path),
    lastModified: new Date(route.updatedAt),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 募集中の求人のみ（closed / draft は含めません）
  const jobEntries: MetadataRoute.Sitemap = openJobs().map((job) => ({
    url: url(`/jobs/${job.slug}`),
    lastModified: new Date(job.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const recruitGuideEntries: MetadataRoute.Sitemap = recruitGuides.map((guide) => ({
    url: url(`/recruit/${guide.slug}`),
    lastModified: new Date(guide.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const areaEntries: MetadataRoute.Sitemap = areas.map((area) => ({
    url: url(`/area/${area.slug}`),
    lastModified: new Date(area.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const serviceEntries: MetadataRoute.Sitemap = detailServices().map((service) => ({
    url: url(service.path),
    lastModified: new Date(service.updatedAt ?? '2026-08-02'),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const columnEntries: MetadataRoute.Sitemap = columns.map((column) => ({
    url: url(`/columns/${column.slug}`),
    lastModified: new Date(column.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...statics, ...jobEntries, ...recruitGuideEntries, ...areaEntries, ...serviceEntries, ...columnEntries];
}
