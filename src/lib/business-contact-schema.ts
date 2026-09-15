import { z } from 'zod';

/**
 * 法人向け配送依頼フォームのバリデーション定義。
 * ドライバー応募フォーム（entry-schema.ts）とは目的が異なるため、別のスキーマにしています。
 */

const required = (label: string) => `${label}を入力してください`;

export const cargoTypeOptions = [
  { value: 'parcel', label: '小口の荷物（段ボールなど）' },
  { value: 'documents', label: '書類・封筒' },
  { value: 'parts', label: '部品・備品' },
  { value: 'products', label: '店舗向けの商品' },
  { value: 'other', label: 'その他' },
] as const;

export const frequencyOptions = [
  { value: 'regular', label: '定期的な配送を希望' },
  { value: 'spot', label: '単発（スポット）での配送を希望' },
  { value: 'undecided', label: '未定・まずは相談したい' },
] as const;

export const volumeOptions = [
  { value: 'small', label: '1日あたり数個程度' },
  { value: 'medium', label: '1日あたり10〜30個程度' },
  { value: 'large', label: '1日あたり30個以上' },
  { value: 'undecided', label: '未定・変動する' },
] as const;

const valuesOf = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value) as [string, ...string[]];

export const businessContactSchema = z.object({
  companyName: z.string().trim().min(1, required('会社名')).max(120, '120文字以内でご入力ください'),
  personName: z.string().trim().min(1, required('ご担当者名')).max(60, '60文字以内でご入力ください'),
  tel: z
    .string()
    .trim()
    .min(1, required('電話番号'))
    .regex(/^[0-9０-９\-ー\s()（）+]+$/, '電話番号は数字とハイフンでご入力ください')
    .refine((value) => value.replace(/\D/g, '').length >= 10, {
      message: '電話番号は10桁以上でご入力ください',
    }),
  email: z.string().trim().min(1, required('メールアドレス')).email('メールアドレスの形式をご確認ください'),
  cargoType: z.enum(valuesOf(cargoTypeOptions), { message: '荷物の種類をお選びください' }),
  cargoDetail: z.string().trim().max(300, '300文字以内でご入力ください').optional().or(z.literal('')),
  pickupLocation: z.string().trim().min(1, required('集荷場所')).max(200, '200文字以内でご入力ください'),
  deliveryArea: z.string().trim().min(1, required('配送先エリア')).max(200, '200文字以内でご入力ください'),
  volume: z.enum(valuesOf(volumeOptions), { message: '荷物量をお選びください' }),
  frequency: z.enum(valuesOf(frequencyOptions), { message: '定期かスポットかをお選びください' }),
  preferredDate: z.string().trim().max(60, '60文字以内でご入力ください').optional().or(z.literal('')),
  message: z.string().trim().max(2000, 'ご相談内容は2000文字以内でご入力ください').optional().or(z.literal('')),
  privacy: z.literal('agree', { message: 'プライバシーポリシーへの同意が必要です' }),
  /**
   * スパム対策のハニーポット。
   * 検証エラーにはせず、サーバー側で値の有無を見て静かに終了します。
   */
  website: z.string().optional(),
});

export type BusinessContactInput = z.infer<typeof businessContactSchema>;

export const labelOf = (options: readonly { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value;
