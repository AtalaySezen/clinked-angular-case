import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article, CreateArticleDto } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private readonly apiUrl = 'http://localhost:3001/articles';

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  createArticle(dto: CreateArticleDto): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, dto);
  }
}
