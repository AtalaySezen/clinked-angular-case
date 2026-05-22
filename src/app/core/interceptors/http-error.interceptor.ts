import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

function getErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Cannot reach the server. Please make sure the API is running.';
  }
  if (error.status === 404) {
    return 'The requested resource was not found.';
  }
  if (error.status >= 500) {
    return 'A server error occurred. Please try again later.';
  }
  return 'An unexpected error occurred. Please try again.';
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = getErrorMessage(error);
      return throwError(() => new Error(message));
    }),
  );
};
