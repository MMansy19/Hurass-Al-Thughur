export interface ArticleInterface {
  id: number;
  created_at: string;
  lang: 'ar' | 'en';
  author: string;
  title: string;
  excerpt: string;
  content: string;
  user_id?: string; // Add user_id field for authorization
}

export interface MultiLanguageText {
  ar: string;
  en: string;
}

export interface ArticlePageParamsInterface {
  articleId: string;
  locale: string;
}
