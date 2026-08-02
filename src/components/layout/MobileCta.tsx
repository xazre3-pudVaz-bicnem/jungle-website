import Link from 'next/link';
import { socialLinks } from '@/data/site';

/**
 * スマートフォン用の追従CTA。
 * 電話・LINEは確認できている場合だけ表示します（site.ts が null なら出しません）。
 */
export function MobileCta() {
  const hasTel = Boolean(socialLinks.tel);
  const hasLine = Boolean(socialLinks.line);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 backdrop-blur-sm lg:hidden">
      <div className="flex items-stretch gap-px bg-ink/10 pb-[env(safe-area-inset-bottom)]">
        <Link
          href="/jobs"
          className="flex min-h-14 flex-1 items-center justify-center bg-white text-sm font-bold text-ink"
        >
          求人を見る
        </Link>
        {hasTel && (
          <a
            href={`tel:${socialLinks.tel!.replace(/-/g, '')}`}
            className="flex min-h-14 flex-1 items-center justify-center bg-ink text-sm font-bold text-white"
            aria-label="電話で問い合わせる"
          >
            電話する
          </a>
        )}
        {hasLine && (
          <a
            href={socialLinks.line!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 flex-1 items-center justify-center bg-ink text-sm font-bold text-white"
          >
            LINE
          </a>
        )}
        <Link
          href="/entry"
          className="flex min-h-14 flex-[1.3] items-center justify-center bg-jungle text-sm font-bold text-ink"
        >
          応募する
        </Link>
      </div>
    </div>
  );
}
