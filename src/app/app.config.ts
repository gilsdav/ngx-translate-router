import { Location } from '@angular/common';
import { createTranslateLoader } from './app.utils';
import { TranslateLoader, TranslateService, provideTranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory, routes } from './app-routing.routes';
import { withInterceptorsFromDi, provideHttpClient, HttpClient } from '@angular/common/http';
import { TranslateTitleStrategy } from './translate-title-strategy';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { ApplicationConfig } from '@angular/core';
import { CacheMechanism, LocalizeParser, LocalizeRouterSettings, withLocalizeRouter } from '@gilsdav/ngx-translate-router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    provideRouter(routes, withLocalizeRouter(routes, {
      parser: {
        provide: LocalizeParser,
        useFactory: HttpLoaderFactory,
        deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient]
      },
      cacheMechanism: CacheMechanism.Cookie,
      cookieFormat: '{{value}};{{expires:20}};path=/',
    })),
    provideClientHydration(),
    { provide: TitleStrategy, useClass: TranslateTitleStrategy },
    provideHttpClient(withInterceptorsFromDi())
  ]
}
