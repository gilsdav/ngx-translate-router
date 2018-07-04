import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';

import { BobComponent } from './bob/bob.component';

const routes: Routes = [
  { path: 'bob', component: BobComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(routes)
  ],
  exports: [RouterModule, LocalizeRouterModule]
})
export class TestRoutingModule { }
