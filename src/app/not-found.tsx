import type { Metadata } from 'next';
import { Container, Section, ButtonLink, TextLink } from '@/components/ui/Primitives';

/** 404ページ。トップと同じtitleにならないよう固有の値を設定します */
export const metadata: Metadata = {
  title: 'ページが見つかりません',
  description: 'お探しのページは見つかりませんでした。現在募集中の求人は求人一覧ページからご確認ください。',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section tone="ink" spacing="loose" className="min-h-[70svh]">
      <Container size="narrow" className="pt-20">
        <p className="display text-7xl leading-none text-jungle sm:text-9xl">404</p>
        <h1 className="mt-8 text-2xl leading-relaxed font-bold text-white sm:text-3xl">
          お探しのページが見つかりませんでした
        </h1>
        <p className="mt-6 text-sm leading-8 text-white/70">
          URLが変更されたか、募集を終了した求人ページの可能性があります。現在募集している求人は求人一覧ページからご確認ください。
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/" variant="primary">
            トップページへ
          </ButtonLink>
          <ButtonLink href="/jobs" variant="outlineLight">
            募集中の求人を見る
          </ButtonLink>
        </div>
        <nav aria-label="主要ページ" className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-8">
          <TextLink href="/recruit" tone="light">
            採用情報
          </TextLink>
          <TextLink href="/work" tone="light">
            仕事内容
          </TextLink>
          <TextLink href="/faq" tone="light">
            よくある質問
          </TextLink>
          <TextLink href="/entry" tone="light">
            応募フォーム
          </TextLink>
        </nav>
      </Container>
    </Section>
  );
}
