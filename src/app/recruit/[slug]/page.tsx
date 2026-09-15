import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section, ButtonLink, TextLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FaqList } from '@/components/ui/FaqList';
import { ColumnBody } from '@/components/ui/ColumnBody';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, faqItemsToJsonLd, webPageJsonLd, type Crumb } from '@/lib/structured-data';
import { formatJapaneseDate } from '@/lib/format';
import { getRecruitGuide, recruitGuides } from '@/data/recruit-guides';
import { faqsByIds } from '@/data/faq';
import { getJob } from '@/data/jobs';

/**
 * 採用ガイド。応募前の疑問に検索意図ごとに答えるページです。
 *
 * ■ 重要
 *   このページには JobPosting 構造化データを設置しません。
 *   Googleしごと検索に出すのは、実際の求人1件を掲載する /jobs/[slug] のみです。
 */

export function generateStaticParams() {
  return recruitGuides.map((guide) => ({ slug: guide.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getRecruitGuide(slug);
  if (!guide) return {};

  return buildMetadata({
    title: guide.title,
    description: guide.description,
    path: `/recruit/${guide.slug}`,
  });
}

export default async function RecruitGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getRecruitGuide(slug);
  if (!guide) notFound();

  const faqItems = faqsByIds(guide.faqIds);
  const relatedJobs = guide.relatedJobSlugs
    .map((jobSlug) => getJob(jobSlug))
    .filter((job) => job && job.status === 'open');

  const crumbs: Crumb[] = [
    { name: 'ホーム', href: '/' },
    { name: '採用情報', href: '/recruit' },
    { name: guide.heading, href: `/recruit/${guide.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          webPageJsonLd({
            name: guide.heading,
            description: guide.description,
            path: `/recruit/${guide.slug}`,
            updatedAt: guide.updatedAt,
          }),
          faqItemsToJsonLd(faqItems),
        ]}
      />

      <PageHero
        eyebrow="採用ガイド"
        title={guide.heading}
        lead={guide.lead}
        image={guide.heroImage}
        imageAlt={guide.heroImageAlt}
      />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
            <article className="min-w-0">
              <p className="border-b border-line pb-5 text-xs text-body/60">
                最終更新日：
                <time dateTime={guide.updatedAt}>{formatJapaneseDate(guide.updatedAt)}</time>
              </p>

              <ColumnBody blocks={guide.blocks} />

              {/* FAQ */}
              {faqItems.length > 0 && (
                <section className="mt-16">
                  <h2 className="border-l-4 border-jungle pl-5 text-xl leading-relaxed font-bold text-ink sm:text-2xl">
                    このページに関するよくある質問
                  </h2>
                  <div className="mt-8 border-t border-line">
                    <FaqList items={faqItems} />
                  </div>
                </section>
              )}

              {/* 関連求人。実際の募集要項はこちらであることを明示します */}
              {relatedJobs.length > 0 && (
                <section className="mt-16 bg-ink p-8 sm:p-10">
                  <p className="display text-xs tracking-[0.22em] text-jungle">Job</p>
                  <h2 className="mt-4 text-xl leading-relaxed font-bold text-white">
                    実際の募集要項はこちらです
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    このページは応募前の疑問にお答えする内容です。報酬・条件・応募方法を含む正式な募集要項は、求人ページでご確認ください。
                  </p>
                  <ul className="mt-7 space-y-3">
                    {relatedJobs.map((job) => (
                      <li key={job!.slug}>
                        <ButtonLink href={`/jobs/${job!.slug}`} variant="primary" className="w-full">
                          {job!.title}
                        </ButtonLink>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 関連ページ */}
              <section className="mt-14">
                <h2 className="text-base font-bold text-ink">あわせて読みたいページ</h2>
                <ul className="rule-list mt-5 border-t border-line">
                  {guide.relatedLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="group flex items-center gap-5 py-5">
                        <span className="flex-1 text-sm leading-7 font-bold text-ink">{link.label}</span>
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
            </article>

            {/* サイド */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border-t-2 border-ink pt-7">
                <h2 className="display text-xs tracking-[0.2em] text-jungle-deep">Recruit Guide</h2>
                <p className="mt-4 text-sm leading-7 text-body">
                  応募前に確認しておきたいことを、テーマごとにまとめています。
                </p>
                <ul className="rule-list mt-5 border-t border-line">
                  {recruitGuides.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/recruit/${item.slug}`}
                        className={`block py-4 text-sm leading-6 transition-colors ${
                          item.slug === guide.slug
                            ? 'font-bold text-ink'
                            : 'text-body hover:text-ink'
                        }`}
                        aria-current={item.slug === guide.slug ? 'page' : undefined}
                      >
                        {item.heading}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <nav aria-label="関連ページ" className="mt-9 flex flex-col gap-3.5">
                <TextLink href="/recruit">採用情報トップへ戻る</TextLink>
                <TextLink href="/jobs">募集中の求人一覧を見る</TextLink>
                <TextLink href="/entry">応募フォームへ進む</TextLink>
              </nav>
            </aside>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
