import Link from 'next/link';
import type { ReactNode } from 'react';

/* -------------------------------- Container -------------------------------- */

export function Container({
  children,
  className = '',
  size = 'default',
}: {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'wide' | 'narrow';
}) {
  const width = {
    narrow: 'max-w-3xl',
    default: 'max-w-6xl',
    wide: 'max-w-[88rem]',
  }[size];
  return <div className={`mx-auto w-full ${width} px-5 sm:px-8 ${className}`}>{children}</div>;
}

/* --------------------------------- Section --------------------------------- */

export function Section({
  children,
  className = '',
  tone = 'white',
  id,
  spacing = 'default',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'white' | 'mist' | 'ink' | 'jungle';
  id?: string;
  spacing?: 'default' | 'tight' | 'loose';
}) {
  const toneClass = {
    white: 'bg-white text-body',
    mist: 'bg-mist text-body',
    ink: 'bg-ink text-white',
    jungle: 'bg-jungle text-ink',
  }[tone];

  const spacingClass = {
    tight: 'py-14 sm:py-20',
    default: 'py-20 sm:py-28',
    loose: 'py-24 sm:py-36',
  }[spacing];

  return (
    <section id={id} className={`${toneClass} ${spacingClass} ${className}`}>
      {children}
    </section>
  );
}

/* ------------------------------ SectionHeading ------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = 'dark',
  as: Tag = 'h2',
  align = 'left',
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: 'dark' | 'light';
  as?: 'h1' | 'h2' | 'h3';
  align?: 'left' | 'center';
}) {
  const isLight = tone === 'light';
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      {eyebrow && (
        <p className={`eyebrow ${isLight ? 'eyebrow-light' : ''} ${align === 'center' ? 'justify-center' : ''}`}>
          {eyebrow}
        </p>
      )}
      <Tag
        className={`mt-5 text-3xl leading-[1.3] font-bold tracking-tight sm:text-[2.75rem] ${
          isLight ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </Tag>
      {lead && (
        <div className={`mt-6 max-w-2xl text-[0.975rem] leading-8 ${isLight ? 'text-white/75' : 'text-body'} ${align === 'center' ? 'mx-auto' : ''}`}>
          {lead}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- Button ---------------------------------- */

type ButtonVariant = 'primary' | 'ink' | 'outline' | 'outlineLight';

const buttonBase =
  'inline-flex min-h-12 items-center justify-center gap-2.5 px-7 py-3.5 text-[0.9375rem] font-bold tracking-wide transition-colors duration-200';

const buttonVariants: Record<ButtonVariant, string> = {
  // 黄色地に黒文字（コントラスト比を確保）
  primary: 'bg-jungle text-ink hover:bg-ink hover:text-jungle',
  ink: 'bg-ink text-white hover:bg-jungle hover:text-ink',
  outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-white',
  outlineLight: 'border-2 border-white/70 text-white hover:bg-white hover:text-ink',
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className = '',
  external = false,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
}) {
  const classes = `${buttonBase} ${buttonVariants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

/* --------------------------------- ArrowText -------------------------------- */

/** 「詳しく見る →」形式のテキストリンク */
export function TextLink({
  href,
  children,
  tone = 'dark',
  className = '',
}: {
  href: string;
  children: ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2.5 text-[0.9375rem] font-bold ${
        tone === 'light' ? 'text-white' : 'text-ink'
      } ${className}`}
    >
      <span className="border-b-2 border-jungle pb-0.5">{children}</span>
      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

/* -------------------------------- NumberMark -------------------------------- */

/** 大きな数字。ステップやリストの装飾に使用 */
export function NumberMark({ value, tone = 'dark' }: { value: string | number; tone?: 'dark' | 'light' }) {
  return (
    <span
      className={`display block text-5xl leading-none sm:text-6xl ${
        tone === 'light' ? 'text-jungle' : 'text-ink/15'
      }`}
      aria-hidden="true"
    >
      {String(value).padStart(2, '0')}
    </span>
  );
}

/* ---------------------------------- Note ------------------------------------ */

/** 注意書き・補足の囲み。黄色の太い左罫線で表現 */
export function NoteBlock({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="border-l-4 border-jungle bg-mist px-6 py-6 sm:px-8">
      {title && <p className="text-base font-bold text-ink">{title}</p>}
      <div className={`text-sm leading-7 text-body ${title ? 'mt-3' : ''}`}>{children}</div>
    </div>
  );
}
