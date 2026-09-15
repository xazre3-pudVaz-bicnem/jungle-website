'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import {
  businessContactSchema,
  cargoTypeOptions,
  frequencyOptions,
  volumeOptions,
} from '@/lib/business-contact-schema';
import { socialLinks } from '@/data/site';
import { trackEvent } from '@/lib/analytics';

type FieldErrors = Record<string, string>;

const fieldClass =
  'w-full min-h-12 border border-line bg-white px-4 py-3 text-[0.9375rem] text-body transition-colors focus:border-ink';

function FieldLabel({
  htmlFor,
  children,
  required = false,
  hint,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-2.5">
      <label htmlFor={htmlFor} className="text-sm font-bold text-ink">
        {children}
        {required ? (
          <span className="ml-2 bg-jungle px-2 py-0.5 text-[0.6875rem] font-bold text-ink">必須</span>
        ) : (
          <span className="ml-2 border border-line px-2 py-0.5 text-[0.6875rem] font-bold text-body/50">任意</span>
        )}
      </label>
      {hint && <p className="mt-1.5 text-xs leading-6 text-body/60">{hint}</p>}
    </div>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 border-l-4 border-ink bg-mist px-3 py-2 text-xs font-bold text-ink">
      {message}
    </p>
  );
}

export function BusinessContactForm() {
  const router = useRouter();
  const formId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [missingEnv, setMissingEnv] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  const fid = (name: string) => `${formId}-${name}`;
  const describedBy = (name: string) => (errors[name] ? `${fid(name)}-error` : undefined);

  /** 入力開始を1度だけ計測します */
  const handleFirstInput = () => {
    if (started) return;
    setStarted(true);
    trackEvent('business_contact_start');
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setFormError(null);
    setMissingEnv([]);

    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const parsed = businessContactSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setFormError('入力内容に不備があります。以下の項目をご確認ください。');
      document.getElementById('business-form-status')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/business-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError(result.message ?? '送信に失敗しました。時間をおいて再度お試しください。');
        if (Array.isArray(result.missingEnv)) setMissingEnv(result.missingEnv);
        setSubmitting(false);
        document.getElementById('business-form-status')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      trackEvent('business_contact_submit');
      // 送信が成功したときのみ完了ページへ遷移します
      router.push('/contact/business/thanks');
    } catch {
      setFormError('ネットワークエラーにより送信できませんでした。通信環境をご確認のうえ、再度お試しください。');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} onInput={handleFirstInput} noValidate className="space-y-8">
      <div id="business-form-status" aria-live="polite">
        {formError && (
          <div className="border-l-4 border-ink bg-mist p-6">
            <p className="text-sm font-bold text-ink">{formError}</p>

            {missingEnv.length > 0 && (
              <div className="mt-5 border-t border-line pt-5">
                <p className="text-xs font-bold text-ink">▼ サイト管理者の方へ：以下の環境変数が未設定です</p>
                <ul className="mt-3 space-y-1.5">
                  {missingEnv.map((key) => (
                    <li key={key} className="font-mono text-xs text-body">
                      {key}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-6 text-body/70">
                  Vercelのプロジェクト設定、またはローカルの .env.local に設定してください。設定方法はREADMEに記載しています。
                </p>
              </div>
            )}

            {socialLinks.tel && (
              <a
                href={`tel:${socialLinks.tel.replace(/-/g, '')}`}
                className="mt-5 inline-flex min-h-11 items-center text-sm font-bold text-ink underline decoration-jungle decoration-2 underline-offset-4"
              >
                お電話でご連絡（{socialLinks.tel}）
              </a>
            )}
          </div>
        )}
      </div>

      {/* ----------------------------- 会社・担当者 ----------------------------- */}
      <fieldset className="border-t-2 border-ink pt-8">
        <legend className="display bg-white pr-4 text-xs tracking-[0.2em] text-jungle-deep">Company</legend>
        <div className="space-y-7">
          <div>
            <FieldLabel htmlFor={fid('companyName')} required>
              会社名
            </FieldLabel>
            <input
              id={fid('companyName')}
              name="companyName"
              type="text"
              autoComplete="organization"
              required
              aria-invalid={Boolean(errors.companyName)}
              aria-describedby={describedBy('companyName')}
              className={fieldClass}
              placeholder="株式会社〇〇"
            />
            <ErrorText id={`${fid('companyName')}-error`} message={errors.companyName} />
          </div>

          <div>
            <FieldLabel htmlFor={fid('personName')} required>
              ご担当者名
            </FieldLabel>
            <input
              id={fid('personName')}
              name="personName"
              type="text"
              autoComplete="name"
              required
              aria-invalid={Boolean(errors.personName)}
              aria-describedby={describedBy('personName')}
              className={fieldClass}
              placeholder="山田 太郎"
            />
            <ErrorText id={`${fid('personName')}-error`} message={errors.personName} />
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={fid('tel')} required>
                電話番号
              </FieldLabel>
              <input
                id={fid('tel')}
                name="tel"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                aria-invalid={Boolean(errors.tel)}
                aria-describedby={describedBy('tel')}
                className={fieldClass}
                placeholder="0789999999"
              />
              <ErrorText id={`${fid('tel')}-error`} message={errors.tel} />
            </div>
            <div>
              <FieldLabel htmlFor={fid('email')} required>
                メールアドレス
              </FieldLabel>
              <input
                id={fid('email')}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy('email')}
                className={fieldClass}
                placeholder="example@example.co.jp"
              />
              <ErrorText id={`${fid('email')}-error`} message={errors.email} />
            </div>
          </div>
        </div>
      </fieldset>

      {/* ------------------------------ 配送の内容 ------------------------------ */}
      <fieldset className="border-t-2 border-ink pt-8">
        <legend className="display bg-white pr-4 text-xs tracking-[0.2em] text-jungle-deep">Delivery</legend>
        <div className="space-y-7">
          <div>
            <FieldLabel htmlFor={fid('cargoType')} required>
              荷物の種類
            </FieldLabel>
            <select
              id={fid('cargoType')}
              name="cargoType"
              required
              defaultValue=""
              aria-invalid={Boolean(errors.cargoType)}
              aria-describedby={describedBy('cargoType')}
              className={fieldClass}
            >
              <option value="" disabled>
                選択してください
              </option>
              {cargoTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ErrorText id={`${fid('cargoType')}-error`} message={errors.cargoType} />
          </div>

          <div>
            <FieldLabel htmlFor={fid('cargoDetail')} hint="サイズ・重量の目安があればご記入ください">
              荷物の詳細
            </FieldLabel>
            <input
              id={fid('cargoDetail')}
              name="cargoDetail"
              type="text"
              aria-invalid={Boolean(errors.cargoDetail)}
              aria-describedby={describedBy('cargoDetail')}
              className={fieldClass}
              placeholder="60サイズの段ボール／1個あたり5kg程度"
            />
            <ErrorText id={`${fid('cargoDetail')}-error`} message={errors.cargoDetail} />
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={fid('pickupLocation')} required>
                集荷場所
              </FieldLabel>
              <input
                id={fid('pickupLocation')}
                name="pickupLocation"
                type="text"
                required
                aria-invalid={Boolean(errors.pickupLocation)}
                aria-describedby={describedBy('pickupLocation')}
                className={fieldClass}
                placeholder="兵庫県明石市〇〇"
              />
              <ErrorText id={`${fid('pickupLocation')}-error`} message={errors.pickupLocation} />
            </div>
            <div>
              <FieldLabel htmlFor={fid('deliveryArea')} required>
                配送先エリア
              </FieldLabel>
              <input
                id={fid('deliveryArea')}
                name="deliveryArea"
                type="text"
                required
                aria-invalid={Boolean(errors.deliveryArea)}
                aria-describedby={describedBy('deliveryArea')}
                className={fieldClass}
                placeholder="明石市内／神戸市西区"
              />
              <ErrorText id={`${fid('deliveryArea')}-error`} message={errors.deliveryArea} />
            </div>
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={fid('volume')} required>
                荷物量の目安
              </FieldLabel>
              <select
                id={fid('volume')}
                name="volume"
                required
                defaultValue=""
                aria-invalid={Boolean(errors.volume)}
                aria-describedby={describedBy('volume')}
                className={fieldClass}
              >
                <option value="" disabled>
                  選択してください
                </option>
                {volumeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ErrorText id={`${fid('volume')}-error`} message={errors.volume} />
            </div>
            <div>
              <FieldLabel htmlFor={fid('frequency')} required>
                定期／スポット
              </FieldLabel>
              <select
                id={fid('frequency')}
                name="frequency"
                required
                defaultValue=""
                aria-invalid={Boolean(errors.frequency)}
                aria-describedby={describedBy('frequency')}
                className={fieldClass}
              >
                <option value="" disabled>
                  選択してください
                </option>
                {frequencyOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ErrorText id={`${fid('frequency')}-error`} message={errors.frequency} />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor={fid('preferredDate')} hint="開始したい時期や、配送を希望する日をご記入ください">
              希望日・開始時期
            </FieldLabel>
            <input
              id={fid('preferredDate')}
              name="preferredDate"
              type="text"
              aria-invalid={Boolean(errors.preferredDate)}
              aria-describedby={describedBy('preferredDate')}
              className={fieldClass}
              placeholder="来月から／〇月〇日"
            />
            <ErrorText id={`${fid('preferredDate')}-error`} message={errors.preferredDate} />
          </div>

          <div>
            <FieldLabel htmlFor={fid('message')} hint="対応可否のご相談だけでも承ります">
              ご相談内容
            </FieldLabel>
            <textarea
              id={fid('message')}
              name="message"
              rows={6}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy('message')}
              className={`${fieldClass} resize-y`}
              placeholder="週3回、店舗への商品配送をお願いできるか相談したいです。"
            />
            <ErrorText id={`${fid('message')}-error`} message={errors.message} />
          </div>
        </div>
      </fieldset>

      {/* ハニーポット */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={fid('website')}>ウェブサイト（入力しないでください）</label>
        <input id={fid('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* 同意 */}
      <div className="border-t-2 border-ink pt-8">
        <div className="bg-mist p-6">
          <div className="flex gap-3.5">
            <input
              id={fid('privacy')}
              name="privacy"
              type="checkbox"
              value="agree"
              required
              aria-invalid={Boolean(errors.privacy)}
              aria-describedby={describedBy('privacy')}
              className="mt-1 h-5 w-5 shrink-0 accent-ink"
            />
            <label htmlFor={fid('privacy')} className="text-sm leading-7 text-body">
              <Link
                href="/privacy"
                className="font-bold text-ink underline decoration-jungle decoration-2 underline-offset-4"
              >
                プライバシーポリシー
              </Link>
              に同意します
              <span className="ml-2 bg-jungle px-2 py-0.5 text-[0.6875rem] font-bold text-ink">必須</span>
            </label>
          </div>
          <ErrorText id={`${fid('privacy')}-error`} message={errors.privacy} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="mt-8 flex min-h-14 w-full items-center justify-center bg-jungle text-base font-bold text-ink transition-colors hover:bg-ink hover:text-jungle disabled:cursor-not-allowed disabled:bg-line disabled:text-body/50"
        >
          {submitting ? '送信中です…' : 'この内容で送信する'}
        </button>

        <p className="mt-5 text-xs leading-6 text-body/60">
          送信後、担当者よりご連絡を差し上げます。対応可否のご回答までにお時間をいただく場合があります。
        </p>
      </div>
    </form>
  );
}
