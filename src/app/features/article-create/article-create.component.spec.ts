import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ArticleCreateComponent } from './article-create.component';
import { ENVIRONMENT } from '../../../environments/environment.token';

const mockEnvironment = { production: false, apiUrl: 'http://localhost:3001' };

describe('ArticleCreateComponent form validation', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCreateComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ENVIRONMENT, useValue: mockEnvironment },
      ],
    }).compileComponents();
  });

  it('should be invalid when title and content are empty', () => {
    const fixture = TestBed.createComponent(ArticleCreateComponent);
    const component = fixture.componentInstance;
    expect(component.form.invalid).toBe(true);
  });

  it('should have required error on title when empty', () => {
    const fixture = TestBed.createComponent(ArticleCreateComponent);
    const component = fixture.componentInstance;
    expect(component.form.controls.title.hasError('required')).toBe(true);
  });

  it('should have required error on content when empty', () => {
    const fixture = TestBed.createComponent(ArticleCreateComponent);
    const component = fixture.componentInstance;
    expect(component.form.controls.content.hasError('required')).toBe(true);
  });

  it('should have maxlength error on title when exceeding 101 characters', () => {
    const fixture = TestBed.createComponent(ArticleCreateComponent);
    const component = fixture.componentInstance;
    component.form.controls.title.setValue('a'.repeat(102));
    expect(component.form.controls.title.hasError('maxlength')).toBe(true);
  });

  it('should be valid when title and content are provided', () => {
    const fixture = TestBed.createComponent(ArticleCreateComponent);
    const component = fixture.componentInstance;
    component.form.controls.title.setValue('Valid Title');
    component.form.controls.content.setValue('Valid content');
    expect(component.form.valid).toBe(true);
  });

  it('should treat empty Quill HTML as required content error', () => {
    const fixture = TestBed.createComponent(ArticleCreateComponent);
    const component = fixture.componentInstance;
    component.form.controls.title.setValue('Valid Title');
    component.form.controls.content.setValue('<p><br></p>');
    expect(component.form.controls.content.hasError('required')).toBe(true);
    expect(component.form.valid).toBe(false);
  });

  it('should treat &nbsp;-only Quill HTML as required content error', () => {
    const fixture = TestBed.createComponent(ArticleCreateComponent);
    const component = fixture.componentInstance;
    component.form.controls.title.setValue('Valid Title');
    component.form.controls.content.setValue('<p>&nbsp;</p>');
    expect(component.form.controls.content.hasError('required')).toBe(true);
  });
});
