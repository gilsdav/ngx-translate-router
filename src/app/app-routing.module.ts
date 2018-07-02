import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Location } from '@angular/common';

import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { NgxTranslateRouterModule, NgxTranslateRouterParser } from 'ngx-translate-router';

import { HomeComponent } from './home/home.component';
import { ManualTranslateRouteParser } from 'projects/ngx-translate-router/src/public_api';



export function ManualLoaderFactory(translate: TranslateService, location: Location) {
    return new ManualTranslateRouteParser(translate, location, ['en', 'fr']);
}

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'test', loadChildren: './test/test.module#TestModule' },
    { path: 'bob', children: [
        { path: 'home', component: HomeComponent }
    ] },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        NgxTranslateRouterModule.forRoot(routes, {
            parser: {
                provide: NgxTranslateRouterParser,
                useFactory: ManualLoaderFactory,
                deps: [TranslateService, Location]
            }
        })
    ],
    exports: [RouterModule, NgxTranslateRouterModule]
})
export class AppRoutingModule { }
