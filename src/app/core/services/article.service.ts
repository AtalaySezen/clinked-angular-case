import { Injectable, Inject, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article, CreateArticleDto } from '../models/article.model';
import { ENVIRONMENT, Environment } from '../../../environments/environment.token';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly http = inject(HttpClient);

  constructor(@Inject(ENVIRONMENT) private environment: Environment) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.environment.apiUrl}/articles`);
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.environment.apiUrl}/articles/${id}`);
  }

  createArticle(dto: CreateArticleDto): Observable<Article> {
    return this.http.post<Article>(`${this.environment.apiUrl}/articles`, dto);
  }
}
