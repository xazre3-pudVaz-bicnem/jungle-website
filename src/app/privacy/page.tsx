import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, TextLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, type Crumb } from '@/lib/jsonld';
import { company, show } from '@/data/company';
import { socialLinks } from '@/data/site';

export const metadata: Metadata = buildMetadata({
  title: 'プライバシーポリシー',
  description:
    'JUNGLE TRANSPORTにおける個人情報の取り扱いについて定めたプライバシーポリシーです。応募フォームでお預かりする情報の利用目的と管理方法を記載しています。',
  path: '/privacy',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: 'プライバシーポリシー', href: '/privacy' },
];

const sections = [
  {
    heading: '1. 基本方針',
    body: [
      `${show(company.legalName) ?? 'JUNGLE'}（以下「当社」といいます）は、当ウェブサイトの運営およびドライバー採用活動において取得する個人情報の重要性を認識し、個人情報の保護に関する法律その他の関係法令を遵守し、適切に取り扱います。`,
    ],
  },
  {
    heading: '2. 取得する個人情報',
    body: ['当社は、応募フォームを通じて以下の情報を取得します。'],
    list: [
      '氏名・ふりがな',
      '電話番号',
      'メールアドレス',
      'お住まいの市区町村',
      '普通自動車運転免許の有無、AT限定かどうか',
      '配送用車両の保有状況',
      '希望する勤務地・希望する稼働日数・稼働開始希望時期',
      '配送経験の有無',
      'お問い合わせ・ご相談の内容',
    ],
  },
  {
    heading: '3. 利用目的',
    body: ['取得した個人情報は、以下の目的の範囲内で利用します。'],
    list: [
      'ご応募・お問い合わせへの回答および連絡',
      '面談日程の調整、選考および採用に関する業務',
      '契約手続きに必要な確認および連絡',
      '当社からのお知らせの送付',
    ],
  },
  {
    heading: '4. 第三者提供',
    body: [
      '当社は、次のいずれかに該当する場合を除き、あらかじめご本人の同意を得ることなく個人情報を第三者に提供することはありません。',
    ],
    list: [
      '法令にもとづく場合',
      '人の生命、身体または財産の保護のために必要があり、ご本人の同意を得ることが困難な場合',
      '国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合',
    ],
  },
  {
    heading: '5. 委託先の管理',
    body: [
      '当社は、利用目的の達成に必要な範囲において、個人情報の取り扱いを外部に委託する場合があります。この場合、委託先に対して必要かつ適切な監督を行います。',
      'なお、当ウェブサイトの応募フォームからの送信内容は、メール配信サービスを介して当社の担当者へ転送されます。',
    ],
  },
  {
    heading: '6. 安全管理措置',
    body: [
      '当社は、取得した個人情報の漏えい、滅失または毀損の防止その他の安全管理のために、必要かつ適切な措置を講じます。個人情報を取り扱う担当者を限定し、取り扱いに関する管理を行います。',
    ],
  },
  {
    heading: '7. 個人情報の開示・訂正・利用停止',
    body: [
      'ご本人から、個人情報の開示、訂正、追加、削除、利用停止または消去のお申し出があった場合は、ご本人であることを確認したうえで、法令にもとづき遅滞なく対応します。お申し出は、下記のお問い合わせ窓口までご連絡ください。',
    ],
  },
  {
    heading: '8. アクセス解析等について',
    body: [
      '当ウェブサイトでは、サイトの利用状況を把握するためにアクセス解析ツールを利用する場合があります。これらのツールはCookieを使用してデータを収集することがありますが、個人を特定する情報は含まれません。Cookieの利用はブラウザの設定により無効にすることができます。',
    ],
  },
  {
    heading: '9. 本ポリシーの変更',
    body: [
      '当社は、法令の改正や運用の変更に応じて、本ポリシーの内容を見直し、変更することがあります。変更後の内容は当ウェブサイトに掲載した時点から適用されます。',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="Privacy Policy"
        title="プライバシーポリシー"
        lead="当ウェブサイトおよびドライバー採用活動における個人情報の取り扱いについて定めています。"
      />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container size="narrow">
          <div className="space-y-14">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="border-l-4 border-jungle pl-4 text-lg leading-relaxed font-bold text-ink sm:text-xl">
                  {section.heading}
                </h2>
                <div className="prose-jungle mt-5 text-[0.9375rem]">
                  {section.body.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                {section.list && (
                  <ul className="mt-4 space-y-2.5">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-7 text-body">
                        <span aria-hidden="true" className="mt-3 h-1 w-3.5 shrink-0 bg-jungle" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section>
              <h2 className="border-l-4 border-jungle pl-4 text-lg leading-relaxed font-bold text-ink sm:text-xl">
                10. お問い合わせ窓口
              </h2>
              <div className="prose-jungle mt-5 text-[0.9375rem]">
                <p>本ポリシーに関するお問い合わせ、個人情報の開示等のご請求は、以下の窓口までご連絡ください。</p>
              </div>
              <dl className="rule-list mt-5 border-t border-line">
                <div className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-8">
                  <dt className="text-sm font-bold text-ink">名称</dt>
                  <dd className="text-sm leading-7 text-body">{show(company.brandName) ?? 'JUNGLE TRANSPORT'}</dd>
                </div>
                {socialLinks.email && (
                  <div className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-8">
                    <dt className="text-sm font-bold text-ink">メールアドレス</dt>
                    <dd className="text-sm leading-7 text-body">
                      <a href={`mailto:${socialLinks.email}`} className="link-underline font-bold text-ink">
                        {socialLinks.email}
                      </a>
                    </dd>
                  </div>
                )}
                {socialLinks.tel && (
                  <div className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-8">
                    <dt className="text-sm font-bold text-ink">電話番号</dt>
                    <dd className="text-sm leading-7 text-body">
                      <a
                        href={`tel:${socialLinks.tel.replace(/-/g, '')}`}
                        className="link-underline font-bold text-ink"
                      >
                        {socialLinks.tel}
                      </a>
                    </dd>
                  </div>
                )}
                <div className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-8">
                  <dt className="text-sm font-bold text-ink">その他の連絡方法</dt>
                  <dd className="text-sm leading-7 text-body">
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline font-bold text-ink"
                    >
                      Instagram（@jungle.hyougo）
                    </a>
                    のダイレクトメッセージ、または
                    <Link href="/entry" className="link-underline font-bold text-ink">
                      応募フォーム
                    </Link>
                    のご相談欄よりご連絡ください。
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-9">
            <TextLink href="/job-policy">求人情報掲載・更新方針</TextLink>
            <TextLink href="/company">会社概要</TextLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
