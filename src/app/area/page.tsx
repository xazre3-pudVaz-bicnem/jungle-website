import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, SectionHeading, TextLink, NoteBlock } from '@/components/ui/Primitives';
import { Photo } from '@/components/ui/Photo';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, collectionPageJsonLd, type Crumb } from '@/lib/structured-data';
import { imagePaths } from '@/lib/images';
import { areas } from '@/data/areas';
import { businessDefinition } from '@/data/site';

export const metadata: Metadata = buildMetadata({
  title: '対応エリア｜明石市・神戸市西区の軽貨物配送',
  description:
    'JUNGLE TRANSPORTが軽貨物配送に対応しているエリアをご紹介します。兵庫県明石市と神戸市西区を中心に、個人宅向けの宅配と企業向けの配送を行っています。',
  path: '/area',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '対応エリア', href: '/area' },
];

export default function AreaIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          collectionPageJsonLd({
            name: '対応エリア',
            description:
              'JUNGLE TRANSPORTが軽貨物配送に対応している兵庫県内のエリア一覧です。',
            path: '/area',
            items: areas.map((area) => ({ name: area.name, path: `/area/${area.slug}` })),
          }),
        ]}
      />

      <PageHero
        eyebrow="Area"
        title="対応エリア"
        lead={`${businessDefinition}それぞれのエリアの特徴と、配送・募集の状況をご説明します。`}
        image={imagePaths.vanBridge}
        imageAlt="明石海峡大橋を望む場所に停まるJUNGLE TRANSPORTの軽貨物車両"
      />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Coverage"
            title="兵庫県内の2エリアで稼働しています"
            lead="実際に配送している地域、かつドライバーの募集対象となっている地域のみを掲載しています。"
          />

          <ul className="mt-14 space-y-14">
            {areas.map((area, index) => (
              <li key={area.slug}>
                <article className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-14">
                  <Photo
                    src={area.heroImage}
                    alt={area.heroImageAlt}
                    fallbackLabel={area.name}
                    className={`aspect-4/3 w-full ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                  <div>
                    <h3 className="text-2xl leading-relaxed font-bold text-ink sm:text-3xl">
                      <Link href={`/area/${area.slug}`} className="hover:text-jungle-deep">
                        {area.name}
                      </Link>
                    </h3>
                    <p className="mt-5 text-[0.9375rem] leading-8 text-body">{area.lead}</p>
                    <ul className="mt-6 space-y-2.5">
                      {area.merits.slice(0, 3).map((merit) => (
                        <li key={merit} className="flex gap-3 text-sm leading-7 text-body">
                          <span aria-hidden="true" className="mt-2.5 h-1.5 w-4 shrink-0 bg-jungle" />
                          {merit}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
                      <TextLink href={`/area/${area.slug}`}>{area.name}の配送エリア情報を見る</TextLink>
                      {area.recruitGuideSlug && (
                        <TextLink href={`/recruit/${area.recruitGuideSlug}`}>
                          {area.name}の求人情報を見る
                        </TextLink>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-16">
            <NoteBlock title="掲載しているエリアについて">
              当サイトには、実際に配送を行っており、かつドライバーの募集対象となっているエリアのみを掲載しています。地域名だけを差し替えたページは作成していません。上記以外の地域への配送や、他地域からの通勤についてはご相談ください。
            </NoteBlock>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <TextLink href="/service">事業内容を見る</TextLink>
            <TextLink href="/recruit">採用情報を見る</TextLink>
            <TextLink href="/contact/business">配送のご依頼（法人の方）</TextLink>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
