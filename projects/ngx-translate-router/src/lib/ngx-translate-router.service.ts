import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxTranslateRouterParser } from '../lib/parsers/ngx-translate-router.parser';

@Injectable({
    providedIn: 'root'
})
export class NgxTranslateRouterService {

    constructor(
        private parser: NgxTranslateRouterParser,
        private router: Router
    ) { }

    /**
     * Change language and navigate to translated route
     * @param lang
     * @param extras
     * @param useNavigateMethod
     */
    public changeLanguage(lang: string, extras?: NavigationExtras): void {
        if (lang !== this.parser.currentLang) {
            this.parser.translateRoutes(lang).subscribe(routes => this.router.resetConfig(routes));
        }
    }

}
