import type { Metadata } from 'next';
import { Container, Section, SectionHeading, NoteBlock, TextLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, webPageJsonLd, type Crumb } from '@/lib/structured-data';
import { imagePaths } from '@/lib/images';
import { detailServices } from '@/data/services';
import { socialLinks } from '@/data/site';
import { company, show } from '@/data/company';

export const metadata: Metadata = buildMetadata({
  title: '配送のご依頼・法人向けお問い合わせ',
  description:
    '兵庫県明石市・神戸市西区での軽貨物配送のご依頼を承ります。個人宅向け宅配・企業向け配送について、お電話またはInstagramで荷物の内容とエリアをお知らせください。',
  path: '/contact/business',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '事業内容', href: '/service' },
  { name: '配送のご依頼', href: '/contact/business' },
];

/** ご相談時に伺う内容。先にまとめておいていただくと回答が早くなります */
const checklist = [
  { label: '荷物の種類', example: '段ボール・書類・部品など。おおよそのサイズと数量' },
  { label: '集荷場所', example: '倉庫・店舗・事業所などの所在地' },
  { label: '配送先エリア', example: '明石市内、神戸市西区など' },
  { label: '頻度・時間帯', example: '毎日／週数回／スポット、到着時間の指定の有無' },
];

export default function BusinessContactPage() {
  const tel = show(company.tel);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          webPageJsonLd({
            name: '配送のご依頼・法人向けお問い合わせ',
            description:
              '兵庫県明石市・神戸市西区での軽貨物配送のご依頼を承る、法人・事業者向けのお問い合わせ窓口です。',
            path: '/contact/business',
            updatedAt: '2026-09-15',
          }),
        ]}
      />

      <PageHero
        eyebrow="For Business"
        title="配送のご依頼・ご相談"
        lead="兵庫県明石市・神戸市西区での軽貨物配送を承っています。お電話またはInstagramで荷物の内容と配送先のエリアをお知らせいただければ、対応可否をご回答します。"
        image={imagePaths.businessWarehouse}
        imageAlt="事業所で企業向けの荷物を仕分けするJUNGLE TRANSPORTのスタッフ"
      />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="Contact" title="お電話・Instagramでご相談ください" as="h2" />
              <p className="mt-6 text-sm leading-8 text-body">
                以下の内容をお伝えいただけますと、対応可否とお見積りのご回答がスムーズです。決まっていない項目があっても構いません。
              </p>

              <dl className="rule-list mt-8 border-t border-line">
                {checklist.map((item) => (
                  <div key={item.label} className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-8">
                    <dt className="text-sm font-bold text-ink">{item.label}</dt>
                    <dd className="text-sm leading-7 text-body">{item.example}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 bg-ink p-7 sm:p-10">
                {tel && (
                  <>
                    <h3 className="text-base font-bold text-white">お電話でのご相談</h3>
                    <a
                      href={`tel:${tel.replace(/-/g, '')}`}
                      className="mt-5 flex min-h-14 items-center justify-center bg-jungle text-lg font-bold text-ink transition-colors hover:bg-white"
                      aria-label={`電話で相談する ${tel}`}
                    >
                      {tel}
                    </a>
                    {!show(company.telHours) && (
                      <p className="mt-3 text-xs leading-6 text-white/50">
                        ※ 受付時間は準備でき次第こちらに掲載します。
                      </p>
                    )}
                  </>
                )}
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex min-h-14 items-center justify-center border-2 border-white/60 text-base font-bold text-white transition-colors hover:bg-white hover:text-ink"
                >
                  InstagramのDMで相談する
                </a>
              </div>

              <div className="mt-8">
                <NoteBlock title="ドライバーとしての応募をご希望の方へ">
                  こちらは配送のご依頼窓口です。ドライバーとしての応募は
                  <a
                    href="/entry"
                    className="font-bold text-ink underline decoration-jungle decoration-2 underline-offset-4"
                  >
                    応募フォーム
                  </a>
                  からお願いします。
                </NoteBlock>
              </div>
            </div>

            <aside className="space-y-10">
              {/* 対応できること */}
              <div className="border-t-2 border-ink pt-7">
                <h2 className="display text-xs tracking-[0.2em] text-jungle-deep">What We Do</h2>
                <p className="mt-4 text-sm leading-7 text-body">対応している配送は以下の2種類です。</p>
                <ul className="mt-5 space-y-4">
                  {detailServices().map((service) => (
                    <li key={service.id}>
                      <TextLink href={service.path}>{service.name}</TextLink>
                      <p className="mt-2 text-xs leading-6 text-body/70">{service.points[0]}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 対応エリア */}
              <div className="border-t-2 border-ink pt-7">
                <h2 className="display text-xs tracking-[0.2em] text-jungle-deep">Area</h2>
                <ul className="mt-4 space-y-2 text-sm leading-7 font-bold text-ink">
                  <li>兵庫県明石市（全域）</li>
                  <li>兵庫県神戸市西区</li>
                </ul>
                <p className="mt-3 text-xs leading-6 text-body/70">
                  近隣地域への配送についてはご相談ください。稼働状況により対応可能な範囲が変わります。
                </p>
                <TextLink href="/area" className="mt-4">
                  対応エリアの詳細を見る
                </TextLink>
              </div>

              <NoteBlock title="料金について">
                配送の内容（荷物のサイズ・数量・エリア・頻度）によって条件が異なるため、当サイトには一律の料金を掲載していません。ご相談いただいた内容にもとづいてお見積りをご提示します。
              </NoteBlock>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
