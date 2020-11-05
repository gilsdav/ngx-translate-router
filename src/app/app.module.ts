import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locales/', '.json');
}

// export const appInitializerFactory = (injector: Injector) => {
//   return () => {
//     const localize = injector.get(LocalizeRouterService);
//     const router = injector.get(Router);
//     return localize.hooks.initialized
//       .pipe(
//         tap(() => {
//           console.log('Logic after initialization');
//           router.navigate(['/fr/testounet/bobie']);
//         })
//       )
//       .toPromise();
//   }
// };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
        }
    })
  ],
  // providers: [
  //   {
  //     provide: APP_INITIALIZER,
  //     useFactory: appInitializerFactory,
  //     deps: [ Injector ],
  //     multi: true
  //   }
  // ],
  bootstrap: [AppComponent]
})
export class AppModule {}
