import type { ReactNode } from 'react';
import { Container } from './Primitives';
import { Photo } from './Photo';

/**
 * 下層ページ共通のヒーロー。
 * 黒背景＋大きな英字＋太いH1で、ページごとの主題を明確にします。
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt,
}: {
  /** 英字ラベル（デザイン要素） */
  eyebrow: string;
  /** H1。1ページに1つ */
  title: ReactNode;
  lead?: ReactNode;
  /** 背景に敷く写真（未配置ならフォールバック表示） */
  image?: string;
  imageAlt?: string;
}) {
  return (
    <header className="relative overflow-hidden bg-ink">
      {image && (
        <>
          <div className="absolute inset-0 opacity-45">
            <Photo src={image} alt={imageAlt ?? ''} fallbackLabel={eyebrow} className="h-full w-full" sizes="100vw" />
          </div>
          {/*
            明るい写真でも白文字が読めるよう、左（文字が乗る側）を濃くするスクリムを重ねます。
            これがないと空や夕景の明るい部分でコントラストが不足します。
          */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/40"
            aria-hidden="true"
          />
        </>
      )}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-jungle" aria-hidden="true" />
      <Container className="relative pt-28 pb-16 sm:pt-40 sm:pb-24">
        <p className="display text-sm tracking-[0.28em] text-jungle">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-[1.75rem] leading-[1.35] font-bold text-white sm:text-[2.75rem]">
          {title}
        </h1>
        {lead && <div className="mt-7 max-w-2xl text-[0.95rem] leading-8 text-white/75">{lead}</div>}
      </Container>
    </header>
  );
}
