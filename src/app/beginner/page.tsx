import type { Metadata } from 'next';
import { Container, Section, SectionHeading, TextLink, NoteBlock, ButtonLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FaqList } from '@/components/ui/FaqList';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, faqPageJsonLd, type Crumb } from '@/lib/jsonld';
import { imagePaths } from '@/lib/images';
import { faqsByIds } from '@/data/faq';
import { applicationSteps } from '@/data/process';

export const metadata: Metadata = buildMetadata({
  title: '未経験の方へ｜必要な免許・研修・車両のサポート',
  description:
    '配送の経験がない方に向けて、軽貨物ドライバーを始めるまでの流れを解説します。必要な免許、研修の進め方、車両の用意、始めてからの不安への向き合い方をまとめました。',
  path: '/beginner',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '未経験の方へ', href: '/beginner' },
];

const beginnerFaqIds = [
  'beginner-ok',
  'beginner-training',
  'beginner-map',
  'beginner-anxiety',
  'vehicle-license',
  'vehicle-at',
  'vehicle-lease',
];

const requirements = [
  {
    label: '必要な免許',
    value: '普通自動車運転免許',
    body: '軽貨物配送で使用する軽自動車は、普通免許で運転できます。大型免許・中型免許・二種免許はいずれも必要ありません。二種免許が必要なのは、タクシーやバスのように「人」を運ぶ仕事です。',
  },
  {
    label: 'AT限定免許',
    value: '相談可',
    body: '配送に使用する車両がオートマチック車であれば、AT限定免許でも運転できます。ご用意できる車両の条件が変わる場合があるため、AT限定の方は応募時にお知らせください。応募フォームに選択項目を設けています。',
  },
  {
    label: '配送経験',
    value: '不問',
    body: '軽貨物配送の実務経験は問いません。荷物の積み方、効率のよい回り方、不在時の対応など、現場でしか身につかないことは研修のなかで覚えていけます。',
  },
  {
    label: '車両',
    value: 'なくても可',
    body: '車両リース制度があるため、配送用の車両をお持ちでない方も始められます。軽貨物運送に使用できる車両をお持ちの場合は、持ち込みについてもご相談いただけます。',
  },
];

const worries = [
  {
    worry: '本当に未経験でもできるのか',
    answer:
      'JUNGLEでは、同乗研修などのサポート体制を用意しています。最初の数週間は予定より時間がかかるのが普通です。そこで焦ってスピードを優先すると、事故や誤配のリスクが上がります。慣れるまでは正確さを優先していただいて構いません。件数は、道と手順を覚えるにつれて自然に増えていきます。',
  },
  {
    worry: '地理に詳しくないので不安',
    answer:
      '配送用のナビゲーションを使うため、地理に詳しくない状態からでも始められます。担当エリアが明石・神戸西に集約されているため、同じ道を繰り返し走るなかで、道順や建物の位置は自然に覚えていきます。',
  },
  {
    worry: '慣れるまでの収入が読めない',
    answer:
      'JUNGLEでは日当保証を設けており、稼働の初期段階から一定の報酬が確保される仕組みになっています。ただし、掲載している「月収30万円〜可能」は報酬例であり、金額を保証するものではありません。ご自身の稼働予定にもとづく現実的な目安は、面談時にご確認ください。',
  },
  {
    worry: '女性でも続けられるのか',
    answer:
      'JUNGLEでは女性ドライバーの応募も歓迎しています。軽貨物配送で扱う荷物は軽自動車に積載できるサイズが中心で、大型トラックのような重量物の取り扱いは基本的にありません。',
  },
  {
    worry: '業務委託という契約が不安',
    answer:
      '業務委託は、雇用されるのではなく個人事業主として仕事を請け負う契約です。働き方の自由度がある一方、労働基準法上の保護は適用されず、経費も自己負担になります。内容を理解しないまま契約すると、あとから想定とのずれに気づくことになります。面談では、この点も含めて具体的にご説明します。',
  },
];

export default function BeginnerPage() {
  const faqItems = faqsByIds(beginnerFaqIds);

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqPageJsonLd(faqItems)]} />

      <PageHero
        eyebrow="For Beginners"
        title={
          <>
            はじめての配送でも、
            <br />
            一人にはしません。
          </>
        }
        lead="必要なのは普通自動車運転免許だけです。何から手をつければいいか分からない、という段階からのご相談も歓迎しています。"
        image={imagePaths.training}
        imageAlt="先輩ドライバーから配送の進め方について説明を受けるスタッフ"
      />
      <Breadcrumbs crumbs={crumbs} />

      {/* ------------------------------ 必要なもの ------------------------------ */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Requirements"
            title="始めるために必要なもの"
            lead="軽貨物ドライバーは、特別な資格や実務経験がなくても始められる仕事です。"
          />
          <dl className="rule-list mt-14 border-t-2 border-ink">
            {requirements.map((item) => (
              <div key={item.label} className="grid gap-4 py-8 sm:grid-cols-[1fr_2fr] sm:gap-12">
                <div>
                  <dt className="text-sm font-bold text-body/60">{item.label}</dt>
                  <p className="mt-2 text-xl font-bold text-ink sm:text-2xl">{item.value}</p>
                </div>
                <dd className="text-sm leading-8 text-body">{item.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* ------------------------------ 始めるまでの流れ ---------------------------- */}
      <Section tone="ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Steps"
                tone="light"
                title="走り出すまでの流れ"
                lead="応募から稼働開始まで、順を追って進みます。各段階に要する日数は、ご本人の準備状況や案件の状況によって変わります。"
              />
            </div>
            <ol className="rule-list-dark border-t border-white/20">
              {applicationSteps.map((step, index) => (
                <li key={step.title} className="flex gap-6 py-7 sm:gap-10">
                  <span className="display shrink-0 text-3xl leading-none text-jungle sm:text-4xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white sm:text-lg">{step.title}</h3>
                    <p className="mt-2.5 text-sm leading-7 text-white/70">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* ------------------------------ 研修について ------------------------------ */}
      <Section tone="white">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
            <div>
              <SectionHeading eyebrow="Training" title="研修について" />
              <div className="prose-jungle mt-8 text-[0.9375rem]">
                <p>
                  未経験の方には、ベテランのドライバーに同乗する形での研修からスタートしていただきます。荷物の積み方、順路の組み立て方、不在時の対応など、実際の現場でしか身につかない部分を覚えていく期間です。
                </p>
                <p>
                  研修期間や進め方は、担当していただく案件やご本人の習熟状況によって変わります。決まった日数で切り上げるのではなく、単独で走れる状態になったところで移行します。
                </p>
              </div>
              <NoteBlock title="研修期間中の報酬について">
                研修期間の長さと、その間の報酬の扱いについては、契約内容によって異なります。面談時に必ずご確認ください。当サイトでは、確認が取れていない条件を推測で掲載することは行っていません。
              </NoteBlock>
            </div>
            <Photo
              src={imagePaths.briefing}
              alt="研修中に業務の流れを書類で確認するJUNGLEのスタッフ"
              fallbackLabel="TRAINING"
              className="aspect-4/5 w-full"
              sizes="(min-width: 1024px) 38vw, 100vw"
            />
          </div>
        </Container>
      </Section>

      {/* ------------------------------ 不安への回答 ------------------------------ */}
      <Section tone="mist">
        <Container>
          <SectionHeading
            eyebrow="Concerns"
            title="未経験の方からよくいただく不安"
            lead="実際にご相談いただくことの多い内容に、正直にお答えします。"
          />
          <ul className="rule-list mt-14 border-t-2 border-ink">
            {worries.map((item) => (
              <li key={item.worry} className="grid gap-4 py-9 sm:grid-cols-[1fr_1.8fr] sm:gap-12">
                <h3 className="text-lg leading-relaxed font-bold text-ink">「{item.worry}」</h3>
                <p className="text-sm leading-8 text-body">{item.answer}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ----------------------------- つまずきやすい点 ---------------------------- */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Caution"
            title="始める前に知っておいてほしいこと"
            lead="事前に知っていれば対処できることばかりです。「思っていたのと違った」を減らすために、あらかじめお伝えします。"
          />
          <div className="mt-14 grid gap-px bg-line sm:grid-cols-3">
            {[
              {
                title: '収入の見込みは手取りで考える',
                body: '求人の報酬例をそのまま生活費の計算に使うと、経費を差し引いた段階で計画が崩れます。ガソリン代・車両費用・保険料などを引いた手取りベースで考えてください。',
              },
              {
                title: '車両の維持費を計算に入れる',
                body: 'ガソリン代だけでなく、タイヤ交換・オイル交換・車検・保険料が定期的に発生します。年単位でかかる費用は、月あたりに換算して積み立てておく前提で計算してください。',
              },
              {
                title: '最初は稼働日数を欲張らない',
                body: '乗り降りの回数が多く、想像以上に体を使います。最初は体を慣らす期間を設けるほうが、結果的に長く続けられます。',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-8">
                <h3 className="text-base leading-relaxed font-bold text-ink">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-body">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <ButtonLink href="/columns/start-as-beginner-driver" variant="outline">
              未経験から始める流れを読む
            </ButtonLink>
            <ButtonLink href="/columns/driver-income-and-expenses" variant="outline">
              報酬と必要経費の考え方
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* -------------------------------- FAQ -------------------------------- */}
      <Section tone="mist">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="FAQ" title="未経験の方からの質問" />
              <div className="mt-8 flex flex-col gap-3.5">
                <TextLink href="/faq">すべての質問を見る</TextLink>
                <TextLink href="/jobs">募集中の求人を見る</TextLink>
                <TextLink href="/daily-flow">1日の流れ</TextLink>
              </div>
            </div>
            <div className="border-t border-line">
              <FaqList items={faqItems} />
            </div>
          </div>
        </Container>
      </Section>

      <EntryCta
        title={"分からないことは、"+"\n"+"分からないまま聞いてください。"}
        lead="応募の段階で、すべてを理解している必要はありません。「他の仕事と迷っている」「収入の目安を知りたい」といったご相談も歓迎しています。"
      />
    </>
  );
}
