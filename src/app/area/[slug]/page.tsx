import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section, SectionHeading, ButtonLink, TextLink } from '@/components/ui/Primitives';
import { Photo } from '@/components/ui/Photo';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, faqPageJsonLd, webPageJsonLd, type Crumb } from '@/lib/structured-data';
import { formatJapaneseDate } from '@/lib/format';
import { areas, getArea } from '@/data/areas';
import { openJobsInLocality } from '@/data/jobs';
import { getColumn } from '@/data/columns';

export function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) return {};

  return buildMetadata({
    title: area.title,
    description: area.description,
    path: `/area/${area.slug}`,
  });
}

export default async function AreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const jobs = openJobsInLocality(area.jobLocality);
  const relatedColumns = area.relatedColumnSlugs.map((s) => getColumn(s)).filter(Boolean);

  const crumbs: Crumb[] = [
    { name: 'ホーム', href: '/' },
    { name: '対応エリア', href: '/area' },
    { name: area.name, href: `/area/${area.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          webPageJsonLd({
            name: area.title,
            description: area.description,
            path: `/area/${area.slug}`,
            updatedAt: area.updatedAt,
          }),
          faqPageJsonLd(area.faqs),
        ]}
      />

      <PageHero
        eyebrow={`${area.name}｜対応エリア`}
        title={area.title}
        lead={area.lead}
        image={area.heroImage}
        imageAlt={area.heroImageAlt}
      />
      <Breadcrumbs crumbs={crumbs} />

      {/* ------------------------------ 要点の整理 ------------------------------ */}
      <Section tone="mist" spacing="tight">
        <Container>
          <h2 className="sr-only">{area.name}での対応内容</h2>
          <dl className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['配送内容', '個人宅向け宅配／企業向け配送'],
              ['配送エリア', area.name],
              ['ドライバー募集', jobs.length > 0 ? '募集中' : '現在は募集していません'],
              ['通勤できる地域', area.commuteFrom.slice(0, 3).join('／') + ' ほか'],
            ].map(([label, value]) => (
              <div key={label} className="bg-mist p-6">
                <dt className="text-xs font-bold text-body/60">{label}</dt>
                <dd className="mt-2.5 text-sm leading-7 font-bold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
            <div className="min-w-0 space-y-16">
              {/* 街の構成 */}
              <section>
                <SectionHeading eyebrow="Geography" title={`${area.name}の街の構成`} as="h2" />
                <div className="mt-8 space-y-8">
                  {area.geography.map((item) => (
                    <div key={item.heading} className="border-l-2 border-jungle pl-6">
                      <h3 className="text-lg leading-relaxed font-bold text-ink">{item.heading}</h3>
                      <p className="mt-3 text-[0.9375rem] leading-8 text-body">{item.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 写真 */}
              <section className="grid gap-6 sm:grid-cols-2">
                {area.images.map((image) => (
                  <figure key={image.src}>
                    <Photo
                      src={image.src}
                      alt={image.alt}
                      fallbackLabel={area.name}
                      className="aspect-4/3 w-full"
                      sizes="(min-width: 1024px) 30vw, 50vw"
                    />
                    <figcaption className="mt-3 text-xs leading-6 text-body/70">{image.caption}</figcaption>
                  </figure>
                ))}
              </section>

              {/* 運転で意識する点 */}
              <section>
                <SectionHeading eyebrow="Driving" title={`${area.name}を走るときに意識すること`} as="h2" />
                <div className="mt-8 space-y-8">
                  {area.drivingNotes.map((item) => (
                    <div key={item.heading}>
                      <h3 className="text-lg leading-relaxed font-bold text-ink">{item.heading}</h3>
                      <p className="mt-3 text-[0.9375rem] leading-8 text-body">{item.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* メリットと注意点 */}
              <section>
                <SectionHeading eyebrow="Pros & Cons" title={`${area.name}で働くメリットと注意点`} as="h2" />
                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  <div className="border-t-4 border-ink pt-6">
                    <h3 className="text-base font-bold text-ink">メリット</h3>
                    <ul className="mt-4 space-y-3">
                      {area.merits.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-7 text-body">
                          <span aria-hidden="true" className="mt-2.5 h-1.5 w-4 shrink-0 bg-jungle" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t-4 border-line pt-6">
                    <h3 className="text-base font-bold text-ink">注意点</h3>
                    <ul className="mt-4 space-y-3">
                      {area.cautions.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-7 text-body">
                          <span aria-hidden="true" className="mt-3 h-1 w-3.5 shrink-0 bg-line" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* 通勤 */}
              <section>
                <SectionHeading eyebrow="Commute" title="通勤しやすい周辺地域" as="h2" />
                <p className="mt-6 text-[0.9375rem] leading-8 text-body">
                  {area.name}にお住まいでなくても、通勤が可能な範囲であればご相談いただけます。以下の地域からの通勤実績についてはお問い合わせください。なお、通勤にかかる時間そのものは報酬の対象になりません。
                </p>
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {area.commuteFrom.map((city) => (
                    <li key={city} className="border border-line px-4 py-2 text-sm font-bold text-body">
                      {city}
                    </li>
                  ))}
                </ul>
              </section>

              {/* FAQ */}
              <section>
                <SectionHeading eyebrow="FAQ" title={`${area.name}に関するよくある質問`} as="h2" />
                <div className="rule-list mt-8 border-t border-line">
                  {area.faqs.map((faq) => (
                    <details key={faq.question} className="group">
                      <summary className="flex cursor-pointer list-none items-start gap-4 py-6 text-left text-[1.0625rem] leading-8 font-bold text-ink hover:text-jungle-deep">
                        <span className="display mt-0.5 shrink-0 text-lg text-jungle-deep" aria-hidden="true">
                          Q
                        </span>
                        <span className="flex-1">{faq.question}</span>
                        <span
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-xl leading-none text-body/40 transition-transform group-open:rotate-45"
                        >
                          ＋
                        </span>
                      </summary>
                      <div className="flex gap-4 pb-7">
                        <span className="display mt-0.5 shrink-0 text-lg text-jungle-deep/60" aria-hidden="true">
                          A
                        </span>
                        <div className="flex-1 space-y-4 text-[0.9375rem] leading-8 text-body">
                          {faq.answer.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            {/* サイド */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              {jobs.length > 0 ? (
                <div className="bg-ink p-8">
                  <p className="display text-xs tracking-[0.22em] text-jungle">Job</p>
                  <h2 className="mt-4 text-lg leading-relaxed font-bold text-white">
                    {area.name}で募集中の求人
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {jobs.map((job) => (
                      <li key={job.slug}>
                        <ButtonLink href={`/jobs/${job.slug}`} variant="primary" className="w-full">
                          {job.title}
                        </ButtonLink>
                      </li>
                    ))}
                  </ul>
                  {area.recruitGuideSlug && (
                    <Link
                      href={`/recruit/${area.recruitGuideSlug}`}
                      className="mt-5 inline-flex text-sm font-bold text-white underline decoration-jungle decoration-2 underline-offset-4"
                    >
                      {area.name}で働く場合の詳しい説明を見る
                    </Link>
                  )}
                </div>
              ) : (
                <div className="border-l-4 border-jungle bg-mist p-7">
                  <p className="text-sm font-bold text-ink">現在、このエリアでの募集はありません</p>
                  <p className="mt-3 text-sm leading-7 text-body">
                    募集を再開した際に掲載します。今後の募集についてのご相談は応募フォームよりお問い合わせください。
                  </p>
                </div>
              )}

              <p className="mt-6 text-xs text-body/60">
                最終更新日：
                <time dateTime={area.updatedAt}>{formatJapaneseDate(area.updatedAt)}</time>
              </p>

              <nav aria-label="関連ページ" className="mt-8 flex flex-col gap-3.5">
                <TextLink href="/area">対応エリア一覧へ戻る</TextLink>
                <TextLink href="/service/home-delivery">個人宅向け宅配について</TextLink>
                <TextLink href="/service/business-delivery">企業向け配送について</TextLink>
                <TextLink href="/contact/business">配送のご依頼（法人の方）</TextLink>
                {relatedColumns.map((column) => (
                  <TextLink key={column!.slug} href={`/columns/${column!.slug}`}>
                    コラム：{column!.title.split('｜')[0]}
                  </TextLink>
                ))}
              </nav>
            </aside>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
