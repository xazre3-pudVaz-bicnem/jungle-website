import type { Metadata } from 'next';
import { Container, Section, SectionHeading, NoteBlock, TextLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { BusinessContactForm } from '@/components/contact/BusinessContactForm';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, webPageJsonLd, type Crumb } from '@/lib/structured-data';
import { imagePaths } from '@/lib/images';
import { detailServices } from '@/data/services';
import { socialLinks } from '@/data/site';
import { company, show } from '@/data/company';

export const metadata: Metadata = buildMetadata({
  title: '配送のご依頼・法人向けお問い合わせ',
  description:
    '兵庫県明石市・神戸市西区での軽貨物配送のご依頼を承ります。個人宅向け宅配・企業向け配送について、荷物の内容とエリアをお知らせください。対応可否をご回答します。',
  path: '/contact/business',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '事業内容', href: '/service' },
  { name: '配送のご依頼', href: '/contact/business' },
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
            updatedAt: '2026-08-02',
          }),
        ]}
      />

      <PageHero
        eyebrow="For Business"
        title="配送のご依頼・ご相談"
        lead="兵庫県明石市・神戸市西区での軽貨物配送を承っています。荷物の内容と配送先のエリアをお知らせいただければ、対応可否をご回答します。"
        image={imagePaths.businessWarehouse}
        imageAlt="事業所で企業向けの荷物を仕分けするJUNGLE TRANSPORTのスタッフ"
      />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="Form" title="お問い合わせ内容の入力" as="h2" />
              <p className="mt-6 text-sm leading-8 text-body">
                「必須」の項目はすべてご記入ください。荷物の種類・集荷場所・配送先エリア・頻度をお知らせいただけますと、対応可否のご回答がスムーズです。
              </p>

              <div className="mt-8">
                <NoteBlock title="このフォームは法人・事業者の方専用です">
                  ドライバーとしての応募をご希望の方は、
                  <a
                    href="/entry"
                    className="font-bold text-ink underline decoration-jungle decoration-2 underline-offset-4"
                  >
                    応募フォーム
                  </a>
                  からお願いします。窓口を分けているため、こちらから応募いただくとご連絡が遅くなる場合があります。
                </NoteBlock>
              </div>

              <div className="mt-10">
                <BusinessContactForm />
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

              {/* 電話 */}
              {tel && (
                <div className="bg-ink p-7">
                  <h2 className="text-base font-bold text-white">お電話でのご相談</h2>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    お急ぎの場合はお電話ください。配送内容をお伺いします。
                  </p>
                  <a
                    href={`tel:${tel.replace(/-/g, '')}`}
                    className="mt-5 flex min-h-12 items-center justify-center bg-jungle text-base font-bold text-ink transition-colors hover:bg-white"
                    aria-label={`電話で相談する ${tel}`}
                  >
                    {tel}
                  </a>
                  {!show(company.telHours) && (
                    <p className="mt-3 text-xs leading-6 text-white/50">
                      ※ 受付時間は準備でき次第こちらに掲載します。
                    </p>
                  )}
                  {socialLinks.email && (
                    <a
                      href={`mailto:${socialLinks.email}`}
                      className="mt-3 flex min-h-12 items-center justify-center border-2 border-white/60 px-3 text-center text-xs font-bold break-all text-white transition-colors hover:bg-white hover:text-ink sm:text-sm"
                    >
                      {socialLinks.email}
                    </a>
                  )}
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex min-h-12 items-center justify-center border-2 border-white/60 text-sm font-bold text-white transition-colors hover:bg-white hover:text-ink"
                  >
                    Instagramから相談する
                  </a>
                </div>
              )}

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
