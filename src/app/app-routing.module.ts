import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import {
  LocalizeRouterModule, LocalizeParser, ManualParserLoader,
  LocalizeRouterSettings
} from '@gilsdav/ngx-translate-router';
import { LocalizeRouterHttpLoader } from '@gilsdav/ngx-translate-router-http-loader';

import { HomeComponent } from './home/home.component';


// export function ManualLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings) {
//     return new ManualParserLoader(translate, location, settings, ['en', 'fr'], 'ROUTES.');
// }

export function HttpLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings, http: HttpClient) {
  return new LocalizeRouterHttpLoader(translate, location, {...settings, alwaysSetPrefix: true}, http);
}

export const routes: Routes = [
    { path: '', loadChildren: () => import('./test/test.module').then(mod => mod.TestModule) },
    { path: 'home', component: HomeComponent },
    { path: 'test', loadChildren: () => import('./test/test.module').then(mod => mod.TestModule) },

    { path: 'bob', children: [
        { path: 'home/:test', component: HomeComponent }
    ] },
];

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
            }
        })
    ],
    exports: [RouterModule, LocalizeRouterModule]
})
export class AppRoutingModule { }


