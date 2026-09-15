'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

/**
 * 電話タップ・Instagramタップ・求人からの応募遷移をまとめて計測します。
 *
 * 個々のリンクに onClick を書いて回ると漏れが出るため、
 * ドキュメント全体のクリックを1か所で監視する方式にしています。
 * NEXT_PUBLIC_GA_ID が未設定なら trackEvent が何もしないため、副作用はありません。
 */
export function OutboundTracker() {
  const pathname = usePathname();

  // 求人詳細ページの閲覧
  useEffect(() => {
    if (/^\/jobs\/[^/]+$/.test(pathname)) {
      trackEvent('job_detail_view', { page_path: pathname });
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href') ?? '';

      if (href.startsWith('tel:')) {
        trackEvent('tel_tap', { page_path: pathname });
        return;
      }
      if (href.includes('instagram.com')) {
        trackEvent('instagram_tap', { page_path: pathname });
        return;
      }
      if (href === '/entry' || href.startsWith('/entry?')) {
        // どのページから応募フォームへ進んだかを区別する
        if (pathname.startsWith('/jobs/')) trackEvent('job_to_entry', { from: pathname });
        return;
      }
      if (href.startsWith('/jobs/') && pathname.startsWith('/columns/')) {
        trackEvent('column_to_job', { from: pathname, to: href });
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

  return null;
}
