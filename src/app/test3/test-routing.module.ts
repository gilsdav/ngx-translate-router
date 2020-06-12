import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';

import { BobComponent } from './bob/bob.component';
import { Test3Component } from './test3/test3.component';

const routes: Routes = [
  {
    path: '',
    component: Test3Component,
    children: [
      { path: 'coco', component: BobComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(routes)
  ],
  exports: [RouterModule, LocalizeRouterModule]
})
export class TestRoutingModule { }
