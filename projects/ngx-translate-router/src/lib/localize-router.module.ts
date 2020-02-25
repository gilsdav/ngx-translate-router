import {
  NgModule, ModuleWithProviders, APP_INITIALIZER, Optional, SkipSelf,
  Injectable, Injector, NgModuleFactoryLoader, ApplicationRef, Compiler
} from '@angular/core';
import { LocalizeRouterService } from './localize-router.service';
import { DummyLocalizeParser, LocalizeParser } from './localize-router.parser';
import { RouterModule, Routes, RouteReuseStrategy, Router, UrlSerializer, ChildrenOutletContexts,
  ROUTES, ROUTER_CONFIGURATION, UrlHandlingStrategy } from '@angular/router';
import { LocalizeRouterPipe } from './localize-router.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, Location } from '@angular/common';
import {
  ALWAYS_SET_PREFIX,
  CACHE_MECHANISM, CACHE_NAME, DEFAULT_LANG_FUNCTION, LOCALIZE_ROUTER_FORROOT_GUARD,
  LocalizeRouterConfig, LocalizeRouterSettings,
  RAW_ROUTES,
  USE_CACHED_LANG,
  COOKIE_FORMAT
} from './localize-router.config';
// import { LocalizeRouterConfigLoader } from './localize-router-config-loader';
import { GilsdavReuseStrategy } from './gilsdav-reuse-strategy';
import { setupRouter } from './localized-router';
import { deepCopy } from './util';

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
    res.then(() => {
      const localize: LocalizeRouterService = this.injector.get(LocalizeRouterService);
      localize.init();
    });

    return res;
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

@NgModule({
  imports: [CommonModule, RouterModule, TranslateModule],
  declarations: [LocalizeRouterPipe],
  exports: [LocalizeRouterPipe]
})
export class LocalizeRouterModule {

  static forRoot(routes: Routes, config: LocalizeRouterConfig = {}): ModuleWithProviders {
    return {
      ngModule: LocalizeRouterModule,
      providers: [
        {
          provide: Router,
          useFactory: setupRouter,
          deps: [
            ApplicationRef, UrlSerializer, ChildrenOutletContexts, Location, Injector,
            NgModuleFactoryLoader, Compiler, ROUTES, LocalizeParser, ROUTER_CONFIGURATION,
            [UrlHandlingStrategy, new Optional()], [RouteReuseStrategy, new Optional()]
          ]
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
        LocalizeRouterSettings,
        config.parser || { provide: LocalizeParser, useClass: DummyLocalizeParser },
        {
          provide: RAW_ROUTES,
          multi: true,
          useValue: routes
        },
        LocalizeRouterService,
        ParserInitializer,
        // { provide: NgModuleFactoryLoader, useClass: LocalizeRouterConfigLoader },
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
      ]
    };
  }

  static forChild(routes: Routes): ModuleWithProviders {
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
