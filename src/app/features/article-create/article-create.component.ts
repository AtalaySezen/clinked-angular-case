import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';

function quillRequiredValidator(control: AbstractControl): ValidationErrors | null {
  const html: string = control.value ?? '';
  const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  return text.length > 0 ? null : { required: true };
}
import { ArticleService } from '../../core/services/article.service';
import { ArticleCategory } from '../../core/models/article.model';
import { HasUnsavedChanges } from '../../core/guards/unsaved-changes.guard';

interface ArticleForm {
  title: FormControl<string>;
  content: FormControl<string>;
  category: FormControl<ArticleCategory | null>;
}

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatIconModule,
    QuillModule],
  templateUrl: './article-create.component.html',
  styleUrl: './article-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCreateComponent implements HasUnsavedChanges {
  private articleService = inject(ArticleService);
  private router = inject(Router);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  submitted: boolean = false;
  form = new FormGroup<ArticleForm>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(101)],
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [quillRequiredValidator],
    }),
    category: new FormControl<ArticleCategory | null>(null),
  });
  readonly quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: [2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'link'],
      ['clean'],
    ],
  };


  readonly categories: { value: ArticleCategory; label: string }[] = [
    { value: 'Cats', label: 'Cats' },
    { value: 'Dogs', label: 'Dogs' },
    { value: 'NotFunny', label: 'Not Funny' },
  ];


  hasUnsavedChanges(): boolean {
    return this.form.dirty && !this.submitted;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { title, content, category } = this.form.getRawValue();
    const payload = {
      title,
      content,
      ...(category ? { category } : {}),
      publishedDate: new Date().toISOString(),
    };
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.articleService.createArticle(payload).subscribe({
      next: () => {
        this.submitted = true;
        this.router.navigate(['/']);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.isSubmitting.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
