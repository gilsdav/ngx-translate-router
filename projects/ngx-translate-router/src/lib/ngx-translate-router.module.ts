import { NgModule, ModuleWithProviders, Optional, SkipSelf, APP_INITIALIZER, Inject, NgModuleFactoryLoader } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { RAW_ROUTES, LOCALIZE_ROUTER_FORROOT_GUARD } from './config/ngx-translate-router.config';
import { getAppInitializer } from './ngx-translate-router.init';
import { ParserInitializerService } from './parsers/parser-initializer';
import { NgxTranslateRouterConfigLoader } from './loaders/ngx-translate-router-config.loader';
import { NgxTranslateRouterParser, DummyTranslateRouteParser } from './parsers/ngx-translate-router.parser';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  declarations: [],
  exports: []
})
export class NgxTranslateRouterModule {

  constructor(@Optional() @Inject(LOCALIZE_ROUTER_FORROOT_GUARD) guard: any) {}

  public static forRoot(routes: Routes, config: any = {}): ModuleWithProviders {
    console.log('forRoot', routes);
    return {
      ngModule: NgxTranslateRouterModule,
      providers: [
        {
          provide: LOCALIZE_ROUTER_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[NgxTranslateRouterModule, new Optional(), new SkipSelf()]]
        },
        config.parser || { provide: NgxTranslateRouterParser, useClass: DummyTranslateRouteParser },
        {
          provide: RAW_ROUTES,
          multi: true,
          useValue: routes
        },
        ParserInitializerService,
        { provide: NgModuleFactoryLoader, useClass: NgxTranslateRouterConfigLoader },
        {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: getAppInitializer,
          deps: [ParserInitializerService, NgxTranslateRouterParser, RAW_ROUTES]
        }
      ]
    };
  }

  public static forChild(routes: Routes): ModuleWithProviders {
    console.log('forChild', routes);
    return {
      ngModule: NgxTranslateRouterModule,
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

export function provideForRootGuard(localizeRouterModule: NgxTranslateRouterModule): string {
  console.log('root guard');
  if (localizeRouterModule) {
    throw new Error(
      `NgxTranslateRouterModule.forRoot() called twice. Lazy loaded modules should use NgxTranslateRouterModule.forChild() instead.`);
  }
  return 'guarded';
}
