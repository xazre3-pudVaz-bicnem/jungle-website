import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { formattedAddress } from '@/data/company';
import { footerNav, siteConfig, socialLinks } from '@/data/site';

/**
 * フッター。
 * 所在地・連絡先は確認できているものだけを表示します（company.ts / site.ts が null なら非表示）。
 */
export function Footer() {
  const year = new Date().getFullYear();
  const address = formattedAddress();

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto w-full max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          {/* ブランド */}
          <div>
            <Link href="/" className="inline-block" aria-label={`${siteConfig.name} トップページ`}>
              <Logo className="h-11" width={800} height={210} tone="dark" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
              兵庫県明石市・神戸市西部エリアを中心に、宅配および企業配送を行う軽貨物配送のJUNGLE
              TRANSPORTです。軽貨物ドライバーを募集しています。
            </p>

            <dl className="mt-8 space-y-3 text-sm text-white/65">
              <div className="flex gap-3">
                <dt className="shrink-0 font-bold text-white/45">エリア</dt>
                <dd>兵庫県（明石市・神戸市西部を中心に）</dd>
              </div>
              {address && (
                <div className="flex gap-3">
                  <dt className="shrink-0 font-bold text-white/45">所在地</dt>
                  <dd>{address}</dd>
                </div>
              )}
              {socialLinks.tel && (
                <div className="flex gap-3">
                  <dt className="shrink-0 font-bold text-white/45">電話</dt>
                  <dd>
                    <a href={`tel:${socialLinks.tel.replace(/-/g, '')}`} className="link-underline">
                      {socialLinks.tel}
                    </a>
                  </dd>
                </div>
              )}
              {socialLinks.email && (
                <div className="flex gap-3">
                  <dt className="shrink-0 font-bold text-white/45">メール</dt>
                  <dd>
                    <a href={`mailto:${socialLinks.email}`} className="link-underline">
                      {socialLinks.email}
                    </a>
                  </dd>
                </div>
              )}
              <div className="flex gap-3">
                <dt className="shrink-0 font-bold text-white/45">連絡</dt>
                <dd>
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    Instagram（@jungle.hyougo）
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* ナビゲーション */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                {/* 日本語の見出しなので、英字用のディスプレイ書体は使いません */}
                <h2 className="text-xs font-bold tracking-[0.08em] text-jungle">{group.heading}</h2>
                <ul className="mt-5 space-y-3.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-jungle">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2.5 text-sm font-bold text-white transition-colors hover:text-jungle"
          >
            <span aria-hidden="true" className="display text-base text-jungle">
              IG
            </span>
            Instagram @jungle.hyougo
          </a>
          <p className="text-xs text-white/45">
            © {year} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
