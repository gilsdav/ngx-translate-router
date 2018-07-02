import { Routes } from '@angular/router';

import { ParserInitializerService } from './parsers/parser-initializer';
import { NgxTranslateRouterParser } from './parsers/ngx-translate-router.parser';

export function getAppInitializer(p: ParserInitializerService, parser: NgxTranslateRouterParser, routes: Routes[]): any {
    return p.generateInitializer(parser, routes).bind(p);
}
