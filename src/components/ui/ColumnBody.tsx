import Link from 'next/link';
import type { ColumnBlock } from '@/data/columns';
import { getJob } from '@/data/jobs';

/**
 * 採用コラム本文のレンダラー。
 * データ側で定義したブロック配列を、見出し・段落・箇条書き・表などに描画します。
 */
export function ColumnBody({ blocks }: { blocks: ColumnBlock[] }) {
  return (
    <div className="prose-jungle">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={index}
                className="mt-14 border-l-4 border-jungle pl-5 text-xl leading-relaxed font-bold text-ink sm:text-2xl"
              >
                {block.text}
              </h2>
            );

          case 'h3':
            return (
              <h3 key={index} className="mt-10 text-lg leading-relaxed font-bold text-ink">
                {block.text}
              </h3>
            );

          case 'p':
            return (
              <p key={index} className="text-[0.9375rem]">
                {block.text}
              </p>
            );

          case 'ul':
            return (
              <ul key={index} className="my-7 space-y-3.5">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3.5 text-[0.9375rem] leading-8">
                    <span aria-hidden="true" className="mt-3.5 h-1.5 w-4 shrink-0 bg-jungle" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol key={index} className="my-7 space-y-4">
                {block.items.map((item, itemIndex) => (
                  <li key={item} className="flex gap-4 text-[0.9375rem] leading-8">
                    <span
                      aria-hidden="true"
                      className="display mt-0.5 shrink-0 text-lg leading-none text-jungle-deep"
                    >
                      {String(itemIndex + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            );

          case 'note':
            return (
              <aside key={index} className="my-9 border-l-4 border-jungle bg-mist px-6 py-6 sm:px-8">
                <p className="text-base font-bold text-ink">{block.title}</p>
                <p className="mt-3 text-sm leading-8 text-body">{block.text}</p>
              </aside>
            );

          case 'table':
            return (
              <div key={index} className="my-9 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-ink">
                      {block.head.map((cell) => (
                        <th key={cell} scope="col" className="py-3.5 pr-6 font-bold text-ink">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.join('|')} className="border-b border-line">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cell + cellIndex}
                            className={`py-4 pr-6 leading-7 ${cellIndex === 0 ? 'font-bold text-ink' : 'text-body'}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'jobLink': {
            const job = getJob(block.slug);
            if (!job || job.status !== 'open') {
              // 募集終了・下書きの求人へは誘導しない
              return (
                <p key={index} className="text-[0.9375rem]">
                  {block.text}
                </p>
              );
            }
            return (
              <aside key={index} className="my-10 bg-ink p-7 sm:p-9">
                <p className="display text-xs tracking-[0.22em] text-jungle">Related Job</p>
                <p className="mt-4 text-sm leading-8 text-white/80">{block.text}</p>
                <Link
                  href={`/jobs/${job.slug}`}
                  className="group mt-6 inline-flex min-h-12 items-center gap-3 bg-jungle px-6 text-sm font-bold text-ink transition-colors hover:bg-white"
                >
                  {job.title}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </aside>
            );
          }
        }
      })}
    </div>
  );
}
