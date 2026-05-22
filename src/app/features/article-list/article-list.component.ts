import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, signal, computed, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ArticleService } from '../../core/services/article.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExcerptPipe } from '../../shared/pipes/excerpt.pipe';
import { ReadTimePipe } from '../../shared/pipes/read-time.pipe';
import { MatButtonModule } from '@angular/material/button';
import { Article } from '../../core/models/article.model';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
    ExcerptPipe,
    ReadTimePipe,
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ArticleListComponent implements OnInit {
  private readonly articleService = inject(ArticleService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly articles = signal<Article[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly searchQuery = signal('');
  readonly filteredArticles = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.articles()
      .filter((a) => a.title.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  });
  readonly searchControl = new FormControl('');

  ngOnInit(): void {
    this.loadArticles();
    this.listenToSearch();
  }

  private loadArticles(): void {
    this.articleService.getArticles().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (articles) => {
        this.articles.set(articles);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      },
    });
  }

  private listenToSearch(): void {
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => this.searchQuery.set(query ?? ''));
  }

  isNew(publishedDate: string): boolean {
    return Date.now() - new Date(publishedDate).getTime() < 24 * 60 * 60 * 1000;
  }

  goToArticle(id: string): void {
    this.router.navigate(['/article', id]);
  }
}
