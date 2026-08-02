import { socialLinks } from '@/data/site';
import { ButtonLink, Container, Section } from '@/components/ui/Primitives';

/**
 * 応募CTA。各ページの末尾に配置します。
 * 応募ボタンは必ず /entry（実際の応募フォーム）へ遷移します。
 */
export function EntryCta({
  title = '走り出す準備は、\n思っているより簡単です。',
  lead = '普通自動車運転免許があれば応募いただけます。条件を詳しく聞いてから決めたい、という段階のご相談も歓迎しています。',
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <Section tone="ink" spacing="default">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow eyebrow-light">Entry</p>
            <h2 className="mt-6 text-[1.75rem] leading-[1.4] font-bold whitespace-pre-line text-white sm:text-[2.5rem]">
              {title}
            </h2>
            <p className="mt-7 max-w-xl text-[0.9375rem] leading-8 text-white/75">{lead}</p>
          </div>

          <div className="flex flex-col gap-4">
            <ButtonLink href="/entry" variant="primary" className="w-full text-base">
              応募フォームへ進む
            </ButtonLink>
            <ButtonLink href="/jobs" variant="outlineLight" className="w-full">
              募集中の求人を見る
            </ButtonLink>
            {socialLinks.tel && (
              <a
                href={`tel:${socialLinks.tel.replace(/-/g, '')}`}
                className="flex min-h-12 w-full items-center justify-center gap-3 border-2 border-white/70 text-[0.9375rem] font-bold text-white transition-colors hover:bg-white hover:text-ink"
                aria-label={`電話で問い合わせる ${socialLinks.tel}`}
              >
                <span aria-hidden="true" className="display text-xs tracking-widest text-jungle">
                  TEL
                </span>
                {socialLinks.tel}
              </a>
            )}
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 text-sm text-white/70 underline decoration-white/30 underline-offset-4 transition-colors hover:text-jungle"
            >
              Instagramのダイレクトメッセージでも受け付けています
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
