import Image from 'next/image';
import { siteConfig } from '@/data/site';

/**
 * ロゴ表示。
 *
 * 現在のロゴ（public/logo.jpg）は背景が白の JPG で、透過情報を持ちません。
 * そのため暗い背景の上にそのまま置くと白い四角が浮いてしまいます。
 * ここでは白い下地（チップ）の中にロゴを収めることで、明るい背景でも
 * 暗い背景でも同じ見え方になるようにしています。
 *
 * ※ 透過PNG または SVG のロゴが用意できた場合は、public/ に差し替えたうえで
 *    `chip` を false にすると、下地なしで表示できます。
 */
export function Logo({
  className = '',
  width = 200,
  height = 50,
  priority = false,
  chip = true,
}: {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  chip?: boolean;
}) {
  const image = (
    <Image
      src={siteConfig.logoWordmark}
      alt={`${siteConfig.name}のロゴ`}
      width={width}
      height={height}
      priority={priority}
      className={`w-auto object-contain ${className}`}
    />
  );

  if (!chip) return image;

  return <span className="inline-flex items-center bg-white px-3 py-1.5">{image}</span>;
}
