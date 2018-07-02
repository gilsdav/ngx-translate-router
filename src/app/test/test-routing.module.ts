import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NgxTranslateRouterModule } from 'ngx-translate-router';

import { BobComponent } from './bob/bob.component';

const routes: Routes = [
  { path: 'bob', component: BobComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgxTranslateRouterModule.forChild(routes)
  ],
  exports: [RouterModule, NgxTranslateRouterModule]
})
export class TestRoutingModule { }
