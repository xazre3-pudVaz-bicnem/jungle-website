import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Section, SectionHeading, ButtonLink, TextLink, NoteBlock } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { buildMetadata } from '@/lib/seo';
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
  webPageJsonLd,
  type Crumb,
} from '@/lib/structured-data';
import { formatJapaneseDate } from '@/lib/format';
import { detailServices, getService, services } from '@/data/services';
import { socialLinks } from '@/data/site';

export function generateStaticParams() {
  return detailServices().map((service) => ({ slug: service.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service?.hasDetailPage) return {};

  return buildMetadata({
    title: service.pageTitle ?? service.name,
    description: service.pageDescription ?? service.description,
    path: service.path,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service?.hasDetailPage) notFound();

  const others = detailServices().filter((s) => s.id !== service.id);

  const crumbs: Crumb[] = [
    { name: 'ホーム', href: '/' },
    { name: '事業内容', href: '/service' },
    { name: service.name, href: service.path },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          serviceJsonLd({ name: service.name, description: service.description, path: service.path }),
          webPageJsonLd({
            name: service.pageTitle ?? service.name,
            description: service.pageDescription ?? service.description,
            path: service.path,
            updatedAt: service.updatedAt,
          }),
          faqPageJsonLd(service.faqs ?? []),
        ]}
      />

      <PageHero
        eyebrow={service.eyebrow}
        title={service.name}
        lead={service.lead}
        image={service.heroImage}
        imageAlt={service.heroImageAlt}
      />
      <Breadcrumbs crumbs={crumbs} />

      {/* ------------------------------ 対応の要点 ------------------------------ */}
      <Section tone="mist" spacing="tight">
        <Container>
          <h2 className="sr-only">対応の要点</h2>
          <dl className="grid gap-px bg-line sm:grid-cols-3">
            <div className="bg-mist p-7">
              <dt className="text-xs font-bold text-body/60">対応エリア</dt>
              <dd className="mt-3 space-y-1 text-sm leading-7 font-bold text-ink">
                {(service.coverage ?? []).map((c) => (
                  <p key={c}>{c}</p>
                ))}
              </dd>
            </div>
            <div className="bg-mist p-7">
              <dt className="text-xs font-bold text-body/60">使用車両</dt>
              <dd className="mt-3 text-sm leading-7 font-bold text-ink">
                軽自動車（軽バン）
                <span className="mt-1 block text-xs font-normal text-body/70">
                  積載できるサイズ・重量の荷物が対象です
                </span>
              </dd>
            </div>
            <div className="bg-mist p-7">
              <dt className="text-xs font-bold text-body/60">対応時間</dt>
              <dd className="mt-3 text-sm leading-7 font-bold text-ink">
                {service.hours?.value ?? 'ご相談ください'}
                <span className="mt-1 block text-xs font-normal text-body/70">{service.hours?.note}</span>
              </dd>
            </div>
          </dl>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
            <div className="min-w-0 space-y-16">
              {/* サービス概要 */}
              <section>
                <SectionHeading eyebrow="Overview" title="サービスの概要" as="h2" />
                <p className="mt-6 text-[0.9375rem] leading-8 text-body">{service.description}</p>
                <ul className="mt-7 space-y-3">
                  {service.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-7 text-body">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-4 shrink-0 bg-jungle" />
                      {point}
                    </li>
                  ))}
                </ul>
              </section>

              {/* 対応できる荷物 */}
              <section>
                <SectionHeading eyebrow="Cargo" title="対応できる荷物" as="h2" />
                <ul className="rule-list mt-8 border-t-2 border-ink">
                  {(service.cargo ?? []).map((item) => (
                    <li key={item} className="py-5 text-sm leading-7 text-body">
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <NoteBlock title="対応できない荷物">
                    軽自動車に積載できるサイズ・重量を超える荷物、および特殊車両を要する荷物には対応していません。荷物の寸法と重量をお知らせいただければ、対応可否をご回答します。
                  </NoteBlock>
                </div>
              </section>

              {/* 受託までの流れ */}
              <section>
                <SectionHeading eyebrow="Flow" title="ご依頼から運用開始までの流れ" as="h2" />
                <ol className="rule-list mt-8 border-t-2 border-ink">
                  {(service.flow ?? []).map((step, index) => (
                    <li key={step.title} className="grid gap-4 py-7 sm:grid-cols-[5rem_1fr] sm:gap-8">
                      <span className="display text-3xl leading-none text-jungle-deep" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-ink">{step.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-body">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* 安全・品質 */}
              <section>
                <SectionHeading eyebrow="Quality" title="安全と配送品質への取り組み" as="h2" />
                <ul className="mt-8 space-y-4">
                  {(service.quality ?? []).map((item) => (
                    <li key={item} className="flex gap-4 text-[0.9375rem] leading-8 text-body">
                      <span aria-hidden="true" className="mt-3.5 h-1.5 w-5 shrink-0 bg-jungle" />
                      {item}
                    </li>
                  ))}
                </ul>
                <TextLink href="/about" className="mt-7">
                  JUNGLE TRANSPORTの考え方を見る
                </TextLink>
              </section>

              {/* FAQ */}
              {service.faqs && service.faqs.length > 0 && (
                <section>
                  <SectionHeading eyebrow="FAQ" title="よくある質問" as="h2" />
                  <div className="rule-list mt-8 border-t border-line">
                    {service.faqs.map((faq) => (
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
              )}
            </div>

            {/* サイド：法人問い合わせ */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="bg-ink p-8">
                <p className="display text-xs tracking-[0.22em] text-jungle">For Business</p>
                <h2 className="mt-4 text-lg leading-relaxed font-bold text-white">配送のご依頼・ご相談</h2>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  法人・事業者のお客様からのご依頼を承っています。荷物の内容とご希望のエリア・頻度をお知らせください。
                </p>
                <div className="mt-7 space-y-3">
                  <ButtonLink href="/contact/business" variant="primary" className="w-full">
                    法人向け問い合わせフォーム
                  </ButtonLink>
                  {socialLinks.tel && (
                    <ButtonLink
                      href={`tel:${socialLinks.tel.replace(/-/g, '')}`}
                      variant="outlineLight"
                      external
                      className="w-full"
                      ariaLabel={`電話で相談する ${socialLinks.tel}`}
                    >
                      {socialLinks.tel}
                    </ButtonLink>
                  )}
                </div>
                <p className="mt-5 text-xs leading-6 text-white/50">
                  ※ ドライバーとしての応募は
                  <a href="/entry" className="underline decoration-jungle underline-offset-2">
                    応募フォーム
                  </a>
                  からお願いします。
                </p>
              </div>

              {service.updatedAt && (
                <p className="mt-6 text-xs text-body/60">
                  最終更新日：
                  <time dateTime={service.updatedAt}>{formatJapaneseDate(service.updatedAt)}</time>
                </p>
              )}

              <nav aria-label="関連ページ" className="mt-8 flex flex-col gap-3.5">
                <TextLink href="/service">事業内容トップへ戻る</TextLink>
                {others.map((other) => (
                  <TextLink key={other.id} href={other.path}>
                    {other.name}について
                  </TextLink>
                ))}
                <TextLink href="/area">対応エリアを見る</TextLink>
                <TextLink href="/company">会社概要を見る</TextLink>
                <TextLink href="/recruit">ドライバー採用情報を見る</TextLink>
              </nav>
            </aside>
          </div>
        </Container>
      </Section>

      {/* ------------------------- ドライバー募集への導線 ------------------------- */}
      <Section tone="mist" spacing="tight">
        <Container>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">一緒に配送を担うドライバーも募集しています</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-body">
                明石市・神戸市西区で稼働する軽貨物ドライバーを募集しています。業務委託契約で、普通自動車運転免許があれば未経験の方も応募いただけます。
              </p>
            </div>
            <ButtonLink href="/recruit" variant="ink" className="shrink-0">
              採用情報を見る
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* 他のサービスがある場合の内部リンク */}
      {services.filter((s) => !s.hasDetailPage).length > 0 && (
        <Section tone="white" spacing="tight">
          <Container>
            <h2 className="text-base font-bold text-ink">JUNGLE TRANSPORTのその他の事業</h2>
            <ul className="rule-list mt-5 border-t border-line">
              {services
                .filter((s) => !s.hasDetailPage)
                .map((s) => (
                  <li key={s.id} className="grid gap-2 py-5 sm:grid-cols-[13rem_1fr] sm:gap-10">
                    <span className="text-sm font-bold text-ink">{s.name}</span>
                    <span className="text-sm leading-7 text-body">{s.description}</span>
                  </li>
                ))}
            </ul>
            <TextLink href="/service" className="mt-8">
              事業内容の一覧を見る
            </TextLink>
          </Container>
        </Section>
      )}
    </>
  );
}
