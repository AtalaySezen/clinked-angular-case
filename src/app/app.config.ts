import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { PageTitleStrategy } from './core/strategies/page-title.strategy';
import { routes } from './app.routes';
import { ENVIRONMENT } from '../environments/environment.token';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    { provide: ENVIRONMENT, useValue: environment },
    { provide: TitleStrategy, useClass: PageTitleStrategy },
  ],
};