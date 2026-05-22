import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CreateCommentDto } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly apiUrl = 'http://localhost:3001/comments';

  constructor(private http: HttpClient) {}

  getCommentsByArticleId(articleId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?articleId=${articleId}`);
  }

  createComment(dto: CreateCommentDto): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, dto);
  }
}
