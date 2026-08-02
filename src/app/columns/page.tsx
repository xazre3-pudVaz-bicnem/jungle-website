import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, TextLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, type Crumb } from '@/lib/jsonld';
import { formatJapaneseDate } from '@/lib/format';
import { columns, columnAuthor } from '@/data/columns';

export const metadata: Metadata = buildMetadata({
  title: '採用コラム｜軽貨物ドライバーを知る',
  description:
    '軽貨物ドライバーという仕事について、応募を検討する段階で知っておきたいことをまとめた採用コラムです。仕事内容、契約形態、報酬と経費、必要な免許などを解説します。',
  path: '/columns',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '採用コラム', href: '/columns' },
];

export default function ColumnsPage() {
  const categories = Array.from(new Set(columns.map((column) => column.category)));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="Columns"
        title="採用コラム"
        lead="軽貨物ドライバーという仕事を、応募を決める前に知っておいてほしい。一般的な仕組みと、JUNGLEの募集条件を分けて解説しています。"
      />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container>
          <div className="flex flex-wrap items-baseline gap-4">
            <p className="display text-5xl leading-none text-ink sm:text-6xl">
              {String(columns.length).padStart(2, '0')}
            </p>
            <p className="text-sm font-bold text-body/70">記事を掲載中</p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <li key={category} className="border border-line px-4 py-2 text-xs font-bold text-body/70">
                {category}
              </li>
            ))}
          </ul>

          {/* 罫線で区切るエディトリアルな一覧 */}
          <ul className="rule-list mt-12 border-t-2 border-ink">
            {columns.map((column, index) => (
              <li key={column.slug}>
                <Link href={`/columns/${column.slug}`} className="group block py-9 transition-colors hover:bg-mist">
                  <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                    <div className="flex shrink-0 items-start gap-5 sm:w-40 sm:flex-col sm:gap-3">
                      <span className="display text-3xl leading-none text-ink/15 sm:text-4xl" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <span className="block text-xs font-bold text-jungle-deep">{column.category}</span>
                        <time dateTime={column.publishedAt} className="mt-1 block text-xs text-body/50">
                          {formatJapaneseDate(column.publishedAt)}
                        </time>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-lg leading-relaxed font-bold text-ink sm:text-xl">{column.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-body">{column.lead}</p>
                      <span className="mt-5 inline-flex items-center gap-2.5 text-sm font-bold text-ink">
                        <span className="border-b-2 border-jungle pb-0.5">記事を読む</span>
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-16 border-t border-line pt-9">
            <h2 className="text-base font-bold text-ink">運営者情報</h2>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-body">{columnAuthor.description}</p>
            <div className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
              <TextLink href="/about">JUNGLEについて</TextLink>
              <TextLink href="/jobs">募集中の求人を見る</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
