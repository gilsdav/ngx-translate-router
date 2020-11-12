import { ROUTES } from '@angular/router';
import {
  SystemJsNgModuleLoader, NgModuleFactory, Injector,
  SystemJsNgModuleLoaderConfig, Optional, Compiler,
  Injectable, Inject, forwardRef, Type, NgModuleRef
} from '@angular/core';
import { LocalizeParser } from './localize-router.parser';

/**
 * Extension of SystemJsNgModuleLoader to enable localization of route on lazy load
 */
@Injectable()
export class LocalizeRouterConfigLoader extends SystemJsNgModuleLoader {

  constructor(@Inject(forwardRef(() => LocalizeParser)) private localize: LocalizeParser,
    _compiler: Compiler, @Optional() config?: SystemJsNgModuleLoaderConfig) {
      super(_compiler, config);
  }

  /**
   * Extend load with custom functionality
   */
  load(path: string): Promise<NgModuleFactory<any>> {
    return super.load(path).then((factory: NgModuleFactory<any>) => {
      return {
        moduleType: factory.moduleType,
        create: (parentInjector: Injector) => {
          const module = factory.create(parentInjector);
          const getMethod = module.injector.get.bind(module.injector);

          module.injector['get'] = (token: any, notFoundValue: any) => {
            const getResult = getMethod(token, notFoundValue);

            if (token === ROUTES) {
              // translate lazy routes
              return this.localize.initChildRoutes([].concat(...getResult));
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

export class LocalizeNgModuleFactory extends NgModuleFactory<any> {
  constructor(public moduleType: Type<any>) {
    super();
  }
  create = (parentInjector: Injector) => {
    const compiler = parentInjector.get(Compiler);
    const localize = parentInjector.get(LocalizeParser);
    const compiled = compiler.compileModuleAndAllComponentsSync(this.moduleType);
    const moduleRef: NgModuleRef<any> = compiled.ngModuleFactory.create(parentInjector);
    const getMethod = moduleRef.injector.get.bind(moduleRef.injector);
    moduleRef.injector['get'] = (token: any, notFoundValue: any) => {
      const getResult = getMethod(token, notFoundValue);

      if (token === ROUTES) {
        // translate lazy routes
        return localize.initChildRoutes([].concat(...getResult));
      } else {
        return getResult;
      }
    };

    return moduleRef;
  }
}

export function translateModule(moduleType: Type<any>) {
  return new LocalizeNgModuleFactory(moduleType);
}
