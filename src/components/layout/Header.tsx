'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useEffect, useState } from 'react';
import { headerNav, siteConfig, socialLinks } from '@/data/site';

/**
 * グローバルヘッダー。
 * スクロール前は透過、スクロール後は白背景に切り替えて視認性を保ちます。
 * モバイルではフルスクリーンメニューを開きます。
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // メニュー展開中は背面のスクロールを止める
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Escapeキーで閉じる
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        本文へスキップ
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? 'bg-white shadow-[0_1px_0_0_#e2e2de]' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[88rem] items-center justify-between px-5 sm:h-20 sm:px-8">
          {/* ロゴは透過済み。ヘッダーが透過（暗いヒーローの上）のときは白抜き版に切り替えます */}
          <Link href="/" className="flex items-center" aria-label={`${siteConfig.name} トップページ`}>
            <Logo className="h-8 sm:h-10" width={800} height={210} tone={solid ? 'light' : 'dark'} priority />
            <span className="sr-only">{siteConfig.name}</span>
          </Link>

          {/* PCナビゲーション */}
          <nav aria-label="メインナビゲーション" className="hidden items-center gap-8 lg:flex">
            {headerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-bold transition-colors hover:text-jungle-deep ${
                  solid ? 'text-ink' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/entry"
              className="inline-flex min-h-11 items-center bg-jungle px-6 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-jungle"
            >
              応募する
            </Link>
          </nav>

          {/* モバイル：メニュー開閉 */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            className={`flex h-11 w-11 items-center justify-center lg:hidden ${solid ? 'text-ink' : 'text-white'}`}
          >
            <span className="relative block h-4 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-200 ${
                  menuOpen ? 'top-1/2 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute top-1/2 left-0 block h-0.5 w-6 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-200 ${
                  menuOpen ? 'top-1/2 -rotate-45' : 'bottom-0'
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* モバイルメニュー */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-0 z-40 overflow-y-auto bg-ink pt-16 pb-32 lg:hidden"
      >
        <nav aria-label="モバイルナビゲーション" className="px-5 pt-6">
          <ul className="rule-list-dark">
            {[...headerNav, { href: '/recruit', label: '採用トップ' }, { href: '/faq', label: 'よくある質問' }, { href: '/columns', label: '採用コラム' }].map(
              (item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center justify-between py-5 text-lg font-bold text-white"
                  >
                    {item.label}
                    <span aria-hidden="true" className="text-jungle">
                      →
                    </span>
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="mt-8 space-y-3">
            <Link
              href="/entry"
              onClick={closeMenu}
              className="flex min-h-14 items-center justify-center bg-jungle text-base font-bold text-ink"
            >
              応募フォームへ進む
            </Link>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex min-h-14 items-center justify-center border-2 border-white/60 text-base font-bold text-white"
            >
              Instagramを見る
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
