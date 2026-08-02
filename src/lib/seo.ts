import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const absoluteUrl = (path: string) => {
  if (path.startsWith('http')) return path;
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
};

type BuildMetadataInput = {
  /** ページ固有のタイトル（サイト名は自動で付与） */
  title: string;
  description: string;
  /** ルートからのパス（例: '/jobs'） */
  path: string;
  /** 検索エンジンに出したくないページは true */
  noindex?: boolean;
  /** OG type。記事は 'article' */
  ogType?: 'website' | 'article';
  /** 記事用 */
  publishedTime?: string;
  modifiedTime?: string;
  /** OG画像を差し替えたい場合 */
  image?: string;
};

/**
 * 全ページ共通のメタデータ生成。
 * title / description / canonical / OGP / Twitter Card を一括で設定します。
 */
export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  image,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image ?? siteConfig.ogImage);
  // すでにサイト名を含むタイトルには重ねて付与しない
  const fullTitle = title.endsWith(siteConfig.shortName) ? title : `${title}｜${siteConfig.shortName}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: ogType,
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${siteConfig.name}｜${title}` }],
      ...(ogType === 'article' && publishedTime ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
