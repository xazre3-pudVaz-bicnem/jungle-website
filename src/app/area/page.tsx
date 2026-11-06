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
import { getArea, type Area } from '@/data/areas';
import { coverageRegions } from '@/data/coverage';
import { businessDefinition } from '@/data/site';

export const metadata: Metadata = buildMetadata({
  title: '対応エリア｜兵庫・神奈川・東京の軽貨物配送',
  description:
    'JUNGLE TRANSPORTが軽貨物配送に対応しているエリアをご紹介します。兵庫県と神奈川県を拠点に、神戸市・明石市・加古川市、横浜市・川崎市、東京都の西東京エリア・都内の一部で配送を行っています。',
  path: '/area',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '対応エリア', href: '/area' },
];

/** coverage.ts の並び順（都県 → 市）で地域ページを並べます */
const regionsWithAreas = coverageRegions.map((region) => ({
  ...region,
  areas: region.cities
    .map((city) => getArea(city.slug))
    .filter((area): area is Area => Boolean(area)),
}));

const allAreas = regionsWithAreas.flatMap((region) => region.areas);

/** 都県名の横に付ける「拠点」ラベル */
function BaseBadge() {
  return (
    <span className="bg-jungle px-2 py-1 text-[0.6875rem] leading-none font-bold text-ink">拠点</span>
  );
}

export default function AreaIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          collectionPageJsonLd({
            name: '対応エリア',
            description:
              'JUNGLE TRANSPORTが軽貨物配送に対応している兵庫県・神奈川県・東京都のエリア一覧です。',
            path: '/area',
            items: allAreas.map((area) => ({ name: area.fullName, path: `/area/${area.slug}` })),
          }),
        ]}
      />

      <PageHero
        eyebrow="Area"
        title="対応エリア"
        lead={`${businessDefinition}エリアごとの特徴と、配送・募集の状況をご説明します。`}
        image={imagePaths.vanBridge}
        imageAlt="明石海峡大橋を望む場所に停まるJUNGLE TRANSPORTの軽貨物車両"
      />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Coverage"
            title="兵庫・神奈川を拠点に、3都県で稼働しています"
            lead="実際に配送している地域、かつドライバーの募集対象となっている地域のみを掲載しています。"
          />

          {/* ひと目で範囲が分かる一覧 */}
          <dl className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-3">
            {regionsWithAreas.map((region) => (
              <div key={region.prefecture} className="bg-white p-6 sm:p-7">
                <dt className="flex items-center gap-3">
                  <span className="text-lg font-bold text-ink">{region.prefecture}</span>
                  {region.isBase && <BaseBadge />}
                </dt>
                <dd className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm leading-7">
                  {region.areas.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/area/${area.slug}`}
                      className="font-bold text-body underline decoration-jungle decoration-2 underline-offset-4 hover:text-ink"
                    >
                      {region.cities.find((city) => city.slug === area.slug)?.name ?? area.name}
                    </Link>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

          {/* 都県ごとの地域ページ */}
          {regionsWithAreas.map((region) => (
            <section key={region.prefecture} className="mt-20" aria-labelledby={`region-${region.en}`}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b-2 border-ink pb-4">
                <h3 id={`region-${region.en}`} className="text-2xl font-bold text-ink sm:text-3xl">
                  {region.prefecture}
                </h3>
                {region.isBase && <BaseBadge />}
                <p className="display ml-auto text-xs tracking-[0.22em] text-jungle-deep">{region.en}</p>
              </div>

              <ul className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {region.areas.map((area) => (
                  <li key={area.slug}>
                    <article>
                      <Photo
                        src={area.heroImage}
                        alt={area.heroImageAlt}
                        fallbackLabel={area.name}
                        className="aspect-4/3 w-full"
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                      />
                      <h4 className="mt-6 text-xl leading-relaxed font-bold text-ink sm:text-2xl">
                        <Link href={`/area/${area.slug}`} className="hover:text-jungle-deep">
                          {area.name}
                        </Link>
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-body">{area.lead}</p>
                      <div className="mt-6 flex flex-col items-start gap-3">
                        <TextLink href={`/area/${area.slug}`}>{area.name}の配送エリア情報を見る</TextLink>
                        {area.recruitGuideSlug && (
                          <TextLink href={`/recruit/${area.recruitGuideSlug}`}>
                            {area.name}の求人情報を見る
                          </TextLink>
                        )}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <div className="mt-20">
            <NoteBlock title="掲載しているエリアについて">
              当サイトには、実際に配送を行っており、かつドライバーの募集対象となっているエリアのみを掲載しています。地域名だけを差し替えたページは作成していません。上記以外の地域への配送や、他地域からの通勤についてはご相談ください。
            </NoteBlock>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <TextLink href="/service">事業内容を見る</TextLink>
            <TextLink href="/service/charter">チャーター便について</TextLink>
            <TextLink href="/recruit">採用情報を見る</TextLink>
            <TextLink href="/contact/business">配送のご依頼（法人の方）</TextLink>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
