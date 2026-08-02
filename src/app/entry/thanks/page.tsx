import type { Metadata } from 'next';
import { Container, Section, ButtonLink, TextLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { buildMetadata } from '@/lib/seo';
import { applicationSteps } from '@/data/process';
import { socialLinks } from '@/data/site';

/** 送信完了ページ。検索結果に出す必要がないため noindex にしています */
export const metadata: Metadata = buildMetadata({
  title: '送信が完了しました',
  description: '応募フォームの送信が完了しました。担当者よりご連絡を差し上げます。',
  path: '/entry/thanks',
  noindex: true,
});

export default function EntryThanksPage() {
  return (
    <>
      <PageHero
        eyebrow="Thank You"
        title="送信が完了しました"
        lead="ご応募・お問い合わせいただきありがとうございます。内容を確認のうえ、担当者よりご連絡を差し上げます。"
      />

      <Section tone="white">
        <Container size="narrow">
          <h2 className="border-l-4 border-jungle pl-5 text-xl font-bold text-ink">この後の流れ</h2>
          <ol className="rule-list mt-8 border-t-2 border-ink">
            {applicationSteps.map((step, index) => (
              <li key={step.title} className="flex gap-5 py-6 sm:gap-8">
                <span className="display shrink-0 text-2xl leading-none text-jungle-deep sm:text-3xl">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-body">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 border-l-4 border-jungle bg-mist px-6 py-6">
            <p className="text-sm font-bold text-ink">ご連絡までにお時間をいただく場合があります</p>
            <p className="mt-3 text-sm leading-7 text-body">
              お急ぎの場合や、数日経っても連絡がない場合は、Instagramのダイレクトメッセージよりお問い合わせください。
            </p>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-ink underline decoration-jungle decoration-2 underline-offset-4"
            >
              Instagram @jungle.hyougo
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <ButtonLink href="/" variant="ink">
              トップページへ戻る
            </ButtonLink>
            <ButtonLink href="/columns" variant="outline">
              採用コラムを読む
            </ButtonLink>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-8">
            <TextLink href="/faq">よくある質問</TextLink>
            <TextLink href="/work">仕事内容</TextLink>
            <TextLink href="/beginner">未経験の方へ</TextLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
