import { ROUTES } from '@angular/router';
import {
  NgModuleFactory, Injector, Compiler, Type, NgModuleRef
} from '@angular/core';
import { LocalizeParser } from './localize-router.parser';

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
