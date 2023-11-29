import {
  NgModule, ModuleWithProviders, APP_INITIALIZER, Optional, SkipSelf,
  Injectable, Injector, Provider, EnvironmentProviders
} from '@angular/core';
import { LocalizeRouterService } from './localize-router.service';
import { DummyLocalizeParser, LocalizeParser } from './localize-router.parser';
import {
  RouterModule, Routes, RouteReuseStrategy, Router, RouterConfigurationFeature
} from '@angular/router';
import { LocalizeRouterPipe } from './localize-router.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, Location } from '@angular/common';
import {
  ALWAYS_SET_PREFIX,
  CACHE_MECHANISM, CACHE_NAME, DEFAULT_LANG_FUNCTION, LOCALIZE_ROUTER_FORROOT_GUARD,
  LocalizeRouterConfig, LocalizeRouterSettings,
  RAW_ROUTES,
  USE_CACHED_LANG,
  COOKIE_FORMAT,
  INITIAL_NAVIGATION
} from './localize-router.config';
import { GilsdavReuseStrategy } from './gilsdav-reuse-strategy';
import { deepCopy } from './util';
import { LocalizedRouter } from './localized-router';

@Injectable()
export class ParserInitializer {
  parser: LocalizeParser;
  routes: Routes;

  /**
   * CTOR
   */
  constructor(private injector: Injector) {
  }

  appInitializer(): Promise<any> {
    const res = this.parser.load(this.routes);

    return res.then(() => {
      const localize = this.injector.get(LocalizeRouterService);
      const router = this.injector.get(Router);
      const settings = this.injector.get(LocalizeRouterSettings);
      localize.init();

      if (settings.initialNavigation) {
        return new Promise<void>(resolve => {
          // @ts-ignore
          const oldAfterPreactivation = router.navigationTransitions.afterPreactivation;
          let firstInit = true;
          // @ts-ignore
          router.navigationTransitions.afterPreactivation = () => {
            if (firstInit) {
              resolve();
              firstInit = false;
              localize.hooks._initializedSubject.next(true);
              localize.hooks._initializedSubject.complete();
            }
            return oldAfterPreactivation();
          };
        });
      } else {
        localize.hooks._initializedSubject.next(true);
        localize.hooks._initializedSubject.complete();
      }
    });
  }

  generateInitializer(parser: LocalizeParser, routes: Routes[]): () => Promise<any> {
    this.parser = parser;
    this.routes = routes.reduce((a, b) => a.concat(b));
    return this.appInitializer;
  }
}

export function getAppInitializer(p: ParserInitializer, parser: LocalizeParser, routes: Routes[]): any {
  // DeepCopy needed to prevent RAW_ROUTES mutation
  const routesCopy = deepCopy(routes);
  return p.generateInitializer(parser, routesCopy).bind(p);
}

function createLocalizeRouterProviders(routes: Routes, config: LocalizeRouterConfig): Provider[] {
  return [
    {
      provide: Router,
      useClass: LocalizedRouter
    },
    {
      provide: LOCALIZE_ROUTER_FORROOT_GUARD,
      useFactory: provideForRootGuard,
      deps: [[LocalizeRouterModule, new Optional(), new SkipSelf()]]
    },
    { provide: USE_CACHED_LANG, useValue: config.useCachedLang },
    { provide: ALWAYS_SET_PREFIX, useValue: config.alwaysSetPrefix },
    { provide: CACHE_NAME, useValue: config.cacheName },
    { provide: CACHE_MECHANISM, useValue: config.cacheMechanism },
    { provide: DEFAULT_LANG_FUNCTION, useValue: config.defaultLangFunction },
    { provide: COOKIE_FORMAT, useValue: config.cookieFormat },
    { provide: INITIAL_NAVIGATION, useValue: config.initialNavigation },
    LocalizeRouterSettings,
    config.parser || { provide: LocalizeParser, useClass: DummyLocalizeParser },
    {
      provide: RAW_ROUTES,
      multi: true,
      useValue: routes
    },
    LocalizeRouterService,
    ParserInitializer,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: getAppInitializer,
      deps: [ParserInitializer, LocalizeParser, RAW_ROUTES]
    },
    {
      provide: RouteReuseStrategy,
      useClass: GilsdavReuseStrategy
    }
  ];
}

@NgModule({
  imports: [CommonModule, RouterModule, TranslateModule, LocalizeRouterPipe],
  exports: [LocalizeRouterPipe]
})
export class LocalizeRouterModule {

  static forRoot(routes: Routes, config: LocalizeRouterConfig = {}): ModuleWithProviders<LocalizeRouterModule> {
    return {
      ngModule: LocalizeRouterModule,
      providers: createLocalizeRouterProviders(routes, config)
    };
  }

  static forChild(routes: Routes): ModuleWithProviders<LocalizeRouterModule> {
    return {
      ngModule: LocalizeRouterModule,
      providers: [
        {
          provide: RAW_ROUTES,
          multi: true,
          useValue: routes
        }
      ]
    };
  }
}

export function provideForRootGuard(localizeRouterModule: LocalizeRouterModule): string {
  if (localizeRouterModule) {
    throw new Error(
      `LocalizeRouterModule.forRoot() called twice. Lazy loaded modules should use LocalizeRouterModule.forChild() instead.`);
  }
  return 'guarded';
}


export function withLocalizeRouter(routes: Routes, config: LocalizeRouterConfig = {}): RouterConfigurationFeature {
  return {
    ɵkind: 'LocalizeRouter' as any,
    ɵproviders: createLocalizeRouterProviders(routes, config)
  };
}
