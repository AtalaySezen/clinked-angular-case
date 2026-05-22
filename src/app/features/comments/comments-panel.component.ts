import { Component, OnInit, OnDestroy, signal, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';

import { CommentService } from '../../core/services/comment.service';
import { Comment } from '../../core/models/comment.model';

@Component({
  selector: 'app-comments-panel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
  ],
  templateUrl: './comments-panel.component.html',
  styleUrl: './comments-panel.component.scss',
})
export class CommentsPanelComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly commentService = inject(CommentService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly destroy$ = new Subject<void>();

  safeComments = signal<{ comment: Comment; safeContent: SafeHtml }[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal('');

  commentControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  articleId = '';

  ngOnInit(): void {
    this.articleId = this.route.pathFromRoot
      .map((r) => r.snapshot.paramMap.get('id'))
      .find((id) => !!id) ?? '';
    this.loadComments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadComments(): void {
    this.isLoading.set(true);
    this.commentService.getCommentsByArticleId(this.articleId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (comments) => {
        this.safeComments.set(
          comments.map((c) => ({
            comment: c,
            safeContent: this.sanitizer.sanitize(SecurityContext.HTML, c.content) ?? '',
          })),
        );
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  close(): void {
    this.router.navigate(['/article', this.articleId]);
  }

  submitComment(): void {
    this.commentControl.markAsTouched();
    if (this.commentControl.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const dto = {
      articleId: this.articleId,
      content: (this.commentControl.value ?? '').trim(),
      createdAt: new Date().toISOString(),
    };

    this.commentService.createComment(dto).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.commentControl.reset('');
        this.isSubmitting.set(false);
        this.loadComments();
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.isSubmitting.set(false);
      },
    });
  }
}
