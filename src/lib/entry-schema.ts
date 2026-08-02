import { z } from 'zod';

/**
 * 応募フォームのバリデーション定義。
 * クライアント・サーバーの両方でこの定義を使用します（サーバー側の検証が最終判断です）。
 */

const required = (label: string) => `${label}を入力してください`;

export const licenseOptions = [
  { value: 'yes', label: '普通自動車免許を持っている' },
  { value: 'planned', label: '取得予定・取得中' },
  { value: 'no', label: '持っていない' },
] as const;

export const atLimitedOptions = [
  { value: 'no', label: 'AT限定ではない（MT可）' },
  { value: 'yes', label: 'AT限定' },
  { value: 'unknown', label: 'わからない・免許なし' },
] as const;

export const vehicleOptions = [
  { value: 'have', label: '配送に使える車両を持っている' },
  { value: 'none', label: '持っていない（リースを相談したい）' },
  { value: 'undecided', label: '検討中・相談したい' },
] as const;

export const workDaysOptions = [
  { value: 'weekdays5', label: '週5日程度' },
  { value: 'days3to4', label: '週3〜4日程度' },
  { value: 'days1to2', label: '週1〜2日程度' },
  { value: 'consult', label: '相談したい' },
] as const;

export const startTimingOptions = [
  { value: 'asap', label: 'すぐにでも' },
  { value: 'within1m', label: '1か月以内' },
  { value: 'within3m', label: '3か月以内' },
  { value: 'undecided', label: '未定・まずは話を聞きたい' },
] as const;

export const experienceOptions = [
  { value: 'none', label: '配送の経験はない' },
  { value: 'light', label: '軽貨物配送の経験がある' },
  { value: 'other', label: '配送以外の運転業務の経験がある' },
] as const;

const valuesOf = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value) as [string, ...string[]];

export const entrySchema = z.object({
  name: z.string().trim().min(1, required('お名前')).max(60, 'お名前は60文字以内でご入力ください'),
  kana: z
    .string()
    .trim()
    .min(1, required('ふりがな'))
    .max(60, 'ふりがなは60文字以内でご入力ください')
    .regex(/^[ぁ-んー\s　]+$/, 'ふりがなは、ひらがなでご入力ください'),
  tel: z
    .string()
    .trim()
    .min(1, required('電話番号'))
    .regex(/^[0-9０-９\-ー\s()（）+]+$/, '電話番号は数字とハイフンでご入力ください')
    .refine((value) => value.replace(/\D/g, '').length >= 10, {
      message: '電話番号は10桁以上でご入力ください',
    }),
  email: z.string().trim().min(1, required('メールアドレス')).email('メールアドレスの形式をご確認ください'),
  city: z.string().trim().min(1, required('お住まいの市区町村')).max(60, '60文字以内でご入力ください'),
  license: z.enum(valuesOf(licenseOptions), { message: '普通自動車免許の有無をお選びください' }),
  atLimited: z.enum(valuesOf(atLimitedOptions), { message: 'AT限定かどうかをお選びください' }),
  vehicle: z.enum(valuesOf(vehicleOptions), { message: '配送用車両の有無をお選びください' }),
  preferredArea: z.string().trim().max(100, '100文字以内でご入力ください').optional().or(z.literal('')),
  workDays: z.enum(valuesOf(workDaysOptions), { message: '希望する稼働日数をお選びください' }),
  startTiming: z.enum(valuesOf(startTimingOptions), { message: '稼働開始の希望時期をお選びください' }),
  experience: z.enum(valuesOf(experienceOptions), { message: '配送経験の有無をお選びください' }),
  message: z.string().trim().max(2000, 'ご相談内容は2000文字以内でご入力ください').optional().or(z.literal('')),
  privacy: z.literal('agree', { message: 'プライバシーポリシーへの同意が必要です' }),
  /**
   * スパム対策のハニーポット。人間が入力することはない項目。
   * ここでは検証エラーにせず素通しし、サーバー側（api/entry）で値の有無を判定して
   * 自動送信とみなした場合は静かに終了します。
   * （検証エラーにすると、ボットにこの項目の存在を知らせてしまうため）
   */
  company: z.string().optional(),
});

export type EntryInput = z.infer<typeof entrySchema>;

/** 選択値を日本語ラベルへ変換（管理者宛メール本文で使用） */
export const labelOf = (options: readonly { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value;
