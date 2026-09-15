import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, SectionHeading, ButtonLink, TextLink, NumberMark } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, serviceJsonLd, type Crumb } from '@/lib/structured-data';
import { imagePaths } from '@/lib/images';
import { services, qualityPolicies } from '@/data/services';
import { socialLinks } from '@/data/site';

export const metadata: Metadata = buildMetadata({
  title: '事業内容｜明石・神戸西の軽貨物配送会社',
  description:
    'JUNGLEの事業内容をご紹介します。兵庫県明石市・神戸市西部エリアでの個人宅向け宅配、企業配送を中心に、引越し・遺品回収などの運搬業務にも対応しています。',
  path: '/service',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '事業内容', href: '/service' },
];

export default function ServicePage() {
  const primaryServices = services.filter((service) => service.primary);
  const otherServices = services.filter((service) => !service.primary);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          ...services.map((s) =>
            serviceJsonLd({ name: s.name, description: s.description, path: s.path ?? '/service' }),
          ),
        ]}
      />

      <PageHero
        eyebrow="Service"
        title="兵庫県で「運ぶ」を担う。"
        lead="JUNGLEは兵庫県明石市・神戸市西部エリアを中心に、軽貨物配送を行っています。個人宅への宅配から企業配送まで、地域の物流を支える仕事です。"
        image={imagePaths.bridgeVans}
        imageAlt="夕景の明石海峡大橋を背に並ぶJUNGLEの軽貨物車両"
      />
      <Breadcrumbs crumbs={crumbs} />

      {/* ------------------------------ 主たる事業 ------------------------------ */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Core Business"
            title="軽貨物配送｜2つの柱"
            lead="軽自動車を使った配送を主たる事業としています。扱う荷物は軽自動車に積載できるサイズが中心です。"
          />

          <div className="mt-16 space-y-16">
            {primaryServices.map((service, index) => (
              <article key={service.id} className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
                <Photo
                  src={index === 0 ? imagePaths.handoverSenior : imagePaths.businessWarehouse}
                  alt={
                    index === 0
                      ? '個人宅の玄関先で荷物をお届けするJUNGLEのドライバー'
                      : '配送拠点で企業向けの荷物を仕分けするJUNGLEのスタッフ'
                  }
                  fallbackLabel={service.eyebrow}
                  className={`aspect-4/3 w-full ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
                <div>
                  <p className="display text-xs tracking-[0.22em] text-jungle-deep">{service.eyebrow}</p>
                  <h3 className="mt-4 text-2xl leading-relaxed font-bold text-ink sm:text-3xl">
                    {service.hasDetailPage ? (
                      <Link href={service.path} className="hover:text-jungle-deep">
                        {service.name}
                      </Link>
                    ) : (
                      service.name
                    )}
                  </h3>
                  <p className="mt-6 text-[0.9375rem] leading-8 text-body">{service.description}</p>
                  <ul className="mt-7 space-y-3">
                    {service.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-7 text-body">
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-4 shrink-0 bg-jungle" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  {service.hasDetailPage && (
                    <TextLink href={service.path} className="mt-7">
                      {service.name}の詳細を見る
                    </TextLink>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------ その他の事業 ----------------------------- */}
      <Section tone="mist" spacing="tight">
        <Container>
          <SectionHeading
            eyebrow="Other Services"
            title="運搬に関わるその他の事業"
            lead="「運ぶ」ことを軸に、地域のご依頼に幅広く対応してきました。"
          />
          <ul className="rule-list mt-12 border-t-2 border-ink">
            {otherServices.map((service) => (
              <li key={service.id} className="grid gap-4 py-8 sm:grid-cols-[13rem_1fr] sm:gap-10">
                <div>
                  <p className="display text-xs tracking-[0.2em] text-jungle-deep">{service.eyebrow}</p>
                  <h3 className="mt-2 text-lg font-bold text-ink">{service.name}</h3>
                </div>
                <div>
                  <p className="text-sm leading-7 text-body">{service.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {service.points.map((point) => (
                      <li key={point} className="text-xs text-body/70">
                        ・{point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* -------------------------- 荷物・エリア・体制 -------------------------- */}
      <Section tone="ink">
        <Container>
          <SectionHeading eyebrow="Coverage" tone="light" title="運ぶもの、走るエリア、届ける体制" />

          <div className="mt-14 grid gap-px bg-white/15 sm:grid-cols-3">
            {[
              {
                heading: 'どのような荷物を運ぶのか',
                body: '軽自動車に積載できるサイズの荷物が中心です。通販商品などの個人宅向けの荷物と、企業・事業所間でやり取りされる荷物の両方を扱っています。大型トラックが必要となる重量物や特殊車両を要する荷物は扱っていません。',
              },
              {
                heading: 'どのエリアに対応しているのか',
                body: '兵庫県明石市および神戸市西部エリアが中心です。担当エリアが集約されているため、同じ地域を繰り返し走るなかで配送の精度と効率が高まっていきます。エリアに関するご相談は個別にお受けしています。',
              },
              {
                heading: 'どのような配送体制なのか',
                body: '軽自動車を運転するドライバーが、担当エリアの配送を受け持つ体制です。ドライバーは単独で配送を行いますが、荷物のトラブルや業務上の判断に迷った際には連絡を取り合える体制を整えています。',
              },
            ].map((item) => (
              <div key={item.heading} className="bg-ink p-8">
                <h3 className="text-base font-bold text-white">{item.heading}</h3>
                <p className="mt-4 text-sm leading-7 text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------- 安全・品質への考え方 ---------------------------- */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Quality & Safety"
            title="安全と配送品質への考え方"
            lead="配送の仕事は、届いた状態と届くまでの安全がすべてです。JUNGLEが業務のなかで大切にしている考え方をお伝えします。"
          />
          <div className="mt-14 grid gap-x-14 sm:grid-cols-2">
            {qualityPolicies.map((policy) => (
              <div key={policy.number} className="border-t-2 border-ink/10 py-9">
                <NumberMark value={policy.number} />
                <h3 className="mt-4 text-lg font-bold text-ink">{policy.title}</h3>
                <p className="mt-4 text-sm leading-7 text-body">{policy.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------ 2つの導線 ------------------------------ */}
      <Section tone="mist">
        <Container>
          <div className="grid gap-px bg-line md:grid-cols-2">
            {/* 法人からの配送相談 */}
            <div className="flex flex-col bg-white p-9 sm:p-12">
              <p className="display text-xs tracking-[0.22em] text-jungle-deep">For Business</p>
              <h2 className="mt-4 text-xl leading-relaxed font-bold text-ink sm:text-2xl">
                配送業務のご依頼・ご相談
              </h2>
              <p className="mt-5 flex-1 text-sm leading-7 text-body">
                法人・事業者のお客様からの配送のご依頼、継続的な配送業務の受託についてのご相談を承っています。
                対応可能な範囲や条件については個別にご相談ください。
              </p>
              <div className="mt-6 space-y-3">
                <ButtonLink href="/contact/business" variant="ink" className="w-full">
                  配送のご依頼窓口へ
                </ButtonLink>
                {socialLinks.tel && (
                  <ButtonLink
                    href={`tel:${socialLinks.tel.replace(/-/g, "")}`}
                    variant="outline"
                    external
                    className="w-full"
                    ariaLabel={`電話で相談する ${socialLinks.tel}`}
                  >
                    お電話（{socialLinks.tel}）
                  </ButtonLink>
                )}
              </div>
            </div>

            {/* ドライバー募集 */}
            <div className="flex flex-col bg-ink p-9 sm:p-12">
              <p className="display text-xs tracking-[0.22em] text-jungle">For Drivers</p>
              <h2 className="mt-4 text-xl leading-relaxed font-bold text-white sm:text-2xl">
                軽貨物ドライバーの募集
              </h2>
              <p className="mt-5 flex-1 text-sm leading-7 text-white/70">
                事業拡大にともない、明石・神戸西エリアで走る軽貨物ドライバーを募集しています。
                普通自動車運転免許があれば、配送の実務経験がない方も応募いただけます。
              </p>
              <div className="mt-8 space-y-3">
                <ButtonLink href="/recruit" variant="primary" className="w-full">
                  採用情報を見る
                </ButtonLink>
                <ButtonLink href="/entry" variant="outlineLight" className="w-full">
                  応募フォームへ
                </ButtonLink>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs leading-6 text-body/70">
            ※ 配送のご依頼と、ドライバーとしての応募は窓口が異なります。応募フォームはドライバー応募専用です。配送のご依頼は
            <Link href="/company" className="link-underline font-bold text-ink">
              会社概要
            </Link>
            に記載の連絡先、またはInstagramよりご連絡ください。
          </p>
        </Container>
      </Section>

      <Section tone="white" spacing="tight">
        <Container>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <TextLink href="/about">JUNGLEについて</TextLink>
            <TextLink href="/company">会社概要</TextLink>
            <TextLink href="/work">仕事内容</TextLink>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
