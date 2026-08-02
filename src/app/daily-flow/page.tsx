import type { Metadata } from 'next';
import { Container, Section, SectionHeading, TextLink, NoteBlock } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, type Crumb } from '@/lib/jsonld';
import { imagePaths } from '@/lib/images';
import { dailyFlowSteps } from '@/data/process';

export const metadata: Metadata = buildMetadata({
  title: '1日の流れ｜軽貨物ドライバーの稼働日',
  description:
    'JUNGLEの軽貨物ドライバーの1日の流れをご紹介します。車両点検から荷物の積み込み、順路の組み立て、配達、完了処理まで、稼働日の業務の進み方をまとめました。',
  path: '/daily-flow',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '1日の流れ', href: '/daily-flow' },
];

export default function DailyFlowPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="One Day"
        title="ある1日の流れ"
        lead="稼働日の業務が、どのような順番で進んでいくのかをご紹介します。開始時刻や終了時刻は担当する案件によって異なるため、業務の流れのみを掲載しています。"
        image={imagePaths.vanAkashi}
        imageAlt="明石海峡大橋を望む場所で稼働の準備をするJUNGLEのドライバー"
      />
      <Breadcrumbs crumbs={crumbs} />

      {/* -------------------------------- 前提 -------------------------------- */}
      <Section tone="white" spacing="tight">
        <Container size="narrow">
          <NoteBlock title="時刻を掲載していない理由">
            軽貨物配送は、担当する案件によって稼働の開始時刻・終了時刻・1日の件数が大きく異なります。JUNGLEでは、確認が取れていない条件を推測で掲載することは行っていません。実際の稼働時間については、面談時に担当いただく案件にもとづいて具体的にお伝えします。
          </NoteBlock>
        </Container>
      </Section>

      {/* ------------------------------ 1日の流れ ------------------------------ */}
      <Section tone="white" spacing="tight">
        <Container>
          <SectionHeading eyebrow="Flow" title="稼働日の進み方" />

          <ol className="mt-14">
            {dailyFlowSteps.map((step, index) => (
              <li key={step.title} className="relative grid gap-6 border-t-2 border-ink/10 py-10 lg:grid-cols-[7rem_1fr_1fr] lg:gap-12">
                <div>
                  <span className="display block text-5xl leading-none text-jungle-deep sm:text-6xl" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {step.time && <span className="mt-2 block text-sm font-bold text-body/60">{step.time}</span>}
                </div>

                <div>
                  <h2 className="text-xl leading-relaxed font-bold text-ink sm:text-2xl">{step.title}</h2>
                  <p className="mt-4 text-sm leading-8 text-body">{step.description}</p>
                </div>

                {/* 3ステップごとに写真を差し込み、リズムをつける */}
                {index % 3 === 0 ? (
                  <Photo
                    src={index === 0 ? imagePaths.van02 : imagePaths.driver01}
                    alt={
                      index === 0
                        ? '出発前の点検を終えて走り出すJUNGLEの軽貨物車両'
                        : '配達先の玄関で荷物をお届けするJUNGLEのドライバー'
                    }
                    fallbackLabel={index === 0 ? 'CHECK' : 'DELIVER'}
                    className="aspect-16/10 w-full lg:aspect-4/3"
                    sizes="(min-width: 1024px) 30vw, 100vw"
                  />
                ) : (
                  <div aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ------------------------------ 慣れるまで ------------------------------ */}
      <Section tone="ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <SectionHeading
              eyebrow="Getting Used To It"
              tone="light"
              title={
                <>
                  最初の数週間は、
                  <br />
                  時間がかかって当然です。
                </>
              }
            />
            <div className="space-y-8">
              <div className="border-l-2 border-jungle pl-6">
                <h3 className="text-lg font-bold text-white">1週目｜同乗研修</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  先輩ドライバーに同乗し、配送の流れを実際の現場で確認します。積み方、順路の考え方、受け渡しの応対を覚えていく期間です。
                </p>
              </div>
              <div className="border-l-2 border-jungle pl-6">
                <h3 className="text-lg font-bold text-white">慣らし期間｜正確さを優先</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  単独で走り始めても、最初は予定より時間がかかります。ここで焦ってスピードを優先すると、事故や誤配のリスクが上がります。慣れるまでは正確さを優先してください。
                </p>
              </div>
              <div className="border-l-2 border-jungle pl-6">
                <h3 className="text-lg font-bold text-white">その後｜効率は自然に上がる</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  同じエリアを繰り返し走るうちに、道順・建物の位置・駐車できる場所が頭に入ります。順路を組み立てる時間が短くなり、配れる件数は自然に増えていきます。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------ 関連ページ ------------------------------ */}
      <Section tone="mist" spacing="tight">
        <Container>
          <SectionHeading eyebrow="Related" title="あわせて読みたい" />
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <TextLink href="/work">仕事内容</TextLink>
            <TextLink href="/beginner">未経験の方へ</TextLink>
            <TextLink href="/jobs">募集中の求人</TextLink>
            <TextLink href="/columns/light-cargo-driver-job-description">
              軽貨物ドライバーの仕事内容とは
            </TextLink>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
