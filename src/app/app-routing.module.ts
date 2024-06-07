import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import {
  LocalizeRouterModule, LocalizeParser, ManualParserLoader, CacheMechanism,
  LocalizeRouterSettings, withLocalizeRouter,
  LocalizeRouterService
} from '@gilsdav/ngx-translate-router';

import { LocalizeRouterHttpLoader } from '@gilsdav/ngx-translate-router-http-loader';

import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { baseMatcher } from './matcher/matcher.module';
import { detailMatcher } from './matcher/matcher-detail/matcher-detail.module';
import { environment } from '../environments/environment';

// export function ManualLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings) {
//     return new ManualParserLoader(translate, location, settings, ['en', 'fr'], 'ROUTES.', '!');
// }

export function HttpLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings, http: HttpClient) {
  return new LocalizeRouterHttpLoader(translate, location, { ...settings, alwaysSetPrefix: true }, http, `${environment.locales}/assets/locales.json`);
}

export const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    title: 'HOME_TITLE',
    component: HomeComponent,
    loadChildren: () => import('./test/test.module').then(mod => mod.TestModule),
    data: { discriminantPathKey: 'TESTPATH' }
  },
  {
    path: '',
    loadChildren: () => import('./test2/test.module').then(mod => mod.TestModule),
    data: { discriminantPathKey: 'TEST2PATH' }
  },
  {
    path: '',
    loadChildren: () => import('./test3/test.module').then(mod => mod.TestModule),
    data: { discriminantPathKey: 'TEST3PATH' }
  },
  {
    path: 'root-redirection',
    redirectTo: '/'
  },
  {
    path: 'matcher',
    children: [
      {
        matcher: detailMatcher,
        loadChildren: () => import('./matcher/matcher-detail/matcher-detail.module').then(mod => mod.MatcherDetailModule)
      },
      {
        matcher: baseMatcher,
        loadChildren: () => import('./matcher/matcher.module').then(mod => mod.MatcherModule),
        data: {
          localizeMatcher: {
            params: {
              mapPage: shouldTranslateMap
            }
          }
        }
      }
    ]
  },
  { path: 'home', component: HomeComponent },
  { path: 'test', component: HomeComponent, loadChildren: () => import('./test/test.module').then(mod => mod.TestModule) },
  { path: '!test', component: HomeComponent, loadChildren: () => import('./test/test.module').then(mod => mod.TestModule) },
  { path: 'bil', loadChildren: () => import('./test4/test4.routes').then(mod => mod.routes) },
  {
    path: 'conditionalRedirectTo', redirectTo: ({ queryParams }) => {
      const localizeRouterService = inject(LocalizeRouterService);
      if (queryParams['redirect']) {
        return localizeRouterService.translateRoute('/test') as string;
      }
      return localizeRouterService.translateRoute('/home') as string;
    }
  },
  { path: 'toredirect', redirectTo: '/home', data: { skipRouteLocalization: { localizeRedirectTo: true } } },

  {
    path: 'bob', children: [
      { path: 'home/:test', component: HomeComponent }
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

export function shouldTranslateMap(param: string): string {
  if (isNaN(+param)) {
    return 'map';
  }
  return null;
}

@NgModule({
  imports: [
    RouterModule //.forRoot(routes/*, { initialNavigation: 'disabled' }*/),
    // LocalizeRouterModule.forRoot(routes, {
    //     parser: {
    //       provide: LocalizeParser,
    //       useFactory: HttpLoaderFactory,
    //       deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient]
    //     },
    //     cacheMechanism: CacheMechanism.Cookie,
    //     cookieFormat: '{{value}};{{expires:20}};path=/',
    // })
  ],
  providers: [provideRouter(routes, withLocalizeRouter(routes, {
    parser: {
      provide: LocalizeParser,
      useFactory: HttpLoaderFactory,
      deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient]
    },
    cacheMechanism: CacheMechanism.Cookie,
    cookieFormat: '{{value}};{{expires:20}};path=/',
  }))],
  exports: [RouterModule, LocalizeRouterModule]
})
export class AppRoutingModule { }


