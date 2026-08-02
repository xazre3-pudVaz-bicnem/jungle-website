import Link from 'next/link';
import type { Metadata } from 'next';
import { Container, Section, SectionHeading, ButtonLink, TextLink, NumberMark } from '@/components/ui/Primitives';
import { Photo } from '@/components/ui/Photo';
import { FaqList } from '@/components/ui/FaqList';
import { EntryCta } from '@/components/sections/EntryCta';
import { JsonLd } from '@/components/ui/JsonLd';
import { imagePaths } from '@/lib/images';
import { buildMetadata } from '@/lib/seo';
import { faqPageJsonLd } from '@/lib/jsonld';
import { faqsByIds } from '@/data/faq';
import { openJobs } from '@/data/jobs';
import { columns } from '@/data/columns';
import { applicationSteps, dailyFlowSteps, workFeatures } from '@/data/process';
import { companyProfileRows } from '@/data/company';

export const metadata: Metadata = buildMetadata({
  // ルートページには layout の title.template が適用されないため、サイト名まで明記します
  title: '兵庫・明石の軽貨物配送｜JUNGLE',
  description:
    '兵庫県明石市・神戸市西部エリアで宅配および企業配送を行う軽貨物配送のJUNGLE。事業拡大にともない軽貨物ドライバーを募集しています。未経験の方もご相談ください。',
  path: '/',
});

const topFaqIds = ['beginner-ok', 'vehicle-lease', 'money-contract', 'work-area', 'apply-how'];

export default function HomePage() {
  const jobs = openJobs();
  const faqItems = faqsByIds(topFaqIds);
  const latestColumns = columns.slice(0, 3);
  const businessRow = companyProfileRows.find((row) => row.label === '事業内容');

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqItems)} />

      {/* ------------------------------- ヒーロー ------------------------------- */}
      <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-ink">
        {/*
          Photo は内部で position: relative を持つため、absolute は外側のラッパーで指定します。
          Photo に直接 absolute を渡すと position 指定が衝突し、高さが 0 になります。
        */}
        <div className="absolute inset-0">
          <Photo
            src={imagePaths.hero}
            alt="明石海峡大橋を背に、軽バンの前に立つJUNGLEの配送ドライバー"
            fallbackLabel="JUNGLE TRANSPORT"
            className="h-full w-full"
            priority
            sizes="100vw"
            overlay="strong"
          />
        </div>
        {/* 下端の可読性を確保する暗幕 */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/70 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-y-0 left-0 w-1.5 bg-jungle sm:w-2" aria-hidden="true" />

        <Container size="wide" className="relative z-10 pt-32 pb-20 sm:pb-28">
          <p className="display text-xs tracking-[0.3em] text-jungle sm:text-sm">
            Light Cargo Delivery / Hyogo · Akashi
          </p>

          <h1 className="mt-7 text-[2.5rem] leading-[1.12] font-bold text-white sm:text-[4.5rem] lg:text-[5.75rem]">
            兵庫の街を、
            <br />
            走る。
          </h1>

          <p className="mt-8 max-w-2xl text-[0.9375rem] leading-8 text-white/80 sm:text-base">
            JUNGLEは、兵庫県明石市・神戸市西部エリアで軽貨物配送を行っています。個人宅への宅配から企業配送まで、地域の「運ぶ」を担う仕事です。事業拡大にともない、一緒に走る軽貨物ドライバーを募集しています。未経験の方もご相談ください。
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <ButtonLink href="/recruit" variant="primary" className="text-base">
              軽貨物ドライバー募集要項
            </ButtonLink>
            <TextLink href="/service" tone="light">
              事業内容を見る
            </TextLink>
          </div>
        </Container>
      </section>

      {/* ---------------------------- JUNGLEの紹介 ---------------------------- */}
      <Section tone="white" spacing="loose">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
            <div className="relative">
              <Photo
                src={imagePaths.driver02}
                alt="配送先で端末を操作するJUNGLEのドライバーと軽バン"
                fallbackLabel="OUR VAN"
                className="aspect-4/5 w-full"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              {/* 写真の一部を枠外へはみ出させる */}
              <div className="absolute -right-4 -bottom-8 bg-jungle px-6 py-5 sm:-right-8 sm:px-8">
                <p className="display text-3xl leading-none text-ink sm:text-4xl">HYOGO</p>
                <p className="mt-1.5 text-xs font-bold text-ink/70">明石・神戸西エリア</p>
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="About JUNGLE"
                title={
                  <>
                    運ぶ仕事を、
                    <br />
                    <span className="marker">もっと自由に。</span>
                  </>
                }
              />
              <div className="prose-jungle mt-8 text-[0.9375rem]">
                <p>
                  JUNGLEは兵庫エリアを拠点に、軽貨物配送を中心とした事業を行っています。通販商品を個人宅へ届ける宅配と、企業や事業所の間を結ぶ企業配送。どちらも、地域の生活と仕事を支える仕事です。
                </p>
                <p>
                  配送以外にも、不動産関連の業務、引越し、遺品回収などに取り組んできました。「運ぶ」ことを軸に、地域の困りごとに幅広く応えてきたことが、いまの事業の広がりにつながっています。
                </p>
                <p>
                  ドライバーは一人で車を走らせる時間が長い仕事です。だからこそ、始めるときの不安をできるだけ小さくしたい。車両リースや日当保証、同乗研修を用意しているのはそのためです。
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
                <TextLink href="/about">JUNGLEについて</TextLink>
                <TextLink href="/service">事業内容</TextLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* -------------------------- 現在募集中の求人概要 -------------------------- */}
      <Section tone="jungle" spacing="tight">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
            <div>
              <p className="display text-xs tracking-[0.28em] text-ink/60">Now Hiring</p>
              <p className="mt-3 flex items-baseline gap-3">
                <span className="display text-7xl leading-none text-ink sm:text-8xl">
                  {String(jobs.length).padStart(2, '0')}
                </span>
                <span className="text-sm font-bold text-ink/70">件の求人を募集中</span>
              </p>
            </div>
            <div className="border-t-2 border-ink/20 pt-8 lg:border-t-0 lg:border-l-2 lg:pt-0 lg:pl-16">
              <h2 className="text-xl leading-relaxed font-bold text-ink sm:text-2xl">
                明石・神戸西エリアで走る軽貨物ドライバーを募集しています
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/80">
                契約形態は業務委託です。普通自動車運転免許があれば、配送の実務経験がない方も応募いただけます。車両リース・日当保証・同乗研修をご用意しています。
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/jobs" variant="ink">
                  求人一覧を見る
                </ButtonLink>
                <ButtonLink href="/recruit" variant="outline">
                  採用情報トップ
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------- JUNGLEで働く特徴 --------------------------- */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Why JUNGLE"
            title="JUNGLEで働く6つの特徴"
            lead="求人サイトに並ぶ条件のうち、JUNGLEが実際にご用意しているものだけを挙げています。確認できていない条件は掲載していません。"
          />

          <div className="mt-16 grid gap-x-14 gap-y-0 sm:grid-cols-2">
            {workFeatures.map((feature) => (
              <div key={feature.number} className="border-t-2 border-ink/10 py-9">
                <NumberMark value={feature.number} />
                <h3 className="mt-4 text-lg leading-relaxed font-bold text-ink sm:text-xl">{feature.title}</h3>
                <p className="mt-4 text-sm leading-7 text-body">{feature.description}</p>
                <TextLink href={feature.href} className="mt-5">
                  {feature.linkLabel}
                </TextLink>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* -------------------------------- 仕事内容 ------------------------------- */}
      <Section tone="ink" spacing="loose" className="relative overflow-hidden">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Work"
                tone="light"
                title={
                  <>
                    軽自動車で、
                    <br />
                    地域の荷物を届ける。
                  </>
                }
              />
              <div className="mt-9 space-y-8">
                <div className="border-l-2 border-jungle pl-6">
                  <h3 className="text-lg font-bold text-white">宅配｜個人宅へ届ける</h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    通販で購入された商品などをご自宅へお届けします。1日に回る件数は多いものの、扱うのは軽自動車に積めるサイズの荷物が中心です。
                  </p>
                </div>
                <div className="border-l-2 border-jungle pl-6">
                  <h3 className="text-lg font-bold text-white">企業配送｜事業所間を結ぶ</h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    企業や店舗、事業所の間で荷物を運びます。決まった時間に決まった場所を回る案件が多く、時間管理の正確さが求められます。
                  </p>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
                <TextLink href="/work" tone="light">
                  仕事内容を詳しく見る
                </TextLink>
                <TextLink href="/daily-flow" tone="light">
                  1日の流れ
                </TextLink>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Photo
                src={imagePaths.loading01}
                alt="配送前に軽バンへ荷物を積み込む様子"
                fallbackLabel="LOADING"
                className="col-span-2 aspect-16/10 w-full"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              <Photo
                src={imagePaths.driver01}
                alt="配達先へ荷物を届けるJUNGLEのドライバー"
                fallbackLabel="DRIVER"
                className="aspect-square w-full"
                sizes="(min-width: 1024px) 20vw, 50vw"
              />
              <Photo
                src={imagePaths.van02}
                alt="明石エリアの配送ルートを走行する軽貨物車両"
                fallbackLabel="ROUTE"
                className="aspect-square w-full"
                sizes="(min-width: 1024px) 20vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------ 報酬・働き方 ------------------------------ */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Reward"
            title="報酬と働き方"
            lead="金額だけを大きく見せることはしません。前提と注意点をあわせてお伝えしたうえで、面談で具体的な数字をご説明します。"
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div className="border-t-4 border-ink pt-8">
              <p className="text-sm font-bold text-body/60">報酬例</p>
              <p className="mt-4 text-[2rem] leading-tight font-bold text-ink sm:text-[2.75rem]">
                未経験でも
                <span className="marker">月収30万円〜可能</span>
              </p>
              <ul className="mt-8 space-y-3.5 text-sm leading-7 text-body">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-4 shrink-0 bg-jungle" />
                  日当保証があるため、稼働の初期段階から一定の報酬が確保されます
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-4 shrink-0 bg-jungle" />
                  契約形態は業務委託です。雇用契約ではありません
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-4 shrink-0 bg-jungle" />
                  報酬の計算方法・日当保証の金額は、面談時に具体的にご説明します
                </li>
              </ul>
              <p className="mt-8 border-l-4 border-line pl-5 text-xs leading-6 text-body/70">
                上記は報酬例であり、実際の報酬や手取り額を保証するものではありません。契約内容、稼働日数、案件、必要経費などにより異なります。
              </p>
            </div>

            <div className="bg-mist p-8 sm:p-10">
              <h3 className="text-lg font-bold text-ink">働き方について</h3>
              <dl className="mt-7 space-y-6 text-sm">
                <div>
                  <dt className="font-bold text-ink">契約形態</dt>
                  <dd className="mt-1.5 leading-7 text-body">業務委託（個人事業主としての契約）</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">車両</dt>
                  <dd className="mt-1.5 leading-7 text-body">
                    リース制度あり。お持ちの車両の持ち込みもご相談いただけます
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">勤務時間・稼働日数</dt>
                  <dd className="mt-1.5 leading-7 text-body">
                    案件によって異なるため、確認できている条件のみを求人ページに掲載しています。詳細は面談時にご確認ください
                  </dd>
                </div>
              </dl>
              <TextLink href="/columns/driver-income-and-expenses" className="mt-8">
                報酬と必要経費の考え方
              </TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------- 未経験者向けサポート ---------------------------- */}
      <Section tone="mist">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-20">
            <Photo
              src={imagePaths.training01}
              alt="先輩ドライバーが未経験のスタッフへ配送の進め方を説明する様子"
              fallbackLabel="TRAINING"
              className="aspect-5/4 w-full"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
            <div>
              <SectionHeading
                eyebrow="For Beginners"
                title="はじめての配送でも、
一人にはしません。"
              />
              <p className="mt-7 text-[0.9375rem] leading-8 text-body">
                必要なのは普通自動車運転免許だけです。荷物の積み方、効率のよい回り方、不在時の対応。現場でしか身につかないことは、同乗研修のなかで覚えていけます。
              </p>
              <ul className="rule-list mt-9 border-t border-line">
                {[
                  ['必要な免許', '普通自動車運転免許のみ。大型・二種免許は不要です'],
                  ['配送経験', '不問。実際に未経験からスタートしている方もいます'],
                  ['研修', '同乗研修などのサポート体制をご用意しています'],
                  ['車両', 'お持ちでない方はリースをご相談いただけます'],
                ].map(([label, value]) => (
                  <li key={label} className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                    <span className="w-32 shrink-0 text-sm font-bold text-ink">{label}</span>
                    <span className="text-sm leading-7 text-body">{value}</span>
                  </li>
                ))}
              </ul>
              <TextLink href="/beginner" className="mt-9">
                未経験の方へ
              </TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------- 1日の流れ ------------------------------ */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="One Day"
            title="1日の流れ"
            lead="開始時刻や終了時刻は担当する案件によって異なるため、確認できている業務の流れのみを掲載しています。"
          />
          <ol className="mt-14 grid gap-x-12 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
            {dailyFlowSteps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-ink/10 py-8">
                <NumberMark value={index + 1} />
                <h3 className="mt-3 text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-body">{step.description}</p>
              </li>
            ))}
          </ol>
          <TextLink href="/daily-flow" className="mt-10">
            1日の流れを詳しく見る
          </TextLink>
        </Container>
      </Section>

      {/* -------------------------------- 募集地域 ------------------------------- */}
      <Section tone="ink" spacing="tight">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <SectionHeading eyebrow="Area" tone="light" title="募集地域" />
            <div>
              <div className="flex flex-wrap gap-3">
                {['兵庫県明石市', '兵庫県神戸市西区', '兵庫県神戸市垂水区'].map((area) => (
                  <span
                    key={area}
                    className="border border-white/25 px-5 py-2.5 text-sm font-bold text-white"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="mt-8 max-w-2xl text-sm leading-8 text-white/70">
                配送エリアは明石エリアおよび神戸西エリアが中心です。上記エリア外にお住まいの方でも、通勤が可能であればご相談いただけます。担当エリアが兵庫県内に集約されているため、長距離の移動が続くことはありません。
              </p>
              <TextLink href="/columns/working-in-akashi" tone="light" className="mt-8">
                明石市で働く特徴を読む
              </TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* -------------------------------- 求人一覧 ------------------------------- */}
      <Section tone="white">
        <Container>
          <SectionHeading eyebrow="Jobs" title="募集中の求人" lead="現在募集している求人のみを掲載しています。" />
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
          <TextLink href="/jobs" className="mt-10">
            求人一覧ページへ
          </TextLink>
        </Container>
      </Section>

      {/* --------------------------- 応募から稼働開始まで --------------------------- */}
      <Section tone="mist">
        <Container>
          <SectionHeading
            eyebrow="Flow"
            title="応募から稼働開始まで"
            lead="各段階に要する日数は、ご本人の準備状況や案件の状況によって変わります。目安は面談時にお伝えします。"
          />
          <ol className="mt-14 rule-list border-t-2 border-ink">
            {applicationSteps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-4 py-8 sm:flex-row sm:gap-10">
                <span className="display shrink-0 text-3xl leading-none text-jungle-deep sm:w-20 sm:text-4xl">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2.5 max-w-3xl text-sm leading-7 text-body">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ------------------------------ よくある質問 ------------------------------ */}
      <Section tone="white">
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

      {/* ------------------------------- 採用コラム ------------------------------- */}
      <Section tone="mist">
        <Container>
          <SectionHeading
            eyebrow="Columns"
            title="採用コラム"
            lead="軽貨物ドライバーという仕事について、応募を検討する段階で知っておきたいことをまとめています。"
          />
          <ul className="mt-12 grid gap-px bg-line sm:grid-cols-3">
            {latestColumns.map((column) => (
              <li key={column.slug} className="bg-mist">
                <Link href={`/columns/${column.slug}`} className="group flex h-full flex-col p-7 transition-colors hover:bg-white">
                  <span className="text-xs font-bold tracking-[0.06em] text-jungle-deep">{column.category}</span>
                  <h3 className="mt-4 text-base leading-relaxed font-bold text-ink">{column.title}</h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-body">{column.description}</p>
                  <span className="mt-6 text-sm font-bold text-ink">
                    <span className="border-b-2 border-jungle pb-0.5">記事を読む</span>
                    <span aria-hidden="true" className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <TextLink href="/columns" className="mt-10">
            コラム一覧を見る
          </TextLink>
        </Container>
      </Section>

      {/* -------------------------------- 会社情報 ------------------------------- */}
      <Section tone="white">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="Company" title="会社情報" />
              <dl className="rule-list mt-10 border-t border-line">
                <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                  <dt className="w-36 shrink-0 text-sm font-bold text-ink">名称</dt>
                  <dd className="text-sm leading-7 text-body">JUNGLE TRANSPORT</dd>
                </div>
                <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                  <dt className="w-36 shrink-0 text-sm font-bold text-ink">主な稼働エリア</dt>
                  <dd className="text-sm leading-7 text-body">兵庫県（明石市・神戸市西部を中心に）</dd>
                </div>
                {businessRow?.value && (
                  <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                    <dt className="w-36 shrink-0 text-sm font-bold text-ink">事業内容</dt>
                    <dd className="text-sm leading-7 text-body">{businessRow.value}</dd>
                  </div>
                )}
                <div className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-8">
                  <dt className="w-36 shrink-0 text-sm font-bold text-ink">お問い合わせ</dt>
                  <dd className="text-sm leading-7 text-body">
                    Instagramダイレクトメッセージ／当サイトの応募フォーム
                  </dd>
                </div>
              </dl>
              <TextLink href="/company" className="mt-9">
                会社概要を見る
              </TextLink>
            </div>

            <div className="relative">
              <Photo
                src={imagePaths.team01}
                alt="JUNGLEで稼働するドライバーたち"
                fallbackLabel="TEAM"
                className="aspect-4/3 w-full"
                sizes="(min-width: 1024px) 38vw, 100vw"
              />
              <div className="mt-6 border-l-4 border-jungle bg-mist px-6 py-6">
                <p className="text-sm font-bold text-ink">法人・事業者のお客様へ</p>
                <p className="mt-2.5 text-sm leading-7 text-body">
                  配送業務のご依頼・ご相談も承っています。ドライバー応募とは窓口が異なりますので、事業内容ページよりご確認ください。
                </p>
                <TextLink href="/service" className="mt-5">
                  配送のご相談について
                </TextLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* -------------------------------- 応募CTA ------------------------------- */}
      <EntryCta />
    </>
  );
}
