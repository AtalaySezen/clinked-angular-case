export interface Comment {
  id: string;
  articleId: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentDto {
  articleId: string;
  content: string;
  createdAt: string;
}
