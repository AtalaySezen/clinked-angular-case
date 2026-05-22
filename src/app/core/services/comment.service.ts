import { Injectable, Inject, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Comment, CreateCommentDto } from '../models/comment.model';
import { ENVIRONMENT, Environment } from '../../../environments/environment.token';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly http = inject(HttpClient);

  readonly commentCreated$ = new Subject<void>();

  constructor(@Inject(ENVIRONMENT) private environment: Environment) { }

  getCommentsByArticleId(articleId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.environment.apiUrl}/comments?articleId=${articleId}`);
  }

  createComment(dto: CreateCommentDto): Observable<Comment> {
    return this.http.post<Comment>(`${this.environment.apiUrl}/comments`, dto).pipe(
      tap(() => this.commentCreated$.next()),
    );
  }
}
