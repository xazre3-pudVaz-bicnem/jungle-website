/**
 * Google Analytics 4 のイベント計測ヘルパー。
 *
 * NEXT_PUBLIC_GA_ID が未設定の場合、計測タグ自体を読み込まないため
 * ここでの呼び出しは何もせずに終了します（エラーにはなりません）。
 *
 * ■ 計測しているイベント
 *   job_detail_view        求人詳細ページの閲覧
 *   entry_form_start       応募フォームの入力開始
 *   entry_form_submit      応募フォームの送信完了
 *   tel_tap                電話番号のタップ
 *   instagram_tap          Instagramリンクのタップ
 *   business_contact_start 法人問い合わせフォームの入力開始
 *   business_contact_submit 法人問い合わせフォームの送信完了
 *   job_to_entry           求人ページから応募フォームへの遷移
 *   column_to_job          コラムから求人ページへの遷移
 */

export type AnalyticsEvent =
  | 'job_detail_view'
  | 'entry_form_start'
  | 'entry_form_submit'
  | 'tel_tap'
  | 'instagram_tap'
  | 'business_contact_start'
  | 'business_contact_submit'
  | 'job_to_entry'
  | 'column_to_job';

type GtagWindow = Window & {
  gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
};

export function trackEvent(name: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const gtag = (window as GtagWindow).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', name, params);
}
