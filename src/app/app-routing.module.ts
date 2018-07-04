import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { LocalizeRouterModule, LocalizeParser, ManualParserLoader, LocalizeRouterSettings } from '@gilsdav/ngx-translate-router';

import { HomeComponent } from './home/home.component';


export function ManualLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings) {
    return new ManualParserLoader(translate, location, settings, ['en', 'fr'], 'ROUTES.');
}

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'test', loadChildren: './test/test.module#TestModule' },
    { path: 'bob', children: [
        { path: 'home/:test', component: HomeComponent }
    ] },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        LocalizeRouterModule.forRoot(routes, {
            parser: {
                provide: LocalizeParser,
                useFactory: ManualLoaderFactory,
                deps: [TranslateService, Location, LocalizeRouterSettings]
            }
        })
    ],
    exports: [RouterModule, LocalizeRouterModule]
})
export class AppRoutingModule { }
