import {
  Router, UrlSerializer, ChildrenOutletContexts, Routes,
  Route, ExtraOptions, UrlHandlingStrategy, RouteReuseStrategy, RouterEvent, LoadChildren, ROUTES
} from '@angular/router';
import { Type, Injector, NgModuleFactoryLoader, Compiler, ApplicationRef, NgModuleFactory } from '@angular/core';
import { Location } from '@angular/common';
import { flatten } from '@angular/compiler';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import { from, of, isObservable, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { isPromise } from './util';
import { LocalizeParser } from './localize-router.parser';

export class LocalizedRouter extends Router {
  constructor(
    _rootComponentType: Type<any>|null,
    _urlSerializer: UrlSerializer,
    _rootContexts: ChildrenOutletContexts,
    _location: Location, injector: Injector,
    loader: NgModuleFactoryLoader,
    compiler: Compiler,
    public config: Routes,
    localize: LocalizeParser
    ) {
    super(_rootComponentType, _urlSerializer, _rootContexts, _location, injector, loader, compiler, config);
    // const oldLoadModuleFactory = (this as any).configLoader.__proto__.loadModuleFactory;
    //@ts-ignore
    this.configLoader.loadModuleFactory = function (loadChildren: LoadChildren) {
      if (typeof loadChildren === 'string') {
        return from(this.loader.load(loadChildren));
      } else {
        return wrapIntoObservable(loadChildren()).pipe(mergeMap((t: any) => {
          let compiled: Observable<NgModuleFactory<any>>;
          if (t instanceof NgModuleFactory) {
            compiled = of(t);
          } else {
            compiled = from(this.compiler.compileModuleAsync(t)) as Observable<NgModuleFactory<any>>;
          }
          return compiled.pipe(map(factory => {
            return {
              moduleType: factory.moduleType,
              create: (parentInjector: Injector) => {
                const module = factory.create(parentInjector);
                const getMethod = module.injector.get.bind(module.injector);

                module.injector['get'] = (token: any, notFoundValue: any) => {
                  const getResult = getMethod(token, notFoundValue);

                  if (token === ROUTES) {
                    // translate lazy routes
                    return localize.initChildRoutes([].concat(...getResult));
                  } else {
                    return getResult;
                  }
                };
                return module;
              }
            };
          }));
        }));
      }
    };
    // (this as any).navigations = (this as any).setupNavigations((this as any).transitions);
  }
}
export function setupRouter(
    ref: ApplicationRef, urlSerializer: UrlSerializer, contexts: ChildrenOutletContexts,
    location: Location, injector: Injector, loader: NgModuleFactoryLoader, compiler: Compiler,
    config: Route[][], localize: LocalizeParser, opts: ExtraOptions = {}, urlHandlingStrategy?: UrlHandlingStrategy,
    routeReuseStrategy?: RouteReuseStrategy) {
  const router = new LocalizedRouter(
      null, urlSerializer, contexts, location, injector, loader, compiler, flatten(config), localize);

  if (urlHandlingStrategy) {
    router.urlHandlingStrategy = urlHandlingStrategy;
  }

  if (routeReuseStrategy) {
    router.routeReuseStrategy = routeReuseStrategy;
  }

  if (opts.errorHandler) {
    router.errorHandler = opts.errorHandler;
  }

  if (opts.malformedUriErrorHandler) {
    router.malformedUriErrorHandler = opts.malformedUriErrorHandler;
  }

  if (opts.enableTracing) {
    const dom = getDOM();
    router.events.subscribe((e: RouterEvent) => {
      dom.logGroup(`Router Event: ${(<any>e.constructor).name}`);
      dom.log(e.toString());
      dom.log(e);
      dom.logGroupEnd();
    });
  }

  if (opts.onSameUrlNavigation) {
    router.onSameUrlNavigation = opts.onSameUrlNavigation;
  }

  if (opts.paramsInheritanceStrategy) {
    router.paramsInheritanceStrategy = opts.paramsInheritanceStrategy;
  }

  if (opts.urlUpdateStrategy) {
    router.urlUpdateStrategy = opts.urlUpdateStrategy;
  }

  if (opts.relativeLinkResolution) {
    router.relativeLinkResolution = opts.relativeLinkResolution;
  }

  return router;
}

export function wrapIntoObservable<T>(value: T | NgModuleFactory<T>| Promise<T>| Observable<T>) {
  if (isObservable(value)) {
    return value;
  }

  if (isPromise(value)) {
    // Use `Promise.resolve()` to wrap promise-like instances.
    // Required ie when a Resolver returns a AngularJS `$q` promise to correctly trigger the
    // change detection.
    return from(Promise.resolve(value));
  }

  return of (value);
}
