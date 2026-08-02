import Image from 'next/image';
import { hasPublicImage } from '@/lib/images';

type PhotoProps = {
  src: string;
  /** 内容が伝わる日本語のalt。装飾目的の場合は decorative を使用 */
  alt: string;
  /** 画像がまだ無いときにフォールバック内に表示する短いラベル（英字ラベル想定） */
  fallbackLabel?: string;
  className?: string;
  /** ファーストビューの画像に指定 */
  priority?: boolean;
  sizes?: string;
  /** 画像に重ねる暗幕の濃さ */
  overlay?: 'none' | 'soft' | 'strong';
};

const overlayClass = {
  none: '',
  soft: 'bg-ink/35',
  strong: 'bg-ink/60',
};

/**
 * 写真表示コンポーネント。
 *
 * public に実ファイルが存在する場合のみ next/image で表示し、
 * 存在しない場合は黒地＋黄色ラインのフォールバックを描画します。
 * どちらの場合も同じ領域を占めるため、写真の有無でレイアウトが崩れません。
 *
 * ■ className に position 系のクラス（absolute / fixed）を渡さないでください。
 *   このコンポーネントは next/image の fill を成立させるため内部で relative を持っており、
 *   外から absolute を渡すと指定が衝突して高さが 0 になります。
 *   全面配置したい場合は、外側を <div className="absolute inset-0"> で包んでください。
 */
export function Photo({
  src,
  alt,
  fallbackLabel,
  className = '',
  priority = false,
  sizes = '100vw',
  overlay = 'none',
}: PhotoProps) {
  const exists = hasPublicImage(src);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {exists ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="photo-fallback absolute inset-0 flex items-end justify-start p-5 sm:p-7" role="presentation">
          <span className="display text-2xl leading-none text-white/25 sm:text-4xl">
            {fallbackLabel ?? 'JUNGLE'}
          </span>
        </div>
      )}
      {overlay !== 'none' && exists && <div className={`absolute inset-0 ${overlayClass[overlay]}`} aria-hidden="true" />}
      {overlay !== 'none' && !exists && <div className="absolute inset-0 bg-ink/25" aria-hidden="true" />}
    </div>
  );
}
