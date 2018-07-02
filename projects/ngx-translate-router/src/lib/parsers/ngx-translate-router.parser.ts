import { Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Routes, Route } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Observable, Observer } from 'rxjs';

export abstract class NgxTranslateRouterParser {

    public locales: Array<string>;
    public currentLang: string;
    public routes: Routes;
    public defaultLang: string;

    protected prefix: string;

    private translations: any;

    constructor(
        @Inject(TranslateService) private translate: TranslateService,
        @Inject(Location) private location: Location
    ) {
    }

    /**
     * Load routes and fetch necessary data
     * @param routes
     */
    abstract load(routes: Routes): Promise<any>;

    public get urlPrefix() {
        return this.currentLang; // this.settings.alwaysSetPrefix || this.currentLang !== this.defaultLang ? this.currentLang : '';
    }

    /**
     * Translate route and return observable
     */
    public translateRoute(path: string): string {
        const queryParts = path.split('?');
        if (queryParts.length > 2) {
            throw new Error('There should be only one query parameter block in the URL');
        }
        const pathSegments = queryParts[0].split('/');
        const newPath = pathSegments
            .map((part: string) => (part.length && !part.startsWith(':')) ? this.translateText(part) : part)
            .join('/');
        return `${newPath}${(queryParts.length > 1 ? `?${queryParts[1]}` : '')}`;
    }

    /**
     * Do the same as initRoutes but for lazyloaded childs
     * @param routes
     * @param modulePath something like `./test/test.module#TestModule`
     */
    public initLazyChildsRoutes(routes: Routes, modulePath: string): void {
        const path = this.findModuleFullPath(this.routes, modulePath);
        this.initRoutes(routes, path);
        this.translateRouteTree(routes);
        // TODO: store lazyloaded childs to search modulePath on it.
    }

    /**
     * Translate routes to selected language
     * @param language
     */
    public translateRoutes(language: string): Observable<Routes> {
        this.currentLang = language;
        return new Observable<any>((observer: Observer<any>) => {
            this.translate.use(language).subscribe((translations: any) => {
                this.translations = translations;
                this.currentLang = language;

                this.translateRouteTree(this.routes);


                const baseRoute = { path: '', redirectTo: this.defaultLang, pathMatch: 'full' };
                const wildcardIndex = this.routes.findIndex((route: Route) => route.path === '**');
                if (wildcardIndex !== -1) {
                    this._wildcardRoute = routes.splice(wildcardIndex, 1)[0];
                }


                observer.next(this.routes);
                observer.complete();
            });
        });
    }

    /**
     * Search in routes and all childs about the fullPath of a specific modulePath
     * @param routes
     * @param modulePath
     */
    private findModuleFullPath(routes: Routes, modulePath: string): string {
        if (routes) {
            for (let i = 0; i < routes.length; i++) {
                const route = routes[i];
                if (route.loadChildren === modulePath) {
                    return route.data.translateRouter.fullPath;
                }
                const found = this.findModuleFullPath(route.children, modulePath);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    }

    /**
     * Initialize language and routes
     * @param routes
     */
    protected init(routes: Routes): Promise<any> {
        console.log('init');
        this.routes = routes;

        if (!this.locales || !this.locales.length) {
            return Promise.resolve();
        }

        this.initRoutes(routes);

        return Promise.resolve(routes);

    }

    /**
     * Prepare routes to be fully usable by ngx-translate-router
     * @param routes
     */
    private initRoutes(routes: Routes, prefix = '') {
        routes.forEach(route => {
            if (route.path !== '**') {
                const routeData: any = route.data = { translateRouter: {} };
                routeData.translateRouter.fullPath = `${prefix}/${route.path}`;
                if (route.children && route.children.length > 0) {
                    this.initRoutes(route.children, routeData.translateRouter.fullPath);
                }
            }
        });
    }

    /**
   * Translate the route node and recursively call for all it's children
   * @param routes
   */
    private translateRouteTree(routes: Routes): void {
        routes.forEach((route: Route) => {
            if (route.path && route.path !== '**') {
                this.translateProperty(route, 'path');
            }
            if (route.redirectTo) {
                this.translateProperty(route, 'redirectTo', !route.redirectTo.indexOf('/'));
            }
            if (route.children) {
                this.translateRouteTree(route.children);
            }
            if (route.loadChildren && (<any>route)._loadedConfig) {
                this.translateRouteTree((<any>route)._loadedConfig.routes);
            }
        });
    }

    /**
     * Translate property (`path` or `redirectTo`)
     * If first time translation then add original to route data object
     */
    private translateProperty(route: Route, property: string, prefixLang?: boolean): void {
        // set property to data if not there yet
        const routeData: any = route.data = route.data || {};
        if (!routeData.translateRouter) {
            routeData.translateRouter = {};
        }
        if (!routeData.translateRouter[property]) {
            routeData.translateRouter[property] = (<any>route)[property];
        }

        const result = this.translateRoute(routeData.translateRouter[property]);
        (<any>route)[property] = prefixLang ? `/${this.urlPrefix}${result}` : result;
    }

    /**
     * Get translated value
     */
    private translateText(key: string): string {
        if (!this.translations) {
            return key;
        }
        const searchKey = this.prefix + key;
        const res = this.translate.getParsedResult(this.translations, searchKey);
        return res !== searchKey ? res : key;
    }


}

export class ManualTranslateRouteParser extends NgxTranslateRouterParser {

    constructor(
        translate: TranslateService,
        location: Location,
        // settings: LocalizeRouterSettings,
        locales: string[] = ['en'],
        prefix: string = 'ROUTES.') {
        super(translate, location/*, settings*/);
        this.locales = locales;
        this.prefix = prefix || '';
    }

    load(routes: Routes): Promise<any> {
        console.log('load', routes);
        return new Promise((resolve: any) => {
            this.init(routes).then(resolve);
        });
    }
}

export class DummyTranslateRouteParser extends NgxTranslateRouterParser {
    load(routes: Routes): Promise<any> {
        console.log('load', routes);
        return new Promise((resolve: any) => {
            this.init(routes).then(resolve);
        });
    }
}
