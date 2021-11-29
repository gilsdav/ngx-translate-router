import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { filter, first, tap } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locales/', '.json');
}

export const appInitializerFactory = (injector: Injector) => {
  return () => {
    const localize = injector.get(LocalizeRouterService);
    return localize.hooks.initialized
      .pipe(
        tap(() => {
          const router = injector.get(Router);
          router.events.pipe(
            filter(url => url instanceof NavigationEnd),
            first()
          ).subscribe((route: NavigationEnd) => {
            console.log(router.url, route.url);
            router.navigate(['/fr/testounet/bobie']);
          });
        })
      )
      .toPromise();
  }
};

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
