import type { Metadata } from 'next';
import { Container, Section, SectionHeading, TextLink, NumberMark, NoteBlock } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, organizationJsonLd, type Crumb } from '@/lib/jsonld';
import { imagePaths } from '@/lib/images';
import { qualityPolicies } from '@/data/services';

export const metadata: Metadata = buildMetadata({
  title: 'JUNGLEについて｜考え方と働く人への姿勢',
  description:
    'JUNGLEがどのような考え方で軽貨物配送に取り組んでいるかをお伝えします。配送品質と安全への姿勢、ドライバーが続けられる環境づくりについてまとめました。',
  path: '/about',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: 'JUNGLEについて', href: '/about' },
];

const stances = [
  {
    number: 1,
    title: '始めるハードルを、できるだけ下げる',
    body: '軽貨物ドライバーを始めようとするとき、多くの人が最初につまずくのは車両です。数十万円から百万円単位の初期費用を、仕事が自分に合うか分からない段階で用意するのは簡単なことではありません。JUNGLEが車両リース制度を用意しているのは、この最初の壁を低くするためです。',
  },
  {
    number: 2,
    title: '慣れるまでの不安に、制度で応える',
    body: '未経験から始めた場合、最初の数週間は思うように件数が伸びません。それは当然のことです。ただ、その期間の収入が読めないままでは、落ち着いて仕事を覚えることができません。日当保証を設けているのは、慣れるための時間を確保するためです。',
  },
  {
    number: 3,
    title: '条件を、正直に伝える',
    body: '求人情報では、報酬額だけが大きく見える形で掲載されることが少なくありません。JUNGLEは、確認が取れている条件のみを掲載し、確認できていない条件は「面談時にご確認ください」と明記する方針をとっています。曖昧な条件を推測で埋めることは、応募する方にとって不利益になると考えています。',
  },
  {
    number: 4,
    title: '一人で走る仕事だからこそ、孤立させない',
    body: 'ドライバーは稼働時間の大半を一人で過ごします。人間関係の負担が少ないという利点がある一方、判断に迷ったときやトラブルが起きたときに相談できないと、その負担はすべて本人にかかります。連絡を取り合える体制を保つことを基本にしています。',
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), organizationJsonLd()]} />

      <PageHero
        eyebrow="About"
        title={
          <>
            運ぶ仕事を、
            <br />
            続けられる仕事にする。
          </>
        }
        lead="JUNGLEは兵庫県明石市・神戸市西部エリアで軽貨物配送を行っています。ここでは、どのような考え方で事業と採用に取り組んでいるかをお伝えします。"
        image={imagePaths.teamVans}
        imageAlt="軽貨物車両の前に並ぶJUNGLEのドライバーたち"
      />
      <Breadcrumbs crumbs={crumbs} />

      {/* -------------------------------- 事業の姿 ------------------------------- */}
      <Section tone="white">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="Who We Are" title="「運ぶ」を軸に広がってきた会社です" />
              <div className="prose-jungle mt-8 text-[0.9375rem]">
                <p>
                  JUNGLEは兵庫エリアを拠点に、軽貨物配送を中心とした事業を行っています。主たる業務は、軽自動車を使った個人宅向けの宅配と、企業・事業所間の配送です。
                </p>
                <p>
                  配送のほかに、不動産関連の業務、引越し、遺品回収などにも取り組んできました。もともと配送だけを目的に始まった会社ではなく、地域のなかで「運ぶ」「片づける」といった依頼に応えるうちに、いまの事業の形になっています。
                </p>
                <p>
                  現在は事業拡大にともない、一緒に走る軽貨物ドライバーを募集しています。求人を出すこと自体が目的ではありません。仕事の量が増え、任せられる人が必要になったから募集しています。
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
                <TextLink href="/service">事業内容を見る</TextLink>
                <TextLink href="/company">会社概要</TextLink>
              </div>
            </div>

            <div className="lg:pt-16">
              <Photo
                src={imagePaths.driverTablet}
                alt="軽貨物車両の前でタブレットを確認するJUNGLEのドライバー"
                fallbackLabel="JUNGLE"
                className="aspect-3/4 w-full"
                sizes="(min-width: 1024px) 36vw, 100vw"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------- 働く人への姿勢 --------------------------- */}
      <Section tone="ink">
        <Container>
          <SectionHeading
            eyebrow="Our Stance"
            tone="light"
            title="働く人に対して、JUNGLEが決めていること"
            lead="制度そのものより、なぜその制度があるのかをお伝えします。"
          />
          <div className="mt-16 grid gap-x-16 lg:grid-cols-2">
            {stances.map((stance) => (
              <div key={stance.number} className="border-t border-white/20 py-9">
                <NumberMark value={stance.number} tone="light" />
                <h3 className="mt-4 text-lg leading-relaxed font-bold text-white sm:text-xl">{stance.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/70">{stance.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------ 配送品質・安全 ----------------------------- */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Quality & Safety"
            title="配送品質と安全への考え方"
            lead="配送の仕事は、荷物が届いた状態と、届くまでの安全がすべてです。"
          />
          <ul className="rule-list mt-14 border-t-2 border-ink">
            {qualityPolicies.map((policy) => (
              <li key={policy.number} className="grid gap-4 py-9 sm:grid-cols-[5rem_1fr] sm:gap-10">
                <span className="display text-3xl leading-none text-jungle-deep sm:text-4xl" aria-hidden="true">
                  {String(policy.number).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink">{policy.title}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-body">{policy.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------ 情報の扱い方 ----------------------------- */}
      <Section tone="mist" spacing="tight">
        <Container size="narrow">
          <SectionHeading eyebrow="Policy" title="このサイトの情報について" />
          <div className="prose-jungle mt-8 text-[0.9375rem]">
            <p>
              当サイトに掲載している会社情報・募集条件は、確認が取れている内容のみを記載しています。未確認の項目については、推測で埋めることをせず「面談時にご確認ください」と明記しています。
            </p>
            <p>
              求人情報の掲載・更新に関する方針は、専用のページにまとめています。掲載内容に誤りを見つけられた場合は、ご連絡いただけますと幸いです。
            </p>
          </div>
          <NoteBlock title="現在、公開情報として整理中の項目">
            所在地、代表者名、設立年月、公開可能な電話番号などについては、確認でき次第、会社概要ページに掲載します。ダミーの情報を掲載することは行いません。
          </NoteBlock>
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
            <TextLink href="/job-policy">求人情報掲載・更新方針</TextLink>
            <TextLink href="/company">会社概要</TextLink>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
