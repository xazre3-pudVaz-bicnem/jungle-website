import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section, SectionHeading, TextLink, ButtonLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FaqList } from '@/components/ui/FaqList';
import { ColumnBody } from '@/components/ui/ColumnBody';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { articleJsonLd, breadcrumbJsonLd, faqItemsToJsonLd, webPageJsonLd, type Crumb } from '@/lib/structured-data';
import { formatJapaneseDate } from '@/lib/format';
import { columnAuthor, columns, getColumn, relatedColumns } from '@/data/columns';
import { faqsByIds } from '@/data/faq';
import { getJob } from '@/data/jobs';

export function generateStaticParams() {
  return columns.map((column) => ({ slug: column.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const column = getColumn(slug);
  if (!column) return {};

  return buildMetadata({
    title: column.title,
    description: column.description,
    path: `/columns/${column.slug}`,
    ogType: 'article',
    publishedTime: column.publishedAt,
    modifiedTime: column.updatedAt,
  });
}

export default async function ColumnDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const column = getColumn(slug);
  if (!column) notFound();

  const faqItems = faqsByIds(column.faqIds);
  const related = relatedColumns(column);
  const relatedJobs = column.relatedJobSlugs
    .map((jobSlug) => getJob(jobSlug))
    .filter((job) => job && job.status === 'open');

  const crumbs: Crumb[] = [
    { name: 'ホーム', href: '/' },
    { name: '採用コラム', href: '/columns' },
    { name: column.title, href: `/columns/${column.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          articleJsonLd(column),
          faqItemsToJsonLd(faqItems),
          webPageJsonLd({
            name: column.title,
            description: column.description,
            path: `/columns/${column.slug}`,
            updatedAt: column.updatedAt,
          }),
        ]}
      />

      <PageHero eyebrow={column.category} title={column.title} lead={column.lead} />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1.7fr_1fr] lg:gap-20">
            {/* -------------------------------- 本文 -------------------------------- */}
            <article className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-line pb-6 text-xs text-body/60">
                <span>
                  公開日：
                  <time dateTime={column.publishedAt}>{formatJapaneseDate(column.publishedAt)}</time>
                </span>
                <span>
                  更新日：
                  <time dateTime={column.updatedAt}>{formatJapaneseDate(column.updatedAt)}</time>
                </span>
                <span>カテゴリ：{column.category}</span>
              </div>

              <ColumnBody blocks={column.blocks} />

              {/* FAQ */}
              {faqItems.length > 0 && (
                <section className="mt-16">
                  <h2 className="border-l-4 border-jungle pl-5 text-xl leading-relaxed font-bold text-ink sm:text-2xl">
                    この記事に関するよくある質問
                  </h2>
                  <div className="mt-8 border-t border-line">
                    <FaqList items={faqItems} />
                  </div>
                </section>
              )}

              {/* 監修・運営者情報 */}
              <section className="mt-16 border-t-2 border-ink pt-8">
                <h2 className="display text-xs tracking-[0.2em] text-jungle-deep">Author</h2>
                <p className="mt-4 text-base font-bold text-ink">{columnAuthor.name}</p>
                <p className="mt-1 text-xs text-body/60">{columnAuthor.role}</p>
                <p className="mt-4 text-sm leading-8 text-body">{columnAuthor.description}</p>
                <dl className="mt-6 grid gap-2 text-xs text-body/70 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <dt className="font-bold">記事の確認者</dt>
                    <dd>{columnAuthor.reviewedBy}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="font-bold">最終更新日</dt>
                    <dd>
                      <time dateTime={column.updatedAt}>{formatJapaneseDate(column.updatedAt)}</time>
                    </dd>
                  </div>
                </dl>
                {column.verifiedFacts.length > 0 && (
                  <div className="mt-6 border-l-4 border-jungle bg-mist px-5 py-4">
                    <p className="text-xs font-bold text-ink">この記事でJUNGLEの事実として記載している内容</p>
                    <ul className="mt-2.5 space-y-1.5">
                      {column.verifiedFacts.map((fact) => (
                        <li key={fact} className="text-xs leading-6 text-body">・{fact}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs leading-6 text-body/60">
                      上記以外は軽貨物配送の一般的な情報です。
                    </p>
                  </div>
                )}
                <TextLink href={columnAuthor.url} className="mt-6">
                  運営者情報を見る
                </TextLink>
              </section>

              {/* 関連求人 */}
              {relatedJobs.length > 0 && (
                <section className="mt-16">
                  <h2 className="text-base font-bold text-ink">この記事に関連する求人</h2>
                  <ul className="rule-list mt-5 border-t border-line">
                    {relatedJobs.map((job) => (
                      <li key={job!.slug}>
                        <Link href={`/jobs/${job!.slug}`} className="group flex items-center gap-5 py-5">
                          <span className="shrink-0 bg-jungle px-2.5 py-1 text-xs font-bold text-ink">募集中</span>
                          <span className="flex-1 text-sm leading-7 font-bold text-ink">{job!.title}</span>
                          <span
                            aria-hidden="true"
                            className="shrink-0 text-ink transition-transform group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </article>

            {/* -------------------------------- サイド ------------------------------- */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="bg-ink p-8">
                <p className="display text-xs tracking-[0.22em] text-jungle">Entry</p>
                <h2 className="mt-4 text-lg leading-relaxed font-bold text-white">
                  兵庫で軽貨物ドライバーを探すなら
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  JUNGLEは明石・神戸西エリアで軽貨物ドライバーを募集しています。普通自動車運転免許があれば、配送の実務経験がない方も応募いただけます。
                </p>
                <div className="mt-7 space-y-3">
                  <ButtonLink href="/jobs" variant="primary" className="w-full">
                    募集中の求人を見る
                  </ButtonLink>
                  <ButtonLink href="/entry" variant="outlineLight" className="w-full">
                    応募フォームへ
                  </ButtonLink>
                </div>
              </div>

              <nav aria-label="関連ページ" className="mt-8 flex flex-col gap-3.5">
                <TextLink href="/work">仕事内容</TextLink>
                <TextLink href="/beginner">未経験の方へ</TextLink>
                <TextLink href="/faq">よくある質問</TextLink>
                <TextLink href="/columns">コラム一覧</TextLink>
              </nav>
            </aside>
          </div>
        </Container>
      </Section>

      {/* ------------------------------- 関連記事 ------------------------------- */}
      {related.length > 0 && (
        <Section tone="mist" spacing="tight">
          <Container>
            <SectionHeading eyebrow="Related" title="あわせて読みたい記事" />
            <ul className="rule-list mt-10 border-t border-line">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/columns/${item.slug}`} className="group flex items-center gap-6 py-6">
                    <span className="w-28 shrink-0 text-xs font-bold text-jungle-deep">{item.category}</span>
                    <span className="flex-1 text-sm leading-7 font-bold text-ink sm:text-base">{item.title}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-ink transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <EntryCta />
    </>
  );
}
