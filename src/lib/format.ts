/** ISO 8601（YYYY-MM-DD）を「2026年7月14日」形式へ変換します */
export function formatJapaneseDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  return `${year}年${Number(month)}月${Number(day)}日`;
}
