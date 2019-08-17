import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

export class GilsdavReuseStrategy implements RouteReuseStrategy {
  // private handlers: {[key: string]: DetachedRouteHandle} = {};
  constructor() {
  }
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // console.log('shouldDetach', route);
    return false;
  }
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // console.log('store', route, handle);
    // console.log('store url', this.getKey(route));
    // this.handlers[this.getKey(route)] = handle;
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // console.log('shouldAttach', route, this.getKey(route));
    // return !!this.handlers[this.getKey(route)];
    return false;
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    // console.log('retrieve', route);
    // console.log('retrieve url', this.getKey(route));
    // const result = this.handlers[this.getKey(route)];
    // delete this.handlers[this.getKey(route)];
    // return result;
    return null;
  }
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // console.log('shouldReuseRoute', future, curr, this.getKey(future) === this.getKey(curr));
    // console.log('shouldReuseRoute', future && curr ? this.getKey(future) === this.getKey(curr) : false);
    return future && curr ? this.getKey(future) === this.getKey(curr) : false;
  }
  private getKey(route: ActivatedRouteSnapshot) {
    // console.log(route.parent.component.toString());
    if (!route.data.localizeRouter && (!route.parent || !route.parent.parent)) { // Lang route
      return 'LANG';
    } else if (route.data.localizeRouter) {
      let key = `${this.getKey(route.parent)}/${route.data.localizeRouter.path}`;
      if (route.data.discriminantPathKey) {
        key = `${route.data.discriminantPathKey}-${key}`;
      }
      return key;
    }
  }
}
