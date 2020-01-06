import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import {
  LocalizeRouterModule, LocalizeParser, ManualParserLoader, CacheMechanism,
  LocalizeRouterSettings
} from '@gilsdav/ngx-translate-router';
import { LocalizeRouterHttpLoader } from '@gilsdav/ngx-translate-router-http-loader';

import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { baseMatcher } from './matcher/matcher.module';
import { detailMatcher } from './matcher/matcher-detail/matcher-detail.module';

// export function ManualLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings) {
//     return new ManualParserLoader(translate, location, settings, ['en', 'fr'], 'ROUTES.', '!');
// }

export function HttpLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings, http: HttpClient) {
  return new LocalizeRouterHttpLoader(translate, location, { ...settings, alwaysSetPrefix: true }, http);
}

export const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent, loadChildren: () => import('./test/test.module').then(mod => mod.TestModule),
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
  // { path: 'test', component: HomeComponent, loadChildren: './test/test.module#TestModule' },
  { path: 'test', component: HomeComponent, loadChildren: () => import('./test/test.module').then(mod => mod.TestModule) },
  { path: '!test', component: HomeComponent, loadChildren: () => import('./test/test.module').then(mod => mod.TestModule) },

  { path: 'toredirect', redirectTo: '/home', data: { skipRouteLocalization: { localizeRedirectTo: true } } },

    { path: 'bob', children: [
        { path: 'home/:test', component: HomeComponent }
    ] },
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
        RouterModule.forRoot(routes),
        LocalizeRouterModule.forRoot(routes, {
            // parser: {
            //     provide: LocalizeParser,
            //     useFactory: ManualLoaderFactory,
            //     deps: [TranslateService, Location, LocalizeRouterSettings]
            // }
            parser: {
              provide: LocalizeParser,
              useFactory: HttpLoaderFactory,
              deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient]
            },
            cacheMechanism: CacheMechanism.Cookie,
            cookieFormat: '{{value}};{{expires:20}};path=/'
            // alwaysSetPrefix: false
        })
    ],
    exports: [RouterModule, LocalizeRouterModule]
})
export class AppRoutingModule { }


