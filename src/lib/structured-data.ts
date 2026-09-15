import {
  canPublishLocalBusiness,
  company,
  formattedAddress,
  show,
} from '@/data/company';
import { columnAuthor, type Column } from '@/data/columns';
import type { FaqItem } from '@/data/faq';
import { canEmitJobPosting, type Job } from '@/data/jobs';
import { siteConfig, socialLinks } from '@/data/site';
import { absoluteUrl } from '@/lib/seo';

/**
 * 構造化データ（JSON-LD）の生成をまとめたファイル。
 *
 * ■ 守っているルール
 *   - 画面に表示していない情報を構造化データだけに入れない
 *   - 未確認（verified: false）の情報は出力しない
 *   - 口コミが無いので AggregateRating は出力しない
 *   - LocalBusiness は番地まで確認できた住所がある場合のみ出力する
 *   - URL はすべて本番ドメインの絶対URLにする
 *   - すべてのページに同じ構造化データを無条件で入れない
 *     （WebSite はトップのみ。Organization は @id 参照の解決に必要なため全ページ）
 */

const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

/** 確認できている外部プロフィールのみ sameAs に出力します */
const sameAs = [socialLinks.instagram, socialLinks.googleBusinessProfile].filter(
  (url): url is string => Boolean(url),
);

/* --------------------------------- 住所 ---------------------------------- */

/** 住所。未確認の項目は出力しません */
export function postalAddress() {
  return {
    '@type': 'PostalAddress',
    addressCountry: 'JP',
    ...(show(company.addressRegion) ? { addressRegion: show(company.addressRegion) } : {}),
    ...(show(company.addressLocality) ? { addressLocality: show(company.addressLocality) } : {}),
    ...(show(company.postalCode) ? { postalCode: show(company.postalCode) } : {}),
    ...(show(company.streetAddress) ? { streetAddress: show(company.streetAddress) } : {}),
  };
}

const areaServed = [
  { '@type': 'AdministrativeArea', name: '兵庫県明石市' },
  { '@type': 'AdministrativeArea', name: '兵庫県神戸市西区' },
];

/* ------------------------------ Organization ------------------------------ */

/**
 * 組織情報。
 * @id を持たせているため、他の構造化データから publisher / provider として参照できます。
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: show(company.brandName) ?? siteConfig.name,
    ...(show(company.legalName) ? { legalName: show(company.legalName) } : {}),
    url: siteConfig.url,
    logo: { '@type': 'ImageObject', url: absoluteUrl(siteConfig.logo) },
    image: absoluteUrl(siteConfig.ogImage),
    description: siteConfig.description,
    ...(sameAs.length ? { sameAs } : {}),
    ...(show(company.tel)
      ? {
          telephone: show(company.tel),
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: show(company.tel),
            contactType: 'customer service',
            areaServed: 'JP',
            availableLanguage: 'Japanese',
          },
        }
      : {}),
    ...(show(company.representative)
      ? { founder: { '@type': 'Person', name: show(company.representative) } }
      : {}),
    ...(show(company.founded) ? { foundingDate: show(company.founded) } : {}),
    address: postalAddress(),
    areaServed,
  };
}

/**
 * LocalBusiness。
 * 番地まで確認できた住所がない状態で出力すると、ローカル検索でかえって不利になるため、
 * streetAddress が確認できるまで null を返します（呼び出し側で出し分けます）。
 */
export function localBusinessJsonLd() {
  if (!canPublishLocalBusiness()) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    '@id': `${siteConfig.url}/#localbusiness`,
    name: show(company.brandName) ?? siteConfig.name,
    ...(show(company.legalName) ? { legalName: show(company.legalName) } : {}),
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.ogImage),
    logo: absoluteUrl(siteConfig.logo),
    description: siteConfig.description,
    address: postalAddress(),
    ...(show(company.tel) ? { telephone: show(company.tel) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    areaServed,
  };
}

/* --------------------------------- WebSite -------------------------------- */

/** サイト全体の情報。トップページにのみ出力します */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: 'ja',
    publisher: { '@id': ORG_ID },
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

/* ------------------------------ WebPage / 一覧 ----------------------------- */

/** 通常ページ（地域ページ・採用ガイドなど） */
export function webPageJsonLd({
  name,
  description,
  path,
  updatedAt,
}: {
  name: string;
  description: string;
  path: string;
  updatedAt?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: 'ja',
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
    ...(updatedAt ? { dateModified: updatedAt } : {}),
  };
}

/** 一覧ページ（求人一覧・コラム一覧・エリア一覧） */
export function collectionPageJsonLd({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(path)}#collection`,
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: 'ja',
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

/* -------------------------------- JobPosting -------------------------------- */

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 求人条件をHTMLに整形して description に渡します。
 * 画面に表示している内容と一致させるため、value が null の項目は含めません。
 */
function jobDescriptionHtml(job: Job) {
  const list = (heading: string, items: string[]) =>
    items.length ? `<h3>${heading}</h3><ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>` : '';

  const specLines = job.specs
    .filter((spec) => spec.value !== null)
    .map((spec) => `<li>${escapeHtml(spec.label)}：${escapeHtml(spec.value as string)}</li>`)
    .join('');

  return [
    `<p>${escapeHtml(job.summary)}</p>`,
    list('仕事内容', job.duties),
    list('応募資格', job.requirements),
    `<h3>必要な経験</h3><p>${escapeHtml(job.experienceRequirements)}</p>`,
    `<h3>必要な学歴</h3><p>${escapeHtml(job.educationRequirements)}</p>`,
    list('求められること', job.skills),
    list('待遇・サポート', job.benefits),
    `<h3>勤務地</h3><p>${escapeHtml(job.areas.join('／'))}（配送エリア：${escapeHtml(job.deliveryAreas.join('／'))}）</p>`,
    specLines ? `<h3>募集条件</h3><ul>${specLines}</ul>` : '',
    list('ご注意', job.notes),
  ]
    .filter(Boolean)
    .join('');
}

/**
 * JobPosting構造化データ。
 *
 * ■ 出力条件
 *   status: 'open' かつ verified: true の求人のみ。それ以外は null を返します。
 *   （呼び出し側は null のときスクリプトを出力しません）
 *
 * ■ 給与について
 *   salary.useBaseSalary が true のときのみ baseSalary を出力します。
 *   現状は報酬"例"であり単位・計算根拠が未確認のため estimatedSalary として出力し、
 *   確定給与としては扱いません（画面表示も「報酬例」と明示しています）。
 */
export function jobPostingJsonLd(job: Job) {
  if (!canEmitJobPosting(job)) return null;

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
      name: show(company.brandName) ?? siteConfig.name,
      value: job.slug,
    },
    datePosted: job.datePosted,
    ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    employmentType: job.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: show(company.brandName) ?? siteConfig.name,
      ...(show(company.legalName) ? { legalName: show(company.legalName) } : {}),
      ...(sameAs.length ? { sameAs: sameAs[0] } : {}),
      logo: absoluteUrl(siteConfig.logo),
    },
    // 会社所在地ではなく、実際に稼働する場所を出力します
    jobLocation: job.jobLocations.map((loc) => ({
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'JP',
        addressRegion: loc.region,
        addressLocality: loc.locality,
        ...(loc.postalCode ? { postalCode: loc.postalCode } : {}),
        ...(loc.street ? { streetAddress: loc.street } : {}),
      },
    })),
    applicantLocationRequirements: { '@type': 'Country', name: 'JP' },
    ...(monetary ? (salary!.useBaseSalary ? { baseSalary: monetary } : { estimatedSalary: monetary }) : {}),
    responsibilities: job.duties.join('／'),
    qualifications: job.requirements.join('／'),
    skills: job.skills.join('／'),
    experienceRequirements: job.experienceRequirements,
    educationRequirements: job.educationRequirements,
    industry: '軽貨物運送業',
    occupationalCategory: '53-3033 配送ドライバー',
    // 当サイトの応募フォームからログインなしで直接応募できるため true
    directApply: true,
    url: absoluteUrl(`/jobs/${job.slug}`),
  };
}

/* --------------------------------- FAQPage --------------------------------- */

/** 画面上にFAQを表示しているページでのみ使用してください */
export function faqPageJsonLd(items: { question: string; answer: string[] }[]) {
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer.join(' ') },
    })),
  };
}

export const faqItemsToJsonLd = (items: FaqItem[]) =>
  faqPageJsonLd(items.map((i) => ({ question: i.question, answer: i.answer })));

/* --------------------------------- Service --------------------------------- */

export function serviceJsonLd(service: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    serviceType: '軽貨物配送',
    url: absoluteUrl(service.path),
    provider: { '@id': ORG_ID },
    areaServed,
  };
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
      '@type': 'Person',
      name: columnAuthor.name,
      jobTitle: columnAuthor.role,
      url: absoluteUrl(columnAuthor.url),
      worksFor: { '@id': ORG_ID },
    },
    publisher: { '@id': ORG_ID },
    image: absoluteUrl(siteConfig.ogImage),
    articleSection: column.category,
  };
}

/** 著者ページ用 */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${absoluteUrl(columnAuthor.url)}#person`,
    name: columnAuthor.name,
    jobTitle: columnAuthor.role,
    description: columnAuthor.description,
    url: absoluteUrl(columnAuthor.url),
    worksFor: { '@id': ORG_ID },
    ...(formattedAddress() ? { workLocation: { '@type': 'Place', address: postalAddress() } } : {}),
  };
}
