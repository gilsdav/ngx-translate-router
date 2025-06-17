import { Routes } from "@angular/router";
import { YoyoComponent } from "./yoyo/yoyo.component";

export const routes: Routes = [
  {
    path: 'yoyo',
    component: YoyoComponent,
    children: [
      { path: 'sub', loadChildren: () => import('./submodule/sub-yoyo.routes').then(m => m.routes) }
    ]
  }];
