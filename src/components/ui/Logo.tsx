import Image from 'next/image';
import { siteConfig } from '@/data/site';

/**
 * ロゴ表示。
 *
 * 白背景を透過したロゴを使い、背景になじませて表示します。
 * 「TRANSPORT」の文字とトラックは黒のため、暗い背景では見えなくなります。
 * 暗い背景の上では `tone="dark"` を指定し、黒の部分を白にした版を使ってください。
 */
export function Logo({
  className = '',
  width = 200,
  height = 50,
  priority = false,
  tone = 'light',
}: {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  /** 置く背景の明るさ */
  tone?: 'light' | 'dark';
}) {
  return (
    <Image
      src={tone === 'dark' ? siteConfig.logoWordmark.onDark : siteConfig.logoWordmark.onLight}
      alt={`${siteConfig.name}のロゴ`}
      width={width}
      height={height}
      priority={priority}
      className={`w-auto object-contain ${className}`}
    />
  );
}
