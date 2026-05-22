import { Component, OnInit, OnDestroy, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { CommentService } from '../../core/services/comment.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Article } from '../../core/models/article.model';
import { MatIconModule } from '@angular/material/icon';
import { filter, takeUntil } from 'rxjs/operators';
import { SecurityContext } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatIconModule, MatDividerModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ArticleDetailComponent implements OnInit, OnDestroy {
  private articleService = inject(ArticleService);
  private commentService = inject(CommentService);
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  isLoading = signal(true);
  errorMessage = signal('');
  article = signal<Article | null>(null);
  safeContent = signal<SafeHtml>('');
  commentCount = signal(0);
  panelOpen = signal(false);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    const id = this.getArticleId();
    this.loadArticle(id);
    this.loadCommentCount(id);
    this.listenForCommentCreated(id);
    this.syncPanelStateFromRoute();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getArticleId(): string {
    return this.route.snapshot.paramMap.get('id')!;
  }

  private loadArticle(articleId: string): void {
    this.articleService.getArticleById(articleId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (article) => {
        this.article.set(article);
        this.safeContent.set(this.sanitizer.sanitize(SecurityContext.HTML, article.content) ?? '');
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      },
    });
  }

  private loadCommentCount(articleId: string): void {
    this.commentService
      .getCommentsByArticleId(articleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((comments) => this.commentCount.set(comments.length));
  }

  private listenForCommentCreated(articleId: string): void {
    this.commentService.commentCreated$
      .pipe(filter((event) => event.articleId === articleId), takeUntil(this.destroy$))
      .subscribe(() => this.loadCommentCount(articleId));
  }

  private syncPanelStateFromRoute(): void {
    this.route.children.forEach((child) => {
      if (child.outlet === 'side-panel') this.panelOpen.set(true);
    });
  }

  toggleComments(): void {
    const id = this.getArticleId();
    if (this.panelOpen()) {
      this.router.navigate(['/article', id]);
      this.panelOpen.set(false);
    } else {
      this.router.navigate(['/article', id, { outlets: { 'side-panel': ['comments'] } }]);
      this.panelOpen.set(true);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
