/**
 * 構造化データ（JSON-LD）を出力します。
 *
 * null / undefined を渡しても安全です。出力条件を満たさない構造化データ
 * （未確認の求人の JobPosting、FAQが無いページの FAQPage など）は
 * 生成側が null を返すため、ここで自動的に除外されます。
 *
 * 画面に表示している内容と必ず一致させてください。
 */
type Entry = object | null | undefined;

export function JsonLd({ data }: { data: Entry | Entry[] }) {
  const payload = (Array.isArray(data) ? data : [data]).filter((item): item is object => Boolean(item));
  if (payload.length === 0) return null;

  return (
    <>
      {payload.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          // 構造化データは静的に組み立てた自前のオブジェクトのみを渡しています
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  );
}
