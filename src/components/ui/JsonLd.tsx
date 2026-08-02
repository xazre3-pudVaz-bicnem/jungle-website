/**
 * 構造化データ（JSON-LD）を出力します。
 * 画面に表示している内容と必ず一致させてください。
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
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
