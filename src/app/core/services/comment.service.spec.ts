import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { ENVIRONMENT } from '../../../environments/environment.token';

const mockEnvironment = { production: false, apiUrl: 'http://localhost:3001' };

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ENVIRONMENT, useValue: mockEnvironment },
      ],
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should emit commentCreated$ with the correct articleId after createComment', () => {
    const emitted: { articleId: string }[] = [];
    service.commentCreated$.subscribe((event) => emitted.push(event));

    const dto = { articleId: '42', content: 'Nice!', createdAt: '2026-01-01T00:00:00.000Z' };
    service.createComment(dto).subscribe();

    const req = httpMock.expectOne(`${mockEnvironment.apiUrl}/comments`);
    req.flush({ id: '1', ...dto });

    expect(emitted).toHaveLength(1);
    expect(emitted[0].articleId).toBe('42');
  });
});
