export interface ArticleInterface {
  id: number;
  created_at: string;
  author: string;
  title: MultiLanguageText;
  excerpt: MultiLanguageText;
  content: MultiLanguageText;
}

export interface MultiLanguageText {
  ar: string;
  en: string;
}

export interface ArticlePageParamsInterface {
  articleId: string;
  locale: string;
}
