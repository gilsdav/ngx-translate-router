import { Routes } from '@angular/router';

import { BobComponent } from './bob/bob.component';
import { Test3Component } from './test3/test3.component';

export const testRouting3Routes: Routes = [
  {
    path: '',
    component: Test3Component,
    children: [
      { path: 'coco', component: BobComponent }
    ]
  }
];
