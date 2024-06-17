import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
}

export default bootstrapApplication(AppComponent, appConfig);
