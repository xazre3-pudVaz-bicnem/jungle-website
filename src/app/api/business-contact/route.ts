import { NextResponse } from 'next/server';
import {
  businessContactSchema,
  cargoTypeOptions,
  frequencyOptions,
  labelOf,
  volumeOptions,
} from '@/lib/business-contact-schema';

/**
 * 法人向け配送依頼フォームの送信先。
 * ドライバー応募（/api/entry）とは別の窓口として、件名を分けて通知します。
 *
 * ■ メール送信について
 *   Resend の REST API を使用します。必要な環境変数は応募フォームと共通です。
 *     - RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL
 *   BUSINESS_CONTACT_TO_EMAIL を設定すると、法人問い合わせのみ別アドレスへ送れます。
 *
 *   環境変数が未設定でもビルドは失敗しません。
 *   未設定の状態で送信された場合は「送信できなかったこと」と
 *   「設定が必要な環境変数」を返し、架空の送信成功は返しません。
 */

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: '送信内容を読み取れませんでした。' }, { status: 400 });
  }

  const parsed = businessContactSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, message: '入力内容をご確認ください。', fieldErrors }, { status: 400 });
  }

  const data = parsed.data;

  // ハニーポット：値が入っていれば自動送信とみなして静かに終了
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const toEmail = process.env.BUSINESS_CONTACT_TO_EMAIL || process.env.CONTACT_TO_EMAIL;
  const missingEnv: string[] = [];
  if (!process.env.RESEND_API_KEY) missingEnv.push('RESEND_API_KEY');
  if (!process.env.CONTACT_FROM_EMAIL) missingEnv.push('CONTACT_FROM_EMAIL');
  if (!toEmail) missingEnv.push('CONTACT_TO_EMAIL（または BUSINESS_CONTACT_TO_EMAIL）');

  if (missingEnv.length > 0) {
    console.error(`[business-contact] メール送信設定が未完了です。未設定: ${missingEnv.join(', ')}`);
    return NextResponse.json(
      {
        ok: false,
        code: 'MAIL_NOT_CONFIGURED',
        message:
          '現在、フォームからの送信を受け付けられない状態です。お手数ですが、お電話またはInstagramのダイレクトメッセージよりご連絡ください。',
        missingEnv,
      },
      { status: 503 },
    );
  }

  const rows: [string, string][] = [
    ['会社名', data.companyName],
    ['ご担当者名', data.personName],
    ['電話番号', data.tel],
    ['メールアドレス', data.email],
    ['荷物の種類', labelOf(cargoTypeOptions, data.cargoType)],
    ['荷物の詳細', data.cargoDetail || '（未記入）'],
    ['集荷場所', data.pickupLocation],
    ['配送先エリア', data.deliveryArea],
    ['荷物量', labelOf(volumeOptions, data.volume)],
    ['定期／スポット', labelOf(frequencyOptions, data.frequency)],
    ['希望日・開始時期', data.preferredDate || '（未記入）'],
    ['ご相談内容', data.message || '（未記入）'],
  ];

  const html = `
    <h2>JUNGLE TRANSPORT 法人向け配送のご依頼</h2>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><th align="left" style="background:#f5f5f3;white-space:nowrap">${escapeHtml(label)}</th><td>${escapeHtml(
              value,
            ).replace(/\n/g, '<br>')}</td></tr>`,
        )
        .join('')}
    </table>
  `;
  const text = rows.map(([label, value]) => `${label}：${value}`).join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [toEmail],
        reply_to: data.email,
        subject: `【法人】配送のご依頼｜${data.companyName}（${data.personName} 様）`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(`[business-contact] Resend APIエラー (${response.status}): ${detail}`);
      return NextResponse.json(
        {
          ok: false,
          message:
            '送信処理に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、お電話にてご連絡ください。',
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error('[business-contact] メール送信に失敗しました', error);
    return NextResponse.json(
      {
        ok: false,
        message:
          '送信処理に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、お電話にてご連絡ください。',
      },
      { status: 502 },
    );
  }

  // 実際に送信が成功した場合のみ ok: true を返します
  return NextResponse.json({ ok: true });
}
