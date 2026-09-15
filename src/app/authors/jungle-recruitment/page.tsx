import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, SectionHeading, TextLink, NoteBlock } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, personJsonLd, webPageJsonLd, type Crumb } from '@/lib/structured-data';
import { formatJapaneseDate } from '@/lib/format';
import { imagePaths } from '@/lib/images';
import { columnAuthor, columns } from '@/data/columns';
import { company, show } from '@/data/company';

export const metadata: Metadata = buildMetadata({
  title: '運営者情報｜JUNGLE TRANSPORT 採用担当',
  description:
    '当サイトの採用コラムを執筆・確認しているJUNGLE TRANSPORT採用担当の情報です。記事の作成方針、事実確認の方法、掲載している情報の範囲について記載しています。',
  path: '/authors/jungle-recruitment',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '運営者情報', href: '/authors/jungle-recruitment' },
];

const policies = [
  {
    title: '確認できた事実だけをJUNGLEの条件として書く',
    body: 'JUNGLE TRANSPORTの募集条件として断定してよいのは、社内で確認が取れた事実のみです。報酬の計算方法や稼働時間など、案件によって変わる条件は「面談時にご確認ください」と明記し、推測で埋めることはしません。',
  },
  {
    title: '一般論と自社の条件を分けて書く',
    body: '軽貨物配送の業界全体の仕組みと、JUNGLEの募集条件は別のものです。記事中でどちらの話をしているかが分かるように書き分けています。',
  },
  {
    title: '応募者から実際にいただく質問を起点にする',
    body: '検索キーワードだけを狙って記事を量産することはしません。面談や問い合わせで実際にいただく質問と、応募を判断するうえで必要な情報を起点にテーマを決めています。',
  },
  {
    title: '更新日は内容を修正したときだけ変更する',
    body: '記事の日付だけを機械的に更新することはしません。掲載内容を実際に見直した場合にのみ、更新日を変更しています。',
  },
  {
    title: '報酬額は必ず根拠とあわせて示す',
    body: '「月収◯◯万円可能」といった金額を示す場合は、その前提と注意書きを必ず併記します。手取り額を保証するものではないことを明記しています。',
  },
];

export default function AuthorPage() {
  const sorted = [...columns].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          personJsonLd(),
          webPageJsonLd({
            name: '運営者情報｜JUNGLE TRANSPORT 採用担当',
            description:
              '当サイトの採用コラムを執筆・確認している担当者の情報と、記事の作成方針を記載しています。',
            path: '/authors/jungle-recruitment',
            updatedAt: '2026-08-02',
          }),
        ]}
      />

      <PageHero
        eyebrow="Author"
        title="運営者情報"
        lead="当サイトの採用コラムを執筆・確認している担当者と、記事の作成方針についてご説明します。"
        image={imagePaths.briefing}
        imageAlt="配送業務の内容を書類で確認するJUNGLE TRANSPORTのスタッフ"
      />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
            <div className="space-y-16">
              {/* プロフィール */}
              <section>
                <SectionHeading eyebrow="Profile" title={columnAuthor.name} as="h2" />
                <dl className="rule-list mt-8 border-t-2 border-ink">
                  {[
                    ['担当', columnAuthor.role],
                    ['所属', `${show(company.brandName) ?? 'JUNGLE TRANSPORT'}（正式名称：${show(company.legalName) ?? 'JUNGLE'}）`],
                    ['担当業務', 'ドライバー採用に関する募集条件の整理、面談、応募者からの問い合わせ対応'],
                    ['執筆内容', '軽貨物ドライバーを目指す方に向けた採用コラム、および求人・採用ガイドページ'],
                    ['記事の確認者', columnAuthor.reviewedBy],
                    ['稼働エリア', show(company.serviceArea) ?? '兵庫県明石市・神戸市西区'],
                  ].map(([label, value]) => (
                    <div key={label} className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-8">
                      <dt className="text-sm font-bold text-ink">{label}</dt>
                      <dd className="text-sm leading-7 text-body">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-8 text-[0.9375rem] leading-8 text-body">{columnAuthor.description}</p>
              </section>

              {/* 記事制作方針 */}
              <section>
                <SectionHeading
                  eyebrow="Editorial Policy"
                  title="記事の作成方針"
                  as="h2"
                  lead="応募を判断する材料として使えることを最優先に、以下の方針で記事を作成しています。"
                />
                <ol className="rule-list mt-10 border-t-2 border-ink">
                  {policies.map((policy, index) => (
                    <li key={policy.title} className="grid gap-4 py-8 sm:grid-cols-[4rem_1fr] sm:gap-8">
                      <span className="display text-3xl leading-none text-jungle-deep" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-lg leading-relaxed font-bold text-ink">{policy.title}</h3>
                        <p className="mt-3 text-sm leading-8 text-body">{policy.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* 情報の確認方法 */}
              <section>
                <SectionHeading eyebrow="Fact Checking" title="情報の確認方法" as="h2" />
                <div className="prose-jungle mt-8 text-[0.9375rem]">
                  <p>
                    JUNGLE TRANSPORTの募集条件・事業内容として掲載している情報は、社内で確認が取れたものに限っています。所在地や届出番号など、公開できる形での確認が済んでいない項目は、推測で記載せず「確認中」として扱っています。
                  </p>
                  <p>
                    軽貨物配送の一般的な仕組み（必要な免許、事業用登録の手続き、業務委託契約の性質など）については、制度として定められている内容にもとづいて記載しています。制度は改正されることがあるため、実際の手続きの際は必ず最新の情報をご確認ください。
                  </p>
                </div>
                <NoteBlock title="掲載内容に誤りを見つけられた場合">
                  当サイトの記載内容に誤りや古い情報を見つけられた場合は、応募フォームのご相談欄、またはお電話にてご連絡いただけますと幸いです。確認のうえ修正します。
                </NoteBlock>
              </section>

              {/* 執筆記事一覧 */}
              <section>
                <SectionHeading eyebrow="Articles" title="執筆した記事" as="h2" />
                <ul className="rule-list mt-8 border-t-2 border-ink">
                  {sorted.map((column) => (
                    <li key={column.slug}>
                      <Link href={`/columns/${column.slug}`} className="group block py-5">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-body/60">
                          <span className="font-bold text-jungle-deep">{column.category}</span>
                          <time dateTime={column.publishedAt}>
                            公開 {formatJapaneseDate(column.publishedAt)}
                          </time>
                          <time dateTime={column.updatedAt}>更新 {formatJapaneseDate(column.updatedAt)}</time>
                        </div>
                        <p className="mt-2 text-sm leading-7 font-bold text-ink group-hover:text-jungle-deep">
                          {column.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="bg-ink p-8">
                <p className="display text-xs tracking-[0.22em] text-jungle">Company</p>
                <h2 className="mt-4 text-lg leading-relaxed font-bold text-white">JUNGLE TRANSPORTについて</h2>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  兵庫県明石市・神戸市西区を中心に軽貨物配送を行っています。会社の基本情報と、事業への考え方は以下のページをご覧ください。
                </p>
                <div className="mt-6 flex flex-col gap-3.5">
                  <Link
                    href="/company"
                    className="text-sm font-bold text-white underline decoration-jungle decoration-2 underline-offset-4"
                  >
                    会社概要を見る
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm font-bold text-white underline decoration-jungle decoration-2 underline-offset-4"
                  >
                    JUNGLEについて
                  </Link>
                </div>
              </div>

              <nav aria-label="関連ページ" className="mt-8 flex flex-col gap-3.5">
                <TextLink href="/columns">採用コラム一覧を見る</TextLink>
                <TextLink href="/job-policy">求人情報掲載・更新方針を見る</TextLink>
                <TextLink href="/privacy">プライバシーポリシーを見る</TextLink>
              </nav>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
