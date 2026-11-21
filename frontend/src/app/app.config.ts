import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeSk from '@angular/common/locales/sk';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';
import { PageTitleStrategy } from './core/services/page-title.strategy';

registerLocaleData(localeSk);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(withFetch()),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    { provide: LOCALE_ID, useValue: 'sk' },
  ],
};
