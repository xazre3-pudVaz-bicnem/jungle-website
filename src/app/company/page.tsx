import type { Metadata } from 'next';
import { Container, Section, SectionHeading, TextLink, NoteBlock, ButtonLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, organizationJsonLd, type Crumb } from '@/lib/jsonld';
import { imagePaths } from '@/lib/images';
import { company, companyProfileRows, companyTodos, show } from '@/data/company';
import { socialLinks } from '@/data/site';
import { services } from '@/data/services';

export const metadata: Metadata = buildMetadata({
  title: '会社概要｜兵庫県の軽貨物配送',
  description:
    '兵庫県明石市・神戸市西部エリアで軽貨物配送を行うJUNGLE TRANSPORTの会社概要です。事業内容、稼働エリア、お問い合わせ方法を掲載しています。',
  path: '/company',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '会社概要', href: '/company' },
];

export default function CompanyPage() {
  // value が null の行は表示しない（推測値・ダミーを画面に出さないため）
  const visibleRows = companyProfileRows();

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), organizationJsonLd()]} />

      <PageHero
        eyebrow="Company"
        title="会社概要"
        lead="兵庫県明石市・神戸市西部エリアを中心に軽貨物配送を行うJUNGLE TRANSPORTの基本情報です。"
        image={imagePaths.depotCart}
        imageAlt="配送拠点で台車を使って荷物を積み替えるJUNGLEのスタッフ"
      />
      <Breadcrumbs crumbs={crumbs} />

      {/* ------------------------------- 会社概要表 ------------------------------ */}
      <Section tone="white">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="Profile" title={show(company.brandName) ?? 'JUNGLE TRANSPORT'} />

              <dl className="rule-list mt-10 border-t-2 border-ink">
                {visibleRows.map((row) => (
                  <div key={row.label} className="grid gap-2 py-6 sm:grid-cols-[11rem_1fr] sm:gap-8">
                    <dt className="text-sm font-bold text-ink">{row.label}</dt>
                    <dd className="text-sm leading-7 text-body">
                      {row.value}
                      {row.note && <span className="mt-1.5 block text-xs text-body/60">※ {row.note}</span>}
                    </dd>
                  </div>
                ))}
              </dl>

              <NoteBlock title="掲載していない項目について">
                所在地・代表者名・設立年月・電話番号などは、公開できる情報として確認が取れ次第、このページに掲載します。当サイトでは、未確認の情報を推測で記載することは行っていません。
              </NoteBlock>
            </div>

            {/* お問い合わせ */}
            <div>
              <div className="bg-ink p-8 sm:p-10">
                <p className="display text-xs tracking-[0.22em] text-jungle">Contact</p>
                <h2 className="mt-4 text-xl font-bold text-white">お問い合わせ</h2>
                <p className="mt-5 text-sm leading-7 text-white/70">
                  配送業務のご依頼、採用に関するお問い合わせを受け付けています。目的に応じて窓口をお選びください。
                </p>

                <div className="mt-8 space-y-6">
                  <div className="border-l-2 border-jungle pl-5">
                    <p className="text-sm font-bold text-white">ドライバー応募</p>
                    <p className="mt-2 text-xs leading-6 text-white/60">
                      応募フォームからお送りください。ご質問だけのご相談も歓迎しています。
                    </p>
                    <ButtonLink href="/entry" variant="primary" className="mt-4 w-full">
                      応募フォームへ
                    </ButtonLink>
                  </div>

                  <div className="border-l-2 border-white/30 pl-5">
                    <p className="text-sm font-bold text-white">配送のご依頼・その他</p>
                    <p className="mt-2 text-xs leading-6 text-white/60">
                      Instagramのダイレクトメッセージにて承っています。
                    </p>
                    <ButtonLink
                      href={socialLinks.instagram}
                      variant="outlineLight"
                      external
                      className="mt-4 w-full"
                      ariaLabel="Instagramのダイレクトメッセージで問い合わせる"
                    >
                      Instagram @jungle.hyougo
                    </ButtonLink>
                  </div>

                  {socialLinks.tel && (
                    <div className="border-l-2 border-white/30 pl-5">
                      <p className="text-sm font-bold text-white">お電話</p>
                      <a
                        href={`tel:${socialLinks.tel.replace(/-/g, '')}`}
                        className="mt-2 inline-block text-lg font-bold text-jungle"
                      >
                        {socialLinks.tel}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
                <TextLink href="/about">JUNGLEについて</TextLink>
                <TextLink href="/service">事業内容</TextLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* -------------------------------- 事業一覧 ------------------------------- */}
      <Section tone="mist" spacing="tight">
        <Container>
          <SectionHeading eyebrow="Business" title="事業内容" />
          <ul className="rule-list mt-10 border-t border-line">
            {services.map((service) => (
              <li key={service.id} className="grid gap-2 py-6 sm:grid-cols-[13rem_1fr] sm:gap-10">
                <span className="text-sm font-bold text-ink">{service.name}</span>
                <span className="text-sm leading-7 text-body">{service.description}</span>
              </li>
            ))}
          </ul>
          <TextLink href="/service" className="mt-9">
            事業内容を詳しく見る
          </TextLink>
        </Container>
      </Section>

      {/* --------------------------- 確認中の情報（運用向け） --------------------------- */}
      <Section tone="white" spacing="tight">
        <Container size="narrow">
          <SectionHeading
            eyebrow="In Preparation"
            title="現在、公開準備中の情報"
            lead="以下の項目は、公開できる情報として確認が取れ次第このページに掲載します。"
          />
          <ul className="mt-9 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {companyTodos().map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-7 text-body/75">
                <span aria-hidden="true" className="mt-3 h-1 w-3 shrink-0 bg-line" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
