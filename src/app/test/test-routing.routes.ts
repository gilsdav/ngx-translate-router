import { Routes } from '@angular/router';

import { BobComponent } from './bob/bob.component';

export const testRoutingRoutes: Routes = [
  { path: '', component: BobComponent },
  { path: 'bob', component: BobComponent }
];
