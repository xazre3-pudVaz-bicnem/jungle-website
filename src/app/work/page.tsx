import type { Metadata } from 'next';
import { Container, Section, SectionHeading, TextLink, NumberMark, NoteBlock } from '@/components/ui/Primitives';
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

export const metadata: Metadata = buildMetadata({
  title: '兵庫の軽貨物ドライバーの仕事内容',
  description:
    '兵庫県明石市・神戸市西部エリアで働く軽貨物ドライバーの仕事内容を解説します。宅配と企業配送の違い、配送の流れ、使用車両、扱う荷物、担当エリアをまとめました。',
  path: '/work',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '仕事内容', href: '/work' },
];

const workFaqIds = ['work-content', 'work-area', 'work-alone', 'work-hours', 'vehicle-license'];

const deliveryTypes = [
  {
    eyebrow: 'Home Delivery',
    title: '宅配｜個人宅へ届ける',
    body: '通販で購入された商品などを、個人のご自宅へお届けします。1日に回る件数は多いものの、扱うのは軽自動車に積めるサイズの荷物が中心です。細かい住所を効率よく回る組み立てが仕事の要になります。',
    points: [
      '担当エリア内を戸別に回る配送',
      '時間指定のある荷物を優先した順路の組み立て',
      '不在時の再配達・置き配指定への対応',
    ],
    image: imagePaths.driver01,
    alt: '個人宅の玄関先で荷物をお届けするJUNGLEのドライバー',
  },
  {
    eyebrow: 'Business Delivery',
    title: '企業配送｜事業所間を結ぶ',
    body: '企業や店舗、事業所の間で荷物を運びます。宅配に比べて1日の件数は少なく、決まった時間に決まった場所を回る案件が多くなります。到着時間の指定が厳しい場合もあり、時間管理の正確さが求められます。',
    points: [
      '事業所間・店舗間の荷物配送',
      '到着時間の指定がある配送への対応',
      '訪問先が固定されるため関係を築きやすい',
    ],
    image: imagePaths.depot01,
    alt: '配送拠点で企業向けの荷物を仕分けするJUNGLEのスタッフ',
  },
];

const skills = [
  {
    number: 1,
    title: '安全運転を続けられること',
    body: 'どれだけ速く配れても、事故を起こせばすべてが台無しになります。JUNGLEが最も重視している資質です。',
  },
  {
    number: 2,
    title: '段取りを考えられること',
    body: 'どの順番で回れば無駄が少ないかを考える習慣がある方は、早い段階で配送の効率が上がっていきます。',
  },
  {
    number: 3,
    title: '荷物を丁寧に扱えること',
    body: 'お客様にとって、荷物は届いた状態がすべてです。積み込みから受け渡しまでの扱い方が、そのまま配送品質になります。',
  },
  {
    number: 4,
    title: '一人の時間が苦にならないこと',
    body: '稼働時間の大半は車内で一人です。人間関係の負担が少ないことを理由に、この仕事を選ぶ方も多くいます。',
  },
];

export default function WorkPage() {
  const faqItems = faqsByIds(workFaqIds);

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqPageJsonLd(faqItems)]} />

      <PageHero
        eyebrow="Work"
        title={
          <>
            軽自動車で、
            <br />
            地域の荷物を届ける。
          </>
        }
        lead="兵庫県明石市・神戸市西部エリアで働く軽貨物ドライバーの仕事を、扱う荷物・使用する車両・配送の流れに沿ってご説明します。"
        image={imagePaths.van01}
        imageAlt="配送業務に使用しているJUNGLEの軽バン"
      />
      <Breadcrumbs crumbs={crumbs} />

      {/* ------------------------------ 仕事の全体像 ----------------------------- */}
      <Section tone="white">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <SectionHeading
              eyebrow="Overview"
              title={
                <>
                  一人で完結させる
                  <br />
                  仕事です。
                </>
              }
            />
            <div className="prose-jungle text-[0.9375rem]">
              <p>
                軽貨物ドライバーの仕事は、軽自動車に荷物を積み、決められたエリアの届け先まで運び、受け渡しを完了させることです。大型トラックのドライバーと違い、扱う荷物は一人で持てるサイズが中心で、走るエリアも限られた範囲に収まります。
              </p>
              <p>
                一日の大半を一人で過ごすため、人間関係の負担が少ないことを理由に選ぶ方も多い仕事です。一方で、時間の管理や荷物の扱いはすべて自分の責任になります。自由度が高い代わりに、自己管理が求められる仕事だと考えてください。
              </p>
              <p>
                JUNGLEでは、個人宅向けの宅配と企業向けの配送の両方を扱っています。どちらを担当するかによって、1日の動き方は変わります。
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------ 2つの配送 ------------------------------ */}
      <Section tone="mist">
        <Container>
          <SectionHeading eyebrow="Two Types" title="JUNGLEが扱う2種類の配送" />
          <div className="mt-16 space-y-16">
            {deliveryTypes.map((type, index) => (
              <article key={type.title} className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
                <Photo
                  src={type.image}
                  alt={type.alt}
                  fallbackLabel={type.eyebrow}
                  className={`aspect-4/3 w-full ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
                <div>
                  <p className="display text-xs tracking-[0.22em] text-jungle-deep">{type.eyebrow}</p>
                  <h3 className="mt-4 text-2xl leading-relaxed font-bold text-ink sm:text-3xl">{type.title}</h3>
                  <p className="mt-6 text-[0.9375rem] leading-8 text-body">{type.body}</p>
                  <ul className="mt-7 space-y-3">
                    {type.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-7 text-body">
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-4 shrink-0 bg-jungle" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------- 荷物・車両・エリア ---------------------------- */}
      <Section tone="ink">
        <Container>
          <SectionHeading eyebrow="Details" tone="light" title="荷物・車両・担当エリア" />
          <div className="mt-14 grid gap-px bg-white/15 lg:grid-cols-3">
            {[
              {
                heading: '扱う荷物',
                body: '軽自動車に積載できるサイズの荷物が中心です。通販商品などの個人宅向けの荷物と、企業・事業所間でやり取りされる荷物の両方を扱います。大型トラックが必要な重量物や、特殊車両を要する荷物は扱っていません。',
                note: '担当する荷物の種類やサイズは案件によって異なります。',
              },
              {
                heading: '使用する車両',
                body: '軽自動車（軽バン）を使用します。運転には普通自動車運転免許があれば十分で、大型免許や二種免許は必要ありません。車両をお持ちでない方には、リース制度をご用意しています。',
                note: 'お持ちの車両の持ち込みもご相談いただけます。',
              },
              {
                heading: '担当エリア',
                body: '明石エリアおよび神戸西エリアが中心です。担当エリアが兵庫県内に集約されているため、長距離の移動が続くことはありません。同じエリアを繰り返し走るうちに、道順や建物の位置は自然に覚えていきます。',
                note: 'エリア外にお住まいの方も、通勤が可能であればご相談ください。',
              },
            ].map((item) => (
              <div key={item.heading} className="bg-ink p-8">
                <h3 className="text-lg font-bold text-white">{item.heading}</h3>
                <p className="mt-5 text-sm leading-7 text-white/70">{item.body}</p>
                <p className="mt-5 border-l-2 border-jungle pl-4 text-xs leading-6 text-white/55">{item.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------ 配送の流れ ------------------------------ */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="配送の流れ"
            lead="日々の業務は、この流れに沿って進みます。ただし実際には、時間指定の荷物や道路の混雑といった変動要素が毎日入ります。決められた手順をこなす仕事というより、その日の状況に合わせて順番を組み直していく仕事です。"
          />
          <ol className="rule-list mt-14 border-t-2 border-ink">
            {[
              ['荷物を受け取る', '配送センターや集荷先で荷物を受け取り、車両に積み込みます。配る順番を考えて積む位置を決めておくと、その後の作業が大きく変わります。'],
              ['順路を組み立てる', '担当エリアの配送先を確認し、時間指定のある荷物を優先しながら回る順番を決めます。慣れてくると、この作業にかかる時間が短くなっていきます。'],
              ['配達する', '1件ずつ届けていきます。受け渡し時の挨拶と丁寧な荷扱いが、そのまま配送品質になります。'],
              ['不在時の対応をする', '不在の場合は、不在票の投函や置き配など、案件ごとのルールに従って対応します。'],
              ['完了処理を行う', '配達完了の記録を行います。翌日に向けて車内を整理し、その日の稼働を終えます。'],
            ].map(([title, body], index) => (
              <li key={title} className="grid gap-4 py-8 sm:grid-cols-[5rem_1fr] sm:gap-10">
                <span className="display text-3xl leading-none text-jungle-deep sm:text-4xl" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-2.5 max-w-3xl text-sm leading-7 text-body">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <TextLink href="/daily-flow" className="mt-10">
            1日の流れをさらに詳しく
          </TextLink>
        </Container>
      </Section>

      {/* ------------------------------ 求められること ---------------------------- */}
      <Section tone="mist">
        <Container>
          <SectionHeading
            eyebrow="Skills"
            title="この仕事で求められること"
            lead="資格や経験より、日々の姿勢が結果を左右する仕事です。"
          />
          <div className="mt-14 grid gap-x-14 sm:grid-cols-2">
            {skills.map((skill) => (
              <div key={skill.number} className="border-t-2 border-ink/10 py-9">
                <NumberMark value={skill.number} />
                <h3 className="mt-4 text-lg font-bold text-ink">{skill.title}</h3>
                <p className="mt-4 text-sm leading-7 text-body">{skill.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <NoteBlock title="勤務時間・稼働日数について">
              1日の稼働時間や週あたりの稼働日数は、担当する案件によって条件が異なります。当サイトでは、確認が取れていない条件を推測で掲載することは行っていません。実際の条件は面談時に具体的にお伝えします。
            </NoteBlock>
          </div>
        </Container>
      </Section>

      {/* -------------------------------- FAQ -------------------------------- */}
      <Section tone="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="FAQ" title="仕事内容についての質問" />
              <div className="mt-8 flex flex-col gap-3.5">
                <TextLink href="/faq">すべての質問を見る</TextLink>
                <TextLink href="/jobs">募集中の求人を見る</TextLink>
              </div>
            </div>
            <div className="border-t border-line">
              <FaqList items={faqItems} />
            </div>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
