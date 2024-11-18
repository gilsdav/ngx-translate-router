import { importProvidersFrom } from '@angular/core';

import { createTranslateLoader } from './app.utils';
import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { withInterceptorsFromDi, provideHttpClient, HttpClient } from '@angular/common/http';
import { TranslateTitleStrategy } from './translate-title-strategy';
import { TitleStrategy } from '@angular/router';
import { provideClientHydration, BrowserModule } from '@angular/platform-browser';

import {ApplicationConfig} from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    provideClientHydration(),
    { provide: TitleStrategy, useClass: TranslateTitleStrategy }
    //   {
    //     provide: APP_INITIALIZER,
    //     useFactory: appInitializerFactory,
    //     deps: [ Injector ],
    //     multi: true
    //   }
    ,
    provideHttpClient(withInterceptorsFromDi())
  ]
}
