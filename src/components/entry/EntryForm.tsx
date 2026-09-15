'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import {
  atLimitedOptions,
  entrySchema,
  experienceOptions,
  licenseOptions,
  startTimingOptions,
  vehicleOptions,
  workDaysOptions,
} from '@/lib/entry-schema';
import { socialLinks } from '@/data/site';
import { trackEvent } from '@/lib/analytics';

type FieldErrors = Record<string, string>;

const fieldClass =
  'w-full min-h-12 border border-line bg-white px-4 py-3 text-[0.9375rem] text-body transition-colors focus:border-ink';

/** 必須マーク付きのラベル */
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

export function EntryForm() {
  const router = useRouter();
  const formId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [missingEnv, setMissingEnv] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  /** 入力開始を1度だけ計測します */
  const handleFirstInput = () => {
    if (started) return;
    setStarted(true);
    trackEvent('entry_form_start');
  };

  const fid = (name: string) => `${formId}-${name}`;
  const describedBy = (name: string) => (errors[name] ? `${fid(name)}-error` : undefined);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // 送信中の二重送信を防ぐ
    if (submitting) return;

    setFormError(null);
    setMissingEnv([]);

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());

    // クライアント側の事前チェック（最終判断はサーバー側）
    const parsed = entrySchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setFormError('入力内容に不備があります。以下の項目をご確認ください。');
      document.getElementById('entry-form-status')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/entry', {
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
        document.getElementById('entry-form-status')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      trackEvent('entry_form_submit');
      // 送信が成功したときのみ完了ページへ遷移します
      router.push('/entry/thanks');
    } catch {
      setFormError(
        'ネットワークエラーにより送信できませんでした。通信環境をご確認のうえ、再度お試しください。',
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} onInput={handleFirstInput} noValidate className="space-y-8">
      {/* -------------------------- 送信結果のメッセージ -------------------------- */}
      <div id="entry-form-status" aria-live="polite">
        {formError && (
          <div className="border-l-4 border-ink bg-mist p-6">
            <p className="text-sm font-bold text-ink">{formError}</p>

            {missingEnv.length > 0 && (
              <div className="mt-5 border-t border-line pt-5">
                <p className="text-xs font-bold text-ink">
                  ▼ サイト管理者の方へ：以下の環境変数が未設定です
                </p>
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

            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center text-sm font-bold text-ink underline decoration-jungle decoration-2 underline-offset-4"
            >
              Instagramのダイレクトメッセージで連絡する
            </a>
          </div>
        )}
      </div>

      {/* ----------------------------- 基本情報 ----------------------------- */}
      <fieldset className="border-t-2 border-ink pt-8">
        <legend className="display bg-white pr-4 text-xs tracking-[0.2em] text-jungle-deep">Basic</legend>

        <div className="space-y-7">
          <div>
            <FieldLabel htmlFor={fid('name')} required>
              お名前
            </FieldLabel>
            <input
              id={fid('name')}
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy('name')}
              className={fieldClass}
              placeholder="山田 太郎"
            />
            <ErrorText id={`${fid('name')}-error`} message={errors.name} />
          </div>

          <div>
            <FieldLabel htmlFor={fid('kana')} required hint="ひらがなでご入力ください">
              ふりがな
            </FieldLabel>
            <input
              id={fid('kana')}
              name="kana"
              type="text"
              required
              aria-invalid={Boolean(errors.kana)}
              aria-describedby={describedBy('kana')}
              className={fieldClass}
              placeholder="やまだ たろう"
            />
            <ErrorText id={`${fid('kana')}-error`} message={errors.kana} />
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
                placeholder="09012345678"
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
                placeholder="example@example.com"
              />
              <ErrorText id={`${fid('email')}-error`} message={errors.email} />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor={fid('city')} required hint="例：明石市、神戸市西区">
              お住まいの市区町村
            </FieldLabel>
            <input
              id={fid('city')}
              name="city"
              type="text"
              autoComplete="address-level2"
              required
              aria-invalid={Boolean(errors.city)}
              aria-describedby={describedBy('city')}
              className={fieldClass}
              placeholder="明石市"
            />
            <ErrorText id={`${fid('city')}-error`} message={errors.city} />
          </div>
        </div>
      </fieldset>

      {/* ----------------------------- 免許・車両 ---------------------------- */}
      <fieldset className="border-t-2 border-ink pt-8">
        <legend className="display bg-white pr-4 text-xs tracking-[0.2em] text-jungle-deep">License & Vehicle</legend>

        <div className="space-y-7">
          <div>
            <FieldLabel htmlFor={fid('license')} required>
              普通自動車免許の有無
            </FieldLabel>
            <select
              id={fid('license')}
              name="license"
              required
              defaultValue=""
              aria-invalid={Boolean(errors.license)}
              aria-describedby={describedBy('license')}
              className={fieldClass}
            >
              <option value="" disabled>
                選択してください
              </option>
              {licenseOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ErrorText id={`${fid('license')}-error`} message={errors.license} />
          </div>

          <div>
            <FieldLabel htmlFor={fid('atLimited')} required hint="AT限定の場合、ご用意できる車両の条件が変わる場合があります">
              AT限定かどうか
            </FieldLabel>
            <select
              id={fid('atLimited')}
              name="atLimited"
              required
              defaultValue=""
              aria-invalid={Boolean(errors.atLimited)}
              aria-describedby={describedBy('atLimited')}
              className={fieldClass}
            >
              <option value="" disabled>
                選択してください
              </option>
              {atLimitedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ErrorText id={`${fid('atLimited')}-error`} message={errors.atLimited} />
          </div>

          <div>
            <FieldLabel htmlFor={fid('vehicle')} required>
              配送用車両の有無
            </FieldLabel>
            <select
              id={fid('vehicle')}
              name="vehicle"
              required
              defaultValue=""
              aria-invalid={Boolean(errors.vehicle)}
              aria-describedby={describedBy('vehicle')}
              className={fieldClass}
            >
              <option value="" disabled>
                選択してください
              </option>
              {vehicleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ErrorText id={`${fid('vehicle')}-error`} message={errors.vehicle} />
          </div>
        </div>
      </fieldset>

      {/* ----------------------------- 希望条件 ----------------------------- */}
      <fieldset className="border-t-2 border-ink pt-8">
        <legend className="display bg-white pr-4 text-xs tracking-[0.2em] text-jungle-deep">Preference</legend>

        <div className="space-y-7">
          <div>
            <FieldLabel htmlFor={fid('preferredArea')} hint="例：明石市周辺、神戸市西区周辺">
              希望する勤務地
            </FieldLabel>
            <input
              id={fid('preferredArea')}
              name="preferredArea"
              type="text"
              aria-invalid={Boolean(errors.preferredArea)}
              aria-describedby={describedBy('preferredArea')}
              className={fieldClass}
              placeholder="明石市周辺"
            />
            <ErrorText id={`${fid('preferredArea')}-error`} message={errors.preferredArea} />
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={fid('workDays')} required>
                希望する稼働日数
              </FieldLabel>
              <select
                id={fid('workDays')}
                name="workDays"
                required
                defaultValue=""
                aria-invalid={Boolean(errors.workDays)}
                aria-describedby={describedBy('workDays')}
                className={fieldClass}
              >
                <option value="" disabled>
                  選択してください
                </option>
                {workDaysOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorText id={`${fid('workDays')}-error`} message={errors.workDays} />
            </div>

            <div>
              <FieldLabel htmlFor={fid('startTiming')} required>
                稼働開始希望時期
              </FieldLabel>
              <select
                id={fid('startTiming')}
                name="startTiming"
                required
                defaultValue=""
                aria-invalid={Boolean(errors.startTiming)}
                aria-describedby={describedBy('startTiming')}
                className={fieldClass}
              >
                <option value="" disabled>
                  選択してください
                </option>
                {startTimingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorText id={`${fid('startTiming')}-error`} message={errors.startTiming} />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor={fid('experience')} required>
              配送経験の有無
            </FieldLabel>
            <select
              id={fid('experience')}
              name="experience"
              required
              defaultValue=""
              aria-invalid={Boolean(errors.experience)}
              aria-describedby={describedBy('experience')}
              className={fieldClass}
            >
              <option value="" disabled>
                選択してください
              </option>
              {experienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ErrorText id={`${fid('experience')}-error`} message={errors.experience} />
          </div>

          <div>
            <FieldLabel
              htmlFor={fid('message')}
              hint="応募を決めていない段階のご相談も歓迎しています。気になっている点をご記入ください"
            >
              ご質問・ご相談内容
            </FieldLabel>
            <textarea
              id={fid('message')}
              name="message"
              rows={6}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy('message')}
              className={`${fieldClass} resize-y`}
              placeholder="報酬の計算方法について詳しく知りたいです。"
            />
            <ErrorText id={`${fid('message')}-error`} message={errors.message} />
          </div>
        </div>
      </fieldset>

      {/* ハニーポット：スクリーンリーダーからも隠し、自動入力を無効化 */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={fid('company')}>会社名（入力しないでください）</label>
        <input id={fid('company')} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* ------------------------------ 同意 ------------------------------ */}
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
              <Link href="/privacy" className="font-bold text-ink underline decoration-jungle decoration-2 underline-offset-4">
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
          {submitting ? '送信中です…' : '応募内容を送信する'}
        </button>

        <p className="mt-5 text-xs leading-6 text-body/60">
          送信後、担当者よりご連絡を差し上げます。ご連絡までにお時間をいただく場合があります。
        </p>
      </div>
    </form>
  );
}
