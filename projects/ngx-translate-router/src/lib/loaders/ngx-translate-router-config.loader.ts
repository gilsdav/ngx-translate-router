import { ROUTES } from '@angular/router';
import {
  SystemJsNgModuleLoader, NgModuleFactory, Injector,
  SystemJsNgModuleLoaderConfig, Optional, Compiler, Injectable, Inject, forwardRef
} from '@angular/core';

import { NgxTranslateRouterParser } from '../parsers/ngx-translate-router.parser';

/**
 * Extension of SystemJsNgModuleLoader to enable localization of route on lazy load
 */
@Injectable()
export class NgxTranslateRouterConfigLoader extends SystemJsNgModuleLoader {

  constructor(@Inject(forwardRef(() => NgxTranslateRouterParser)) private parser: NgxTranslateRouterParser,
    _compiler: Compiler,
    @Optional() config?: SystemJsNgModuleLoaderConfig) {
        super(_compiler, config);
  }

  load(path: string): Promise<NgModuleFactory<any>> {
    console.log('load', path);
    return super.load(path).then((factory: NgModuleFactory<any>) => {
      return {
        moduleType: factory.moduleType,
        create: (parentInjector: Injector) => {
          const module = factory.create(parentInjector);
          const getMethod = module.injector.get.bind(module.injector);

          module.injector['get'] = (token: any) => {
            const getResult = getMethod(token);

            if (token === ROUTES) {
              // translate lazy routes
              // return this.parser.initChildRoutes([].concat(...getResult));
              console.log('child !', getResult, path);
              const newResult = [...getResult];
              newResult.forEach(routes => {
                this.parser.initLazyChildsRoutes(routes, path);
              });
              // newResult[0][0].path = 'bobie';
              return newResult;
            } else {
              return getResult;
            }
          };
          return module;
        }
      };
    });
  }
}
