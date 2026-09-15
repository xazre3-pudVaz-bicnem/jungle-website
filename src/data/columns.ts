/**
 * 採用コラム。
 *
 * ■ 記事の追加方法
 *   src/data/columns/ 配下のファイルに Column オブジェクトを追加し、
 *   下部の columns 配列に含めるだけで、一覧ページ・詳細ページ・サイトマップ・
 *   Article構造化データが自動生成されます。
 *
 * ■ 執筆ルール
 *   - 一般論とJUNGLEの募集条件を混同しない。
 *   - JUNGLEの条件として断定してよいのは、Instagramで確認できた事実のみ。
 *   - 検索キーワードだけを狙った内容の薄い記事は作らない。
 */

import { basicsColumns } from './columns/basics';
import { practicalColumns } from './columns/practical';

export type ColumnBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'note'; title: string; text: string }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'jobLink'; slug: string; text: string };

export type ColumnCategory = '仕事内容' | '未経験の方へ' | '契約・報酬' | '免許・車両' | '地域情報' | '応募のヒント';

export type Column = {
  slug: string;
  title: string;
  /** meta description に使用（120文字以内推奨） */
  description: string;
  category: ColumnCategory;
  /** ISO 8601 */
  publishedAt: string;
  updatedAt: string;
  /** リード文（記事冒頭・一覧カードに表示） */
  lead: string;
  /** 主軸キーワード（1記事1クエリで設計する） */
  primaryKeyword: string;
  /** 補助キーワード */
  secondaryKeywords: string[];
  /** 検索意図。固定ページとの役割分担を明確にするために記録します */
  searchIntent: string;
  /**
   * 記事内でJUNGLE固有の事実として書いている内容。
   * 一般論と自社情報を区別するための記録です。
   */
  verifiedFacts: string[];
  blocks: ColumnBlock[];
  /** 記事末尾に表示するFAQ（src/data/faq.ts の id） */
  faqIds: string[];
  /** 関連する求人の slug */
  relatedJobSlugs: string[];
  /** 関連記事の slug */
  relatedSlugs: string[];
};

/**
 * 記事の執筆・確認体制（E-E-A-T）。
 * 確認できない経歴は作らず、実際に行っていることだけを書いてください。
 */
export const columnAuthor = {
  name: 'JUNGLE TRANSPORT 採用担当',
  role: '軽貨物配送事業 採用担当',
  description:
    '兵庫県明石市・神戸市西区で軽貨物配送を行うJUNGLE TRANSPORTの採用担当です。宅配・企業配送の現場で実際に稼働しているドライバーの声と、応募者から実際にいただく質問をもとに記事を作成しています。',
  /** 著者ページのURL */
  url: '/authors/jungle-recruitment',
  /** 記事内容の確認者 */
  reviewedBy: 'JUNGLE TRANSPORT 運営',
} as const;

export const columns: Column[] = [...basicsColumns, ...practicalColumns];

export const getColumn = (slug: string) => columns.find((column) => column.slug === slug);

export const relatedColumns = (column: Column) =>
  column.relatedSlugs
    .map((slug) => columns.find((item) => item.slug === slug))
    .filter((item): item is Column => Boolean(item));

/** 記事本文からプレーンテキストを組み立てる（文字数カウント・要約用） */
export const columnPlainText = (column: Column) =>
  column.blocks
    .map((block) => {
      switch (block.type) {
        case 'p':
        case 'h2':
        case 'h3':
          return block.text;
        case 'ul':
        case 'ol':
          return block.items.join(' ');
        case 'note':
          return `${block.title} ${block.text}`;
        case 'table':
          return [...block.head, ...block.rows.flat()].join(' ');
        case 'jobLink':
          return block.text;
      }
    })
    .join('');
