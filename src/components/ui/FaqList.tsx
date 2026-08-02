import type { FaqItem } from '@/data/faq';

/**
 * よくある質問の一覧。
 * details / summary を使うことで、JavaScript なしで開閉とキーボード操作に対応します。
 */
export function FaqList({ items, tone = 'dark' }: { items: FaqItem[]; tone?: 'dark' | 'light' }) {
  const isLight = tone === 'light';
  return (
    <div className={isLight ? 'rule-list-dark' : 'rule-list'}>
      {items.map((item) => (
        <details key={item.id} className="group">
          <summary
            className={`flex cursor-pointer list-none items-start gap-4 py-6 text-left text-[1.0625rem] font-bold transition-colors ${
              isLight ? 'text-white hover:text-jungle' : 'text-ink hover:text-jungle-deep'
            }`}
          >
            <span
              className={`display mt-0.5 shrink-0 text-lg ${isLight ? 'text-jungle' : 'text-jungle-deep'}`}
              aria-hidden="true"
            >
              Q
            </span>
            <span className="flex-1 leading-8">{item.question}</span>
            <span
              aria-hidden="true"
              className={`mt-1 shrink-0 text-xl leading-none transition-transform duration-200 group-open:rotate-45 ${
                isLight ? 'text-white/50' : 'text-body/40'
              }`}
            >
              ＋
            </span>
          </summary>
          <div className={`flex gap-4 pb-7 ${isLight ? 'text-white/75' : 'text-body'}`}>
            <span
              className={`display mt-0.5 shrink-0 text-lg ${isLight ? 'text-jungle/60' : 'text-jungle-deep/60'}`}
              aria-hidden="true"
            >
              A
            </span>
            <div className="flex-1 space-y-4 text-[0.9375rem] leading-8">
              {item.answer.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
