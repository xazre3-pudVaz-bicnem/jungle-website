import type { Metadata } from 'next';
import { Container, Section, SectionHeading, TextLink } from '@/components/ui/Primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FaqList } from '@/components/ui/FaqList';
import { JsonLd } from '@/components/ui/JsonLd';
import { EntryCta } from '@/components/sections/EntryCta';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, faqPageJsonLd, type Crumb } from '@/lib/jsonld';
import { imagePaths } from '@/lib/images';
import { faqCategories, faqs, faqsByCategory } from '@/data/faq';

export const metadata: Metadata = buildMetadata({
  title: 'よくある質問｜軽貨物ドライバー求人',
  description:
    'JUNGLEの軽貨物ドライバー募集について、よくいただく質問と回答をまとめました。応募方法、報酬と契約、車両と免許、未経験からの始め方についてお答えします。',
  path: '/faq',
});

const crumbs: Crumb[] = [
  { name: 'ホーム', href: '/' },
  { name: 'よくある質問', href: '/faq' },
];

export default function FaqPage() {
  return (
    <>
      {/* 画面に表示しているすべてのQ&Aを FAQPage として出力します */}
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqPageJsonLd(faqs)]} />

      <PageHero
        eyebrow="FAQ"
        title="よくある質問"
        lead="応募を検討される段階でいただくことの多いご質問にお答えします。確認が取れていない条件については、正直に「面談時にご確認ください」とお伝えしています。"
        image={imagePaths.completionScan}
        imageAlt="配達完了の記録をスマートフォンで入力するJUNGLEのドライバー"
      />
      <Breadcrumbs crumbs={crumbs} />

      {/* ------------------------------ 目次 ------------------------------ */}
      <Section tone="mist" spacing="tight">
        <Container>
          <nav aria-label="カテゴリ内リンク">
            <h2 className="display text-xs tracking-[0.2em] text-jungle-deep">Categories</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {faqCategories.map((category) => (
                <li key={category.key}>
                  <a
                    href={`#${category.key}`}
                    className="inline-flex min-h-11 items-center border border-ink/15 bg-white px-5 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white"
                  >
                    {category.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>

      {/* ------------------------------ 本体 ------------------------------ */}
      <Section tone="white">
        <Container>
          <div className="space-y-20">
            {faqCategories.map((category) => {
              const items = faqsByCategory(category.key);
              if (items.length === 0) return null;

              return (
                <section key={category.key} id={category.key} className="scroll-mt-24">
                  <div className="grid gap-10 lg:grid-cols-[1fr_2.2fr] lg:gap-16">
                    <div>
                      <SectionHeading eyebrow={`${items.length} Questions`} title={category.label} />
                    </div>
                    <div className="border-t-2 border-ink">
                      <FaqList items={items} />
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-20 border-t border-line pt-10">
            <p className="text-sm leading-8 text-body">
              こちらに掲載していないご質問についても、お気軽にお問い合わせください。応募フォームの「ご質問・ご相談内容」欄にご記入いただければ、担当者からご回答します。応募を決めていない段階でのご相談も歓迎しています。
            </p>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              <TextLink href="/entry">応募・相談フォームへ</TextLink>
              <TextLink href="/jobs">募集中の求人を見る</TextLink>
              <TextLink href="/job-policy">求人情報掲載・更新方針</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <EntryCta />
    </>
  );
}
