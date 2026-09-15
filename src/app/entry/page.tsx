import type { Metadata } from 'next';
import { Container, Section, SectionHeading, NoteBlock, TextLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryForm } from '@/components/entry/EntryForm';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, type Crumb } from '@/lib/jsonld';
import { openJobs } from '@/data/jobs';
import { applicationSteps } from '@/data/process';
import { socialLinks } from '@/data/site';

export const metadata: Metadata = buildMetadata({
  title: '応募フォーム｜軽貨物ドライバー募集',
  description:
    'JUNGLEの軽貨物ドライバー募集への応募フォームです。兵庫県明石市・神戸市西部エリアで働きたい方はこちらからご応募ください。ご質問だけのご相談も受け付けています。',
  path: '/entry',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '応募フォーム', href: '/entry' },
];

export default function EntryPage() {
  const jobs = openJobs();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="Entry"
        title="応募フォーム"
        lead="必要事項をご記入のうえ送信してください。応募を決めていない段階でのご質問・ご相談も歓迎しています。"
      />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
            {/* -------------------------------- フォーム ------------------------------- */}
            <div>
              <SectionHeading eyebrow="Form" title="応募内容の入力" as="h2" />
              <p className="mt-6 text-sm leading-8 text-body">
                「必須」の項目はすべてご記入ください。ご入力いただいた内容は、選考および連絡の目的にのみ使用します。
              </p>
              <div className="mt-10">
                <EntryForm />
              </div>
            </div>

            {/* -------------------------------- サイド ------------------------------- */}
            <aside className="space-y-10">
              {/* 応募先の求人 */}
              <div className="border-t-2 border-ink pt-7">
                <h2 className="display text-xs tracking-[0.2em] text-jungle-deep">Applying For</h2>
                <p className="mt-4 text-sm leading-7 text-body">現在募集している求人は以下のとおりです。</p>
                <ul className="mt-5 space-y-3">
                  {jobs.map((job) => (
                    <li key={job.slug}>
                      <TextLink href={`/jobs/${job.slug}`}>{job.title}</TextLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* この後の流れ */}
              <div className="border-t-2 border-ink pt-7">
                <h2 className="display text-xs tracking-[0.2em] text-jungle-deep">After Submitting</h2>
                <ol className="rule-list mt-5 border-t border-line">
                  {applicationSteps.slice(0, 4).map((step, index) => (
                    <li key={step.title} className="flex gap-4 py-4">
                      <span className="display shrink-0 text-lg leading-none text-jungle-deep">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink">{step.title}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* 別の連絡方法 */}
              <div className="bg-ink p-7">
                <h2 className="text-base font-bold text-white">フォーム以外の連絡方法</h2>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  お電話・Instagramのダイレクトメッセージからもご連絡いただけます。ご都合のよい方法をお選びください。
                </p>
                {socialLinks.tel && (
                  <a
                    href={`tel:${socialLinks.tel.replace(/-/g, '')}`}
                    className="mt-6 flex min-h-12 items-center justify-center bg-jungle text-base font-bold text-ink transition-colors hover:bg-white"
                    aria-label={`電話で問い合わせる ${socialLinks.tel}`}
                  >
                    {socialLinks.tel}
                  </a>
                )}
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex min-h-12 items-center justify-center border-2 border-white/60 text-sm font-bold text-white transition-colors hover:bg-white hover:text-ink"
                >
                  Instagram @jungle.hyougo
                </a>
              </div>

              <NoteBlock title="ご確認ください">
                JUNGLEの軽貨物ドライバー募集は業務委託契約です。雇用契約ではないため、労働基準法上の労働者としての保護は適用されません。契約条件は面談時に具体的にご説明します。
              </NoteBlock>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
