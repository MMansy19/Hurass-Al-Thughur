export interface ArticleInterface {
  id: number;
  created_at: string;
  lang: 'ar' | 'en';
  author: string;
  title: string;
  excerpt: string;
  content: string;
}

export interface MultiLanguageText {
  ar: string;
  en: string;
}

export interface ArticlePageParamsInterface {
  articleId: string;
  locale: string;
}
