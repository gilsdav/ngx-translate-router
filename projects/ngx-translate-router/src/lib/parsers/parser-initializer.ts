import { Injectable, Injector } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxTranslateRouterParser } from './ngx-translate-router.parser';

@Injectable()
export class ParserInitializerService {

    protected parser: NgxTranslateRouterParser;
    protected routes: Routes;

    constructor(private injector: Injector) {
    }

    generateInitializer(parser: NgxTranslateRouterParser, routes: Routes[]): () => Promise<any> {
        this.parser = parser;
        this.routes = routes.reduce((result, currentRoute) => result.concat(currentRoute), []);
        console.log('routes', this.routes);
        return this.appInitializer;
    }

    appInitializer(): Promise<any> {
        const res = this.parser.load(this.routes);
        return res;
    }

}
