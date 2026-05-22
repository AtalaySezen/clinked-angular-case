export type ArticleCategory = 'Cats' | 'Dogs' | 'NotFunny';

export interface Article {
  id: string;
  title: string;
  content: string;
  category?: ArticleCategory;
  publishedDate: string;
}

export interface CreateArticleDto {
  title: string;
  content: string;
  category?: ArticleCategory;
  publishedDate: string;
}
