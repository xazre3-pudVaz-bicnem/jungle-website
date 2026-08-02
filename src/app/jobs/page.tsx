import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section, TextLink, NoteBlock } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, type Crumb } from '@/lib/jsonld';
import { imagePaths } from '@/lib/images';
import { openJobs } from '@/data/jobs';

/**
 * 求人一覧ページ。
 *
 * ■ 重要
 *   このページには JobPosting 構造化データを設置しません。
 *   Googleしごと検索の要件により、JobPosting は「1ページ1求人」の
 *   求人詳細ページにのみ設置します。
 */

export const metadata: Metadata = buildMetadata({
  title: '求人一覧｜兵庫の軽貨物ドライバー募集',
  description:
    'JUNGLEが現在募集している求人の一覧です。兵庫県明石市・神戸市西部エリアの軽貨物ドライバー求人を掲載しています。募集中の求人のみを表示しています。',
  path: '/jobs',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: '求人一覧', href: '/jobs' },
];

export default function JobsPage() {
  const jobs = openJobs();

  return (
    <>
      {/* 一覧ページには JobPosting を出力しません（BreadcrumbList のみ） */}
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="Jobs"
        title="募集中の求人一覧"
        lead="現在募集している求人のみを掲載しています。募集を終了した求人は一覧から削除されます。"
        image={imagePaths.deliveryPair}
        imageAlt="車両後部で荷物を確認するJUNGLEのドライバー2人"
      />
      <Breadcrumbs crumbs={crumbs} />

      <Section tone="white">
        <Container>
          <div className="flex flex-wrap items-baseline gap-4">
            <p className="display text-5xl leading-none text-ink sm:text-6xl">
              {String(jobs.length).padStart(2, '0')}
            </p>
            <p className="text-sm font-bold text-body/70">件の求人を掲載中</p>
          </div>

          {jobs.length === 0 ? (
            <div className="mt-12">
              <NoteBlock title="現在、募集中の求人はありません">
                募集を再開した際に、こちらに掲載します。今後の募集についてのご相談は、応募フォームまたはInstagramよりお問い合わせください。
              </NoteBlock>
            </div>
          ) : (
            <ul className="rule-list mt-10 border-t-2 border-ink">
              {jobs.map((job) => (
                <li key={job.slug}>
                  <Link href={`/jobs/${job.slug}`} className="group block py-10 transition-colors hover:bg-mist">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-jungle px-3 py-1.5 text-xs font-bold text-ink">募集中</span>
                      <span className="border border-line px-3 py-1.5 text-xs font-bold text-body/70">
                        {job.contractLabel}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
                      <div className="flex-1">
                        <h2 className="text-xl leading-relaxed font-bold text-ink sm:text-2xl">{job.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-body">{job.summary}</p>

                        <dl className="mt-6 grid gap-x-10 gap-y-3 text-xs sm:grid-cols-2">
                          <div className="flex gap-3">
                            <dt className="w-20 shrink-0 font-bold text-body/50">募集地域</dt>
                            <dd className="text-body">{job.areas.join('／')}</dd>
                          </div>
                          <div className="flex gap-3">
                            <dt className="w-20 shrink-0 font-bold text-body/50">配送エリア</dt>
                            <dd className="text-body">{job.deliveryAreas.join('／')}</dd>
                          </div>
                          {job.salary && (
                            <div className="flex gap-3">
                              <dt className="w-20 shrink-0 font-bold text-body/50">報酬例</dt>
                              <dd className="text-body">{job.salary.headline}</dd>
                            </div>
                          )}
                          <div className="flex gap-3">
                            <dt className="w-20 shrink-0 font-bold text-body/50">応募資格</dt>
                            <dd className="text-body">普通自動車運転免許</dd>
                          </div>
                        </dl>
                      </div>

                      <span
                        aria-hidden="true"
                        className="hidden shrink-0 text-2xl text-ink transition-transform duration-200 group-hover:translate-x-1.5 sm:block"
                      >
                        →
                      </span>
                    </div>

                    <span className="mt-7 inline-flex items-center gap-2.5 text-sm font-bold text-ink">
                      <span className="border-b-2 border-jungle pb-0.5">募集要項を見る</span>
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-14">
            <NoteBlock title="求人情報の掲載について">
              当サイトでは、確認が取れている条件のみを掲載しています。勤務時間や報酬の計算方法など、案件によって異なる条件は「面談時にご確認ください」と明記しています。掲載・更新の方針は
              <Link href="/job-policy" className="link-underline font-bold text-ink">
                求人情報掲載・更新方針
              </Link>
              をご覧ください。
            </NoteBlock>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
            <TextLink href="/recruit">採用情報トップ</TextLink>
            <TextLink href="/work">仕事内容</TextLink>
            <TextLink href="/beginner">未経験の方へ</TextLink>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
