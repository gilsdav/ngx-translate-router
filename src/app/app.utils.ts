import { Injector } from '@angular/core';

import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { firstValueFrom } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

export const appInitializerFactory = (injector: Injector) => {
  return () => {
    const localize = injector.get(LocalizeRouterService);
    return firstValueFrom(
      localize.hooks.initialized
        .pipe(
          tap(() => {
            const router = injector.get(Router);
            router.events.pipe(
              filter(url => url instanceof NavigationEnd),
              first()
            ).subscribe((route: NavigationEnd) => {
              console.log(router.url, route.url);
              router.navigate(['/fr/testounet/bobie']);
            });
          })
        )
    );
  }
};


