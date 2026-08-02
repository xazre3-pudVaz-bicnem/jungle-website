import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, SectionHeading, TextLink, NoteBlock } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, type Crumb } from '@/lib/jsonld';
import { socialLinks } from '@/data/site';

export const metadata: Metadata = buildMetadata({
  title: '求人情報掲載・更新方針',
  description:
    'JUNGLEが当サイトに掲載する求人情報の確認方法、更新の考え方、募集終了求人の扱い、報酬例の考え方、業務委託契約に関する注意事項をまとめています。',
  path: '/job-policy',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '求人情報掲載・更新方針', href: '/job-policy' },
];

export default function JobPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="Job Posting Policy"
        title="求人情報掲載・更新方針"
        lead="当サイトに掲載する求人情報を、どのように確認し、どのように扱っているかをお伝えします。応募を検討される際の判断材料としてご覧ください。"
      />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container size="narrow">
          <div className="space-y-16">
            {/* 1 */}
            <section>
              <SectionHeading eyebrow="01" as="h2" title="求人情報の確認方法" />
              <div className="prose-jungle mt-6 text-[0.9375rem]">
                <p>
                  当サイトに掲載している募集条件は、JUNGLEが実際に募集している内容にもとづいて記載しています。掲載にあたっては、確認が取れている条件のみを記載することを原則としています。
                </p>
                <p>
                  条件のうち、確認が取れていない項目については、金額や日数を推測して記載することはせず、求人詳細ページ上で「面談時にご確認ください」と明記しています。求人票の見栄えを整えるために内容を補うことは行っていません。
                </p>
              </div>
            </section>

            {/* 2 */}
            <section>
              <SectionHeading eyebrow="02" as="h2" title="情報の更新について" />
              <div className="prose-jungle mt-6 text-[0.9375rem]">
                <p>
                  募集条件に変更が生じた場合、および募集を終了した場合には、当サイトの求人情報を更新します。更新は、変更を把握した時点で行うことを基本としています。
                </p>
                <p>
                  なお、当サイトでは「毎日更新」「週次で見直し」といった更新頻度を掲げていません。実際に行っていない運用を掲げることは、掲載情報の信頼性を損なうと考えているためです。
                </p>
              </div>
              <NoteBlock>
                掲載情報と実際の募集状況にずれがある可能性がある場合は、応募時または面談時に必ずご確認ください。実際の契約条件は、面談時にご提示する内容が優先されます。
              </NoteBlock>
            </section>

            {/* 3 */}
            <section>
              <SectionHeading eyebrow="03" as="h2" title="募集終了した求人の扱い" />
              <div className="prose-jungle mt-6 text-[0.9375rem]">
                <p>
                  募集を終了した求人については、募集中であるかのように掲載を続けることはしません。募集状況に応じて、以下のいずれかの対応を行います。
                </p>
              </div>
              <ul className="mt-5 space-y-3">
                {[
                  '求人詳細ページを「募集終了」の表示に切り替え、構造化データ（JobPosting）の出力を停止する',
                  '検索エンジンに対して当該ページをインデックス対象から外す設定に切り替える',
                  'サイトマップから当該ページを除外する',
                  '募集期限が設定されている求人については、期限を過ぎた時点で募集終了として扱う',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-body">
                    <span aria-hidden="true" className="mt-3 h-1 w-3.5 shrink-0 bg-jungle" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="prose-jungle mt-6 text-[0.9375rem]">
                <p>
                  募集終了後も、条件を確認された方が内容を振り返れるよう、ページ自体を残す場合があります。その場合も、募集中の求人と区別できる表示に切り替えます。
                </p>
              </div>
            </section>

            {/* 4 */}
            <section>
              <SectionHeading eyebrow="04" as="h2" title="報酬例の考え方" />
              <div className="prose-jungle mt-6 text-[0.9375rem]">
                <p>
                  求人ページに報酬額を掲載する場合は、その金額が「報酬例」であることを明記し、あわせて計算の前提を記載します。前提を示さずに金額だけを大きく見せることは行いません。
                </p>
                <p>
                  掲載している報酬額は、実際の報酬や手取り額を保証するものではありません。契約内容、稼働日数、担当する案件、必要経費などによって変動します。
                </p>
                <p>
                  業務委託契約の場合、報酬額から経費を差し引いた金額が実際の手取りになります。求人票の金額と手取り額は異なるという前提で、面談時に具体的な数字をご確認ください。
                </p>
              </div>
              <TextLink href="/columns/driver-income-and-expenses" className="mt-6">
                報酬と必要経費の考え方を読む
              </TextLink>
            </section>

            {/* 5 */}
            <section>
              <SectionHeading eyebrow="05" as="h2" title="業務委託契約に関する注意" />
              <div className="prose-jungle mt-6 text-[0.9375rem]">
                <p>
                  現在募集している軽貨物ドライバーの求人は、業務委託契約です。雇用契約ではありません。当サイトでは、業務委託の求人を正社員やアルバイトのように表現することはしていません。
                </p>
              </div>
              <ul className="mt-5 space-y-3">
                {[
                  '労働基準法上の労働者としての保護（有給休暇・残業代・最低賃金など）は適用されません',
                  '社会保険は、国民健康保険・国民年金にご自身で加入いただく形になります',
                  'ガソリン代・車両維持費・保険料などの経費が個人負担となる場合があります',
                  '確定申告など、個人事業主としての税務手続きはご自身で行っていただきます',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-body">
                    <span aria-hidden="true" className="mt-3 h-1 w-3.5 shrink-0 bg-jungle" />
                    {item}
                  </li>
                ))}
              </ul>
              <TextLink href="/columns/contractor-driver-explained" className="mt-6">
                業務委託ドライバーについて詳しく読む
              </TextLink>
            </section>

            {/* 6 */}
            <section>
              <SectionHeading eyebrow="06" as="h2" title="実際の契約条件について" />
              <div className="prose-jungle mt-6 text-[0.9375rem]">
                <p>
                  当サイトに掲載している内容は、募集の概要をお伝えするためのものです。実際の契約条件は、面談時にご提示し、書面で確認いただいたうえで契約に進みます。
                </p>
                <p>
                  掲載内容と実際の契約条件が異なる場合は、面談時にご提示する契約内容が優先されます。ご不明な点は、契約前に必ずご確認ください。
                </p>
              </div>
            </section>

            {/* 7 */}
            <section>
              <SectionHeading eyebrow="07" as="h2" title="求人情報に誤りがあった場合" />
              <div className="prose-jungle mt-6 text-[0.9375rem]">
                <p>
                  掲載内容に誤りや古い情報を見つけられた場合は、ご連絡いただけますと幸いです。確認のうえ、速やかに修正いたします。
                </p>
                <p>
                  ご連絡は、
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    Instagram（@jungle.hyougo）
                  </a>
                  のダイレクトメッセージ、または
                  <Link href="/entry" className="link-underline">
                    応募フォーム
                  </Link>
                  のご相談欄よりお願いいたします。
                </p>
              </div>
            </section>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-9">
            <TextLink href="/jobs">求人一覧を見る</TextLink>
            <TextLink href="/privacy">プライバシーポリシー</TextLink>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
