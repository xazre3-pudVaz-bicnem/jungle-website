import Link from 'next/link';
import type { Crumb } from '@/lib/jsonld';
import { Container } from './Primitives';

/**
 * パンくずリスト。最後の要素は現在地としてリンクにしません。
 * 構造化データ（BreadcrumbList）は各ページ側で同じ crumbs 配列から生成します。
 */
export function Breadcrumbs({ crumbs, tone = 'dark' }: { crumbs: Crumb[]; tone?: 'dark' | 'light' }) {
  const isLight = tone === 'light';
  return (
    <nav aria-label="パンくずリスト" className={isLight ? 'bg-ink' : 'border-b border-line bg-white'}>
      <Container>
        <ol
          className={`flex flex-wrap items-center gap-x-2 gap-y-1 py-3.5 text-xs ${
            isLight ? 'text-white/60' : 'text-body/70'
          }`}
        >
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-x-2">
                {isLast ? (
                  <span aria-current="page" className={isLight ? 'text-white' : 'text-ink'}>
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={crumb.href}
                      className={`link-underline ${isLight ? 'hover:text-jungle' : 'hover:text-jungle-deep'}`}
                    >
                      {crumb.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
