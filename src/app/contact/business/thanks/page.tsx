import type { Metadata } from 'next';
import { Container, Section, ButtonLink, TextLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { buildMetadata } from '@/lib/seo';
import { company, show } from '@/data/company';
import { socialLinks } from '@/data/site';

/** 送信完了ページ。検索結果に出す必要がないため noindex にしています */
export const metadata: Metadata = buildMetadata({
  title: '送信が完了しました｜配送のご依頼',
  description: '配送のご依頼・お問い合わせの送信が完了しました。担当者よりご連絡を差し上げます。',
  path: '/contact/business/thanks',
  noindex: true,
});

export default function BusinessContactThanksPage() {
  const tel = show(company.tel);

  return (
    <>
      <PageHero
        eyebrow="Thank You"
        title="送信が完了しました"
        lead="お問い合わせいただきありがとうございます。内容を確認のうえ、担当者よりご連絡を差し上げます。"
      />

      <Section tone="white">
        <Container size="narrow">
          <h2 className="border-l-4 border-jungle pl-5 text-xl font-bold text-ink">この後の流れ</h2>
          <ol className="rule-list mt-8 border-t-2 border-ink">
            {[
              ['内容の確認', 'いただいた配送内容を確認し、対応可能な範囲を検討します。'],
              ['担当者からご連絡', 'お電話またはメールにてご連絡します。詳細を伺う場合があります。'],
              ['対応可否・お見積りのご提示', '車両と稼働の状況を踏まえて、対応可否と条件をご回答します。'],
              ['運用開始', '手順をすり合わせたうえで配送を開始します。'],
            ].map(([title, body], index) => (
              <li key={title} className="flex gap-5 py-6 sm:gap-8">
                <span className="display shrink-0 text-2xl leading-none text-jungle-deep sm:text-3xl">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-body">{body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 border-l-4 border-jungle bg-mist px-6 py-6">
            <p className="text-sm font-bold text-ink">お急ぎの場合</p>
            <p className="mt-3 text-sm leading-7 text-body">
              数日経っても連絡がない場合や、お急ぎの場合は、お電話またはInstagramのダイレクトメッセージよりお問い合わせください。
            </p>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {tel && (
                <a
                  href={`tel:${tel.replace(/-/g, '')}`}
                  className="inline-flex min-h-11 items-center text-sm font-bold text-ink underline decoration-jungle decoration-2 underline-offset-4"
                >
                  {tel}
                </a>
              )}
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-sm font-bold text-ink underline decoration-jungle decoration-2 underline-offset-4"
              >
                Instagram @jungle.hyougo
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <ButtonLink href="/" variant="ink">
              トップページへ戻る
            </ButtonLink>
            <ButtonLink href="/service" variant="outline">
              事業内容を見る
            </ButtonLink>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-8">
            <TextLink href="/area">対応エリア</TextLink>
            <TextLink href="/company">会社概要</TextLink>
            <TextLink href="/service/business-delivery">企業向け配送について</TextLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
