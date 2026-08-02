import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, SectionHeading, ButtonLink, TextLink, NumberMark } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FaqList } from '@/components/ui/FaqList';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, faqPageJsonLd, type Crumb } from '@/lib/jsonld';
import { imagePaths } from '@/lib/images';
import { openJobs } from '@/data/jobs';
import { faqsByIds } from '@/data/faq';
import { applicationSteps, workFeatures } from '@/data/process';
import { columns } from '@/data/columns';

export const metadata: Metadata = buildMetadata({
  title: '兵庫県の軽貨物ドライバー求人',
  description:
    '兵庫県明石市・神戸市西部エリアで軽貨物ドライバーを募集しています。業務委託契約、未経験可、車両リースあり、日当保証あり。仕事内容と応募方法をご確認ください。',
  path: '/recruit',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '採用情報', href: '/recruit' },
];

const recruitFaqIds = ['beginner-ok', 'vehicle-license', 'vehicle-lease', 'money-contract', 'work-area', 'apply-how'];

export default function RecruitPage() {
  const jobs = openJobs();
  const faqItems = faqsByIds(recruitFaqIds);
  const relatedColumns = columns.slice(0, 4);

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqPageJsonLd(faqItems)]} />

      <PageHero
        eyebrow="Recruit"
        title={
          <>
            兵庫県の軽貨物ドライバー求人。
            <br />
            JUNGLEから始める。
          </>
        }
        lead="事業拡大にともない、明石・神戸西エリアで走る軽貨物ドライバーを募集しています。普通自動車運転免許があれば、配送の実務経験がない方も応募いただけます。"
        image={imagePaths.driver03}
        imageAlt="夕暮れの住宅街で配送を終えたJUNGLEの軽貨物ドライバー"
      />
      <Breadcrumbs crumbs={crumbs} />

      {/* ------------------------------ 募集条件の要点 ----------------------------- */}
      <Section tone="jungle" spacing="tight">
        <Container>
          <h2 className="sr-only">募集条件の要点</h2>
          <dl className="grid gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: '契約形態', value: '業務委託', note: '個人事業主としての契約' },
              { label: '募集エリア', value: '明石・神戸西', note: '兵庫県内が中心' },
              { label: '必要な免許', value: '普通免許', note: '大型・二種は不要' },
              { label: '配送経験', value: '不問', note: '未経験の方も応募可' },
            ].map((item) => (
              <div key={item.label} className="bg-jungle p-7">
                <dt className="text-xs font-bold text-ink/60">{item.label}</dt>
                <dd className="mt-3 text-xl leading-tight font-bold text-ink sm:text-2xl">
                  {item.value}
                  <span className="mt-2 block text-xs font-normal text-ink/70">{item.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* -------------------------------- 募集中の求人 ------------------------------- */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Open Positions"
            title="募集中の求人"
            lead="現在募集している求人のみを掲載しています。詳細な条件は各求人ページでご確認ください。"
          />
          <ul className="rule-list mt-12 border-t-2 border-ink">
            {jobs.map((job) => (
              <li key={job.slug}>
                <Link
                  href={`/jobs/${job.slug}`}
                  className="group flex flex-col gap-5 py-9 transition-colors hover:bg-mist sm:flex-row sm:items-center sm:gap-10"
                >
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="bg-jungle px-3 py-1.5 text-xs font-bold text-ink">募集中</span>
                    <span className="text-xs font-bold text-body/60">{job.contractLabel}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg leading-relaxed font-bold text-ink sm:text-xl">{job.title}</h3>
                    <p className="mt-2.5 text-sm leading-7 text-body">{job.summary}</p>
                    <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-body/70">
                      <span>募集地域：{job.areas.join('／')}</span>
                      {job.salary && <span>報酬例：{job.salary.headline}</span>}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl text-ink transition-transform duration-200 group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------- 働く特徴 ------------------------------- */}
      <Section tone="mist">
        <Container>
          <SectionHeading
            eyebrow="Why JUNGLE"
            title="JUNGLEで働く6つの特徴"
            lead="実際にご用意している内容のみを挙げています。確認できていない条件は掲載していません。"
          />
          <div className="mt-16 grid gap-x-14 sm:grid-cols-2 lg:grid-cols-3">
            {workFeatures.map((feature) => (
              <div key={feature.number} className="border-t-2 border-ink/10 py-9">
                <NumberMark value={feature.number} />
                <h3 className="mt-4 text-lg leading-relaxed font-bold text-ink">{feature.title}</h3>
                <p className="mt-4 text-sm leading-7 text-body">{feature.description}</p>
                <TextLink href={feature.href} className="mt-5">
                  {feature.linkLabel}
                </TextLink>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------ 知りたいこと別導線 ----------------------------- */}
      <Section tone="ink">
        <Container>
          <SectionHeading
            eyebrow="Guide"
            tone="light"
            title="知りたいことから読む"
            lead="応募を検討する段階で気になる点を、ページごとにまとめています。"
          />
          <ul className="mt-14 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: '/work', label: '仕事内容', body: '何を、どこへ、どのように運ぶのか。使用する車両と担当エリアについて。' },
              { href: '/beginner', label: '未経験の方へ', body: '必要な免許、研修の進め方、車両の用意まで、始めるまでの流れ。' },
              { href: '/daily-flow', label: '1日の流れ', body: '車両点検から配達完了まで、稼働日の業務の進み方。' },
              { href: '/faq', label: 'よくある質問', body: '報酬・契約・車両・応募方法について、いただく質問と回答。' },
            ].map((item) => (
              <li key={item.href} className="bg-ink">
                <Link href={item.href} className="group flex h-full flex-col p-8 transition-colors hover:bg-white/5">
                  <h3 className="text-lg font-bold text-white">{item.label}</h3>
                  <p className="mt-4 flex-1 text-sm leading-7 text-white/65">{item.body}</p>
                  <span className="mt-7 text-sm font-bold text-jungle">
                    <span className="border-b-2 border-jungle pb-0.5">詳しく見る</span>
                    <span aria-hidden="true" className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* --------------------------- 応募から稼働開始まで --------------------------- */}
      <Section tone="white">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Flow"
                title="応募から稼働開始まで"
                lead="各段階に要する日数は、ご本人の準備状況や案件の状況によって変わります。目安は面談時にお伝えします。"
              />
              <Photo
                src={imagePaths.training02}
                alt="稼働開始前に配送業務の進め方を確認するJUNGLEのスタッフ"
                fallbackLabel="TRAINING"
                className="mt-10 hidden aspect-4/3 w-full lg:block"
                sizes="(min-width: 1024px) 30vw, 100vw"
              />
            </div>
            <ol className="rule-list border-t-2 border-ink">
              {applicationSteps.map((step, index) => (
                <li key={step.title} className="flex gap-6 py-7 sm:gap-10">
                  <span className="display shrink-0 text-3xl leading-none text-jungle-deep sm:text-4xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-ink sm:text-lg">{step.title}</h3>
                    <p className="mt-2.5 text-sm leading-7 text-body">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* -------------------------------- FAQ -------------------------------- */}
      <Section tone="mist">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="FAQ" title="よくある質問" />
              <TextLink href="/faq" className="mt-8">
                すべての質問を見る
              </TextLink>
            </div>
            <div className="border-t border-line">
              <FaqList items={faqItems} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------- コラム ------------------------------- */}
      <Section tone="white" spacing="tight">
        <Container>
          <SectionHeading eyebrow="Columns" title="応募前に読んでおきたい記事" />
          <ul className="rule-list mt-10 border-t border-line">
            {relatedColumns.map((column) => (
              <li key={column.slug}>
                <Link href={`/columns/${column.slug}`} className="group flex items-center gap-6 py-6">
                  <span className="w-24 shrink-0 text-xs font-bold tracking-[0.06em] text-jungle-deep">
                    {column.category}
                  </span>
                  <span className="flex-1 text-sm leading-7 font-bold text-ink sm:text-base">{column.title}</span>
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
          <TextLink href="/columns" className="mt-9">
            採用コラム一覧
          </TextLink>
        </Container>
      </Section>

      <Section tone="mist" spacing="tight">
        <Container>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-7 text-body">
              募集条件の掲載・更新については、当サイトの方針を公開しています。
            </p>
            <ButtonLink href="/job-policy" variant="outline">
              求人情報掲載・更新方針
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
