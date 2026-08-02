import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section, SectionHeading, ButtonLink, TextLink, NoteBlock } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FaqList } from '@/components/ui/FaqList';
import { JsonLd } from '@/components/ui/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, jobPostingJsonLd, type Crumb } from '@/lib/jsonld';
import { formatJapaneseDate } from '@/lib/format';
import { imagePaths } from '@/lib/images';
import { getJob, publishedJobs, visibleSpecs } from '@/data/jobs';
import { faqsByIds } from '@/data/faq';
import { applicationSteps } from '@/data/process';
import { socialLinks } from '@/data/site';

/**
 * 求人詳細ページ。1ページにつき1件の求人のみを掲載します。
 *
 * ■ 構造化データの出力ルール
 *   - status === 'open' のときだけ JobPosting を出力します。
 *   - status === 'closed' のときは JobPosting を出力せず、募集終了として表示し noindex にします。
 *   - status === 'draft' のときはページ自体を 404 にします。
 */

/** draft は静的生成しない（closed は募集終了ページとして残す） */
export function generateStaticParams() {
  return publishedJobs().map((job) => ({ slug: job.slug }));
}

export const dynamicParams = false;

const detailFaqIds = ['money-contract', 'money-calc', 'money-expense', 'vehicle-lease', 'beginner-training', 'apply-how'];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job || job.status === 'draft') return {};

  const isClosed = job.status === 'closed';

  return buildMetadata({
    title: isClosed
      ? `【募集終了】${job.title}`
      : `${job.location.locality}の軽貨物ドライバー求人`,
    description: isClosed
      ? `${job.title}の募集は終了しました。現在募集中の求人は求人一覧ページからご確認ください。`
      : job.summary,
    path: `/jobs/${job.slug}`,
    // 募集終了した求人は検索結果に出さない
    noindex: isClosed,
  });
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJob(slug);

  // 下書きの求人は公開しない
  if (!job || job.status === 'draft') notFound();

  const isOpen = job.status === 'open';
  const faqItems = faqsByIds(detailFaqIds);
  const specs = visibleSpecs(job);

  const crumbs: Crumb[] = [
    { name: 'ホーム', href: '/' },
    { name: '求人一覧', href: '/jobs' },
    { name: job.title, href: `/jobs/${job.slug}` },
  ];

  return (
    <>
      {/* JobPosting は募集中（open）の求人にのみ出力します */}
      <JsonLd data={isOpen ? [breadcrumbJsonLd(crumbs), jobPostingJsonLd(job)] : [breadcrumbJsonLd(crumbs)]} />

      <PageHero
        eyebrow={isOpen ? 'Job Detail' : 'Closed'}
        title={job.title}
        lead={isOpen ? job.summary : 'この求人の募集は終了しました。'}
        image={isOpen ? imagePaths.loading02 : undefined}
        imageAlt="軽貨物車両へ段ボールを積み込むJUNGLEのドライバー"
      />
      <Breadcrumbs crumbs={crumbs} />

      {/* --------------------------- 募集終了時の案内 --------------------------- */}
      {!isOpen && (
        <Section tone="mist" spacing="tight">
          <Container size="narrow">
            <NoteBlock title="この求人の募集は終了しました">
              現在募集中の求人は求人一覧ページからご確認ください。今後の募集についてのご相談も承っています。
            </NoteBlock>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/jobs" variant="ink">
                募集中の求人を見る
              </ButtonLink>
              <ButtonLink href="/entry" variant="outline">
                応募・相談フォーム
              </ButtonLink>
            </div>
          </Container>
        </Section>
      )}

      {isOpen && (
        <>
          {/* ------------------------------ 概要 ------------------------------ */}
          <Section tone="jungle" spacing="tight">
            <Container>
              <h2 className="sr-only">募集概要</h2>
              <dl className="grid gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: '契約形態', value: '業務委託' },
                  { label: '募集地域', value: job.areas.join('／') },
                  { label: '配送エリア', value: job.deliveryAreas.join('／') },
                  { label: '必要な免許', value: '普通自動車運転免許' },
                ].map((item) => (
                  <div key={item.label} className="bg-jungle p-6">
                    <dt className="text-xs font-bold text-ink/60">{item.label}</dt>
                    <dd className="mt-2.5 text-base leading-relaxed font-bold text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Container>
          </Section>

          <Section tone="white">
            <Container>
              <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
                {/* ------------------------------ 本文 ------------------------------ */}
                <div className="space-y-16">
                  {/* 仕事内容 */}
                  <section>
                    <SectionHeading eyebrow="Job Description" title="仕事内容" as="h2" />
                    <ul className="mt-8 space-y-4">
                      {job.duties.map((duty) => (
                        <li key={duty} className="flex gap-4 text-[0.9375rem] leading-8 text-body">
                          <span aria-hidden="true" className="mt-3.5 h-1.5 w-5 shrink-0 bg-jungle" />
                          {duty}
                        </li>
                      ))}
                    </ul>
                    <TextLink href="/work" className="mt-7">
                      仕事内容をさらに詳しく
                    </TextLink>
                  </section>

                  {/* 報酬 */}
                  {job.salary && (
                    <section>
                      <SectionHeading eyebrow="Reward" title="報酬について" as="h2" />
                      <div className="mt-8 border-t-4 border-ink pt-7">
                        <p className="text-xs font-bold text-body/60">報酬例</p>
                        <p className="mt-3 text-[1.75rem] leading-tight font-bold text-ink sm:text-[2.25rem]">
                          <span className="marker">{job.salary.headline}</span>
                        </p>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-base font-bold text-ink">この報酬例の根拠</h3>
                        <ul className="mt-4 space-y-3">
                          {job.salary.basis.map((line) => (
                            <li key={line} className="flex gap-3 text-sm leading-7 text-body">
                              <span aria-hidden="true" className="mt-3 h-1 w-3.5 shrink-0 bg-jungle" />
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-8">
                        <NoteBlock title="報酬に関するご注意">
                          上記は報酬例であり、実際の報酬や手取り額を保証するものではありません。契約内容、稼働日数、案件、必要経費などにより異なります。
                        </NoteBlock>
                      </div>

                      <TextLink href="/columns/driver-income-and-expenses" className="mt-7">
                        報酬と必要経費の考え方を読む
                      </TextLink>
                    </section>
                  )}

                  {/* 応募資格 */}
                  <section>
                    <SectionHeading eyebrow="Requirements" title="応募資格・歓迎する方" as="h2" />
                    <div className="mt-8 space-y-8">
                      <div>
                        <h3 className="text-base font-bold text-ink">応募資格</h3>
                        <ul className="mt-4 space-y-3">
                          {job.requirements.map((item) => (
                            <li key={item} className="flex gap-3 text-sm leading-7 text-body">
                              <span aria-hidden="true" className="mt-3 h-1 w-3.5 shrink-0 bg-jungle" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-ink">歓迎する方</h3>
                        <ul className="mt-4 space-y-3">
                          {job.welcome.map((item) => (
                            <li key={item} className="flex gap-3 text-sm leading-7 text-body">
                              <span aria-hidden="true" className="mt-3 h-1 w-3.5 shrink-0 bg-line" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* 待遇 */}
                  <section>
                    <SectionHeading eyebrow="Support" title="待遇・サポート" as="h2" />
                    <ul className="rule-list mt-8 border-t border-line">
                      {job.benefits.map((item) => (
                        <li key={item} className="py-5 text-sm leading-7 text-body">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* 募集条件テーブル */}
                  <section>
                    <SectionHeading
                      eyebrow="Conditions"
                      title="募集条件"
                      as="h2"
                      lead="確認が取れている条件のみを掲載しています。「面談時にご確認ください」と記載している項目は、案件によって異なるためです。"
                    />
                    <dl className="rule-list mt-8 border-t-2 border-ink">
                      {specs.map((spec) => (
                        <div key={spec.label} className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr] sm:gap-8">
                          <dt className="text-sm font-bold text-ink">{spec.label}</dt>
                          <dd className="text-sm leading-7 text-body">
                            {spec.value ?? <span className="text-body/50">面談時にご確認ください</span>}
                            {spec.note && <span className="mt-1.5 block text-xs text-body/60">※ {spec.note}</span>}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>

                  {/* 面談で確認いただきたい項目 */}
                  <section>
                    <SectionHeading eyebrow="To Confirm" title="面談時にご確認いただきたい項目" as="h2" />
                    <p className="mt-6 text-sm leading-8 text-body">
                      以下は案件や契約内容によって変わるため、当サイトには金額・日数を記載していません。面談の場で具体的にご説明します。ご不明な点は遠慮なくお尋ねください。
                    </p>
                    <ul className="mt-7 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                      {job.toConfirm.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-7 text-body">
                          <span aria-hidden="true" className="mt-3 h-1 w-3.5 shrink-0 bg-line" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* 応募方法 */}
                  <section>
                    <SectionHeading eyebrow="How to Apply" title="応募方法" as="h2" />
                    <p className="mt-6 text-sm leading-8 text-body">
                      当サイトの応募フォームからご応募ください。ログインや会員登録は不要です。Instagramのダイレクトメッセージからのご連絡も受け付けています。
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <ButtonLink href="/entry" variant="primary">
                        応募フォームへ進む
                      </ButtonLink>
                      <ButtonLink
                        href={socialLinks.instagram}
                        variant="outline"
                        external
                        ariaLabel="Instagramのダイレクトメッセージで応募する"
                      >
                        Instagramから応募
                      </ButtonLink>
                    </div>

                    <ol className="rule-list mt-10 border-t border-line">
                      {applicationSteps.map((step, index) => (
                        <li key={step.title} className="flex gap-5 py-5">
                          <span className="display shrink-0 text-2xl leading-none text-jungle-deep">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-ink">{step.title}</h3>
                            <p className="mt-1.5 text-sm leading-7 text-body">{step.description}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>

                  {/* 注意事項 */}
                  <section>
                    <SectionHeading eyebrow="Notice" title="注意事項" as="h2" />
                    <ul className="mt-8 space-y-5">
                      {job.notes.map((note) => (
                        <li key={note} className="border-l-4 border-line pl-5 text-sm leading-7 text-body">
                          {note}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-8 text-xs leading-6 text-body/70">
                      求人情報の掲載・更新については
                      <Link href="/job-policy" className="link-underline font-bold text-ink">
                        求人情報掲載・更新方針
                      </Link>
                      をご覧ください。
                    </p>
                  </section>
                </div>

                {/* ------------------------------ サイド ------------------------------ */}
                <aside className="lg:sticky lg:top-28 lg:self-start">
                  <div className="bg-ink p-8">
                    <p className="display text-xs tracking-[0.22em] text-jungle">Entry</p>
                    <h2 className="mt-4 text-lg leading-relaxed font-bold text-white">この求人に応募する</h2>
                    <p className="mt-4 text-sm leading-7 text-white/70">
                      普通自動車運転免許があれば応募いただけます。条件を詳しく聞いてから決めたい、という段階のご相談も歓迎しています。
                    </p>
                    <div className="mt-7 space-y-3">
                      <ButtonLink href="/entry" variant="primary" className="w-full">
                        応募フォームへ進む
                      </ButtonLink>
                      <ButtonLink
                        href={socialLinks.instagram}
                        variant="outlineLight"
                        external
                        className="w-full"
                        ariaLabel="Instagramのダイレクトメッセージで問い合わせる"
                      >
                        Instagramで相談
                      </ButtonLink>
                    </div>
                  </div>

                  <dl className="mt-8 rule-list border-t border-line">
                    <div className="py-4">
                      <dt className="text-xs font-bold text-body/50">掲載日</dt>
                      <dd className="mt-1 text-sm text-body">{formatJapaneseDate(job.datePosted)}</dd>
                    </div>
                    <div className="py-4">
                      <dt className="text-xs font-bold text-body/50">募集期限</dt>
                      <dd className="mt-1 text-sm text-body">
                        {job.validThrough ? formatJapaneseDate(job.validThrough) : '設けていません（充足次第終了します）'}
                      </dd>
                    </div>
                    <div className="py-4">
                      <dt className="text-xs font-bold text-body/50">募集状況</dt>
                      <dd className="mt-1 text-sm font-bold text-ink">募集中</dd>
                    </div>
                  </dl>

                  <nav aria-label="関連ページ" className="mt-8 flex flex-col gap-3.5">
                    <TextLink href="/work">仕事内容</TextLink>
                    <TextLink href="/beginner">未経験の方へ</TextLink>
                    <TextLink href="/daily-flow">1日の流れ</TextLink>
                    <TextLink href="/faq">よくある質問</TextLink>
                  </nav>
                </aside>
              </div>
            </Container>
          </Section>

          {/* ------------------------------- FAQ ------------------------------- */}
          <Section tone="mist">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
                <div>
                  <SectionHeading eyebrow="FAQ" title="この求人についてよくある質問" />
                  <TextLink href="/faq" className="mt-8">
                    すべての質問を見る
                  </TextLink>
                </div>
                <div className="border-t border-line">
                  <FaqList items={faqItems} />
                </div>
              </div>
            </Container>
          </Section>
        </>
      )}
    </>
  );
}
