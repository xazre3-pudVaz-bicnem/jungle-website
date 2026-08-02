import { company } from '@/data/company';
import { columnAuthor, type Column } from '@/data/columns';
import type { FaqItem } from '@/data/faq';
import type { Job } from '@/data/jobs';
import { siteConfig, socialLinks } from '@/data/site';
import { absoluteUrl } from '@/lib/seo';

/* --------------------------------- 共通 ---------------------------------- */

const sameAs = [socialLinks.instagram].filter((url): url is string => Boolean(url));

/** 組織情報。全ページ共通で出力 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: company.name,
    ...(company.legalName ? { legalName: company.legalName } : {}),
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(siteConfig.logo),
    },
    description: siteConfig.description,
    ...(sameAs.length ? { sameAs } : {}),
    // 確認できている連絡先のみを出力します（site.ts が null の項目は出しません）
    ...(socialLinks.tel
      ? {
          telephone: socialLinks.tel,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: socialLinks.tel,
            contactType: 'customer service',
            areaServed: 'JP',
            availableLanguage: 'Japanese',
          },
        }
      : {}),
    ...(socialLinks.email ? { email: socialLinks.email } : {}),
    address: postalAddress(),
    areaServed: [
      { '@type': 'AdministrativeArea', name: '兵庫県明石市' },
      { '@type': 'AdministrativeArea', name: '兵庫県神戸市西部' },
    ],
  };
}

/** 住所。未確認の項目は出力しない */
export function postalAddress() {
  return {
    '@type': 'PostalAddress',
    addressCountry: 'JP',
    addressRegion: company.address.region,
    addressLocality: company.address.locality,
    ...(company.address.postalCode ? { postalCode: company.address.postalCode } : {}),
    ...(company.address.street && company.address.isStreetPublic
      ? { streetAddress: company.address.street }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: 'ja',
    publisher: { '@id': `${siteConfig.url}/#organization` },
  };
}

/* ------------------------------ パンくずリスト ------------------------------ */

export type Crumb = { name: string; href: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.href),
    })),
  };
}

/* -------------------------------- JobPosting -------------------------------- */

/** 求人条件をHTMLに整形して description に渡す */
function jobDescriptionHtml(job: Job) {
  const section = (heading: string, items: string[]) =>
    items.length ? `<h3>${heading}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '';

  const specLines = job.specs
    .filter((spec) => spec.value !== null)
    .map((spec) => `<li>${escapeHtml(spec.label)}：${escapeHtml(spec.value as string)}</li>`)
    .join('');

  return [
    `<p>${escapeHtml(job.summary)}</p>`,
    section('仕事内容', job.duties),
    section('応募資格・必要な免許', job.requirements),
    section('必要な経験', ['軽貨物配送の実務経験は不問です。未経験の方も応募いただけます。']),
    section('待遇・サポート', job.benefits),
    `<h3>勤務地</h3><p>${escapeHtml(job.areas.join('／'))}（配送エリア：${escapeHtml(job.deliveryAreas.join('／'))}）</p>`,
    specLines ? `<h3>募集条件</h3><ul>${specLines}</ul>` : '',
    section('ご注意', job.notes),
  ]
    .filter(Boolean)
    .join('');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * JobPosting構造化データ。
 * status: 'open' の求人でのみ呼び出してください（呼び出し側でガード済み）。
 *
 * 給与について：
 *   job.salary.useBaseSalary が true のときのみ baseSalary を出力します。
 *   現状は報酬"例"のため estimatedSalary として出力し、確定給与としては扱いません。
 *   （画面表示も同様に「報酬例」と明示しています）
 */
export function jobPostingJsonLd(job: Job) {
  const salary = job.salary;
  const monetary =
    salary && salary.minValue !== null
      ? {
          '@type': 'MonetaryAmount',
          currency: 'JPY',
          value: {
            '@type': 'QuantitativeValue',
            minValue: salary.minValue,
            ...(salary.maxValue !== null ? { maxValue: salary.maxValue } : {}),
            unitText: salary.unitText,
          },
        }
      : null;

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: jobDescriptionHtml(job),
    identifier: {
      '@type': 'PropertyValue',
      name: company.name,
      value: job.slug,
    },
    datePosted: job.datePosted,
    ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    employmentType: job.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: company.name,
      ...(company.legalName ? { legalName: company.legalName } : {}),
      ...(sameAs.length ? { sameAs: sameAs[0] } : {}),
      logo: absoluteUrl(siteConfig.logo),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'JP',
        addressRegion: job.location.region,
        addressLocality: job.location.locality,
        ...(job.location.postalCode ? { postalCode: job.location.postalCode } : {}),
        ...(job.location.street ? { streetAddress: job.location.street } : {}),
      },
    },
    ...(monetary ? (salary!.useBaseSalary ? { baseSalary: monetary } : { estimatedSalary: monetary }) : {}),
    directApply: true,
    url: absoluteUrl(`/jobs/${job.slug}`),
  };
}

/* --------------------------------- FAQPage --------------------------------- */

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.join(' '),
      },
    })),
  };
}

/* --------------------------------- Service --------------------------------- */

export function serviceJsonLd(services: { name: string; description: string }[]) {
  return services.map((service) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    serviceType: '軽貨物配送',
    provider: { '@id': `${siteConfig.url}/#organization` },
    areaServed: [
      { '@type': 'AdministrativeArea', name: '兵庫県明石市' },
      { '@type': 'AdministrativeArea', name: '兵庫県神戸市西部' },
    ],
  }));
}

/* --------------------------------- Article --------------------------------- */

export function articleJsonLd(column: Column) {
  const url = absoluteUrl(`/columns/${column.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: column.title,
    description: column.description,
    datePublished: column.publishedAt,
    dateModified: column.updatedAt,
    inLanguage: 'ja',
    author: {
      '@type': 'Organization',
      name: columnAuthor.name,
      url: absoluteUrl(columnAuthor.url),
    },
    publisher: { '@id': `${siteConfig.url}/#organization` },
    image: absoluteUrl(siteConfig.ogImage),
    articleSection: column.category,
  };
}
