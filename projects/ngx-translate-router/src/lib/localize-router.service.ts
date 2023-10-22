import { Inject, Injectable } from '@angular/core';
// import { Location } from '@angular/common';
import {
  Router, NavigationStart, ActivatedRouteSnapshot, NavigationExtras, ActivatedRoute,
  Event, NavigationCancel, Routes
} from '@angular/router';
import { Subject, Observable, ReplaySubject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';

import { LocalizeParser } from './localize-router.parser';
import { LocalizeRouterSettings } from './localize-router.config';
import { LocalizedMatcherUrlSegment } from './localized-matcher-url-segment';
import { deepCopy } from './util';

/**
 * Localization service
 * modifyRoutes
 */
@Injectable()
export class LocalizeRouterService {
  routerEvents: Subject<string>;
  hooks: {
    /** @internal */
    _initializedSubject: ReplaySubject<boolean>;
    initialized: Observable<boolean>;
  };


  private latestUrl: string;
  private lastExtras?: NavigationExtras;

  /**
   * CTOR
   */
  constructor(
      @Inject(LocalizeParser) public parser: LocalizeParser,
      @Inject(LocalizeRouterSettings) public settings: LocalizeRouterSettings,
      @Inject(Router) private router: Router,
      @Inject(ActivatedRoute) private route: ActivatedRoute/*,
      @Inject(Location) private location: Location*/
    ) {
      this.routerEvents = new Subject<string>();
      const initializedSubject = new ReplaySubject<boolean>(1);
      this.hooks = {
        _initializedSubject: initializedSubject,
        initialized: initializedSubject.asObservable()
      };
  }

  /**
   * Start up the service
   */
  init(): void {
    this.applyConfigToRouter(this.parser.routes);
    // subscribe to router events
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        pairwise()
      )
      .subscribe(this._routeChanged());

    if (this.settings.initialNavigation) {
      this.router.initialNavigation();
    }
  }

  /**
   * Change language and navigate to translated route
   */
  changeLanguage(lang: string, extras?: NavigationExtras, useNavigateMethod?: boolean): void {

    if (lang !== this.parser.currentLang) {
      const rootSnapshot: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;

      this.parser.translateRoutes(lang).subscribe(() => {

        let url = this.traverseRouteSnapshot(rootSnapshot);
        url = this.translateRoute(url) as string;

        if (!this.settings.alwaysSetPrefix) {
          let urlSegments = url.split('/');
          const languageSegmentIndex = urlSegments.indexOf(this.parser.currentLang);
          // If the default language has no prefix make sure to remove and add it when necessary
          if (this.parser.currentLang === this.parser.defaultLang) {
            // Remove the language prefix from url when current language is the default language
            if (languageSegmentIndex === 0 || (languageSegmentIndex === 1 && urlSegments[0] === '')) {
              // Remove the current aka default language prefix from the url
              urlSegments = urlSegments.slice(0, languageSegmentIndex).concat(urlSegments.slice(languageSegmentIndex + 1));
            }
          } else {
            // When coming from a default language it's possible that the url doesn't contain the language, make sure it does.
            if (languageSegmentIndex === -1) {
              // If the url starts with a slash make sure to keep it.
              const injectionIndex = urlSegments[0] === '' ? 1 : 0;
              urlSegments = urlSegments.slice(0, injectionIndex).concat(this.parser.currentLang, urlSegments.slice(injectionIndex));
            }
          }
          url = urlSegments.join('/');
        }

        // Prevent multiple "/" character
        url = url.replace(/\/+/g, '/');

        const lastSlashIndex = url.lastIndexOf('/');
        if (lastSlashIndex > 0 && lastSlashIndex === url.length - 1) {
          url = url.slice(0, -1);
        }

        const queryParamsObj = this.parser.chooseQueryParams(extras, this.route.snapshot.queryParams);

        this.applyConfigToRouter(this.parser.routes);

        this.lastExtras = extras;
        if (useNavigateMethod) {
          const extrasToApply: NavigationExtras = extras ? {...extras} : {};
          if (queryParamsObj) {
            extrasToApply.queryParams = queryParamsObj;
          }
          this.router.navigate([url], extrasToApply);
        } else {
          let queryParams = this.parser.formatQueryParams(queryParamsObj);
          queryParams = queryParams ? `?${queryParams}` : '';
          this.router.navigateByUrl(`${url}${queryParams}`, extras);
        }
      });
    }
  }

  /**
   * Traverses through the tree to assemble new translated url
   */
  private traverseRouteSnapshot(snapshot: ActivatedRouteSnapshot): string {
    if (snapshot.firstChild && snapshot.routeConfig) {
      return `${this.parseSegmentValue(snapshot)}/${this.traverseRouteSnapshot(snapshot.firstChild)}`;
    } else if (snapshot.firstChild) {
      return this.traverseRouteSnapshot(snapshot.firstChild);
    } else {
      return '';
    }
    /* if (snapshot.firstChild && snapshot.firstChild.routeConfig && snapshot.firstChild.routeConfig.path) {
      if (snapshot.firstChild.routeConfig.path !== '**') {
        return this.parseSegmentValue(snapshot) + '/' + this.traverseRouteSnapshot(snapshot.firstChild);
      } else {
        return this.parseSegmentValue(snapshot.firstChild);
      }
    }
    return this.parseSegmentValue(snapshot); */
  }

  /**
   * Build URL from segments and snapshot (for params)
   */
  private buildUrlFromSegments(snapshot: ActivatedRouteSnapshot, segments: string[]): string {
    return segments.map((s: string, i: number) => s.indexOf(':') === 0 ? snapshot.url[i].path : s).join('/');
  }

  /**
   * Extracts new segment value based on routeConfig and url
   */
  private parseSegmentValue(snapshot: ActivatedRouteSnapshot): string {
    if (snapshot.routeConfig && snapshot.routeConfig.matcher) {
      const subPathMatchedSegments = this.parseSegmentValueMatcher(snapshot);
      return this.buildUrlFromSegments(snapshot, subPathMatchedSegments);
    } else if (snapshot.data.localizeRouter) {
      const path = snapshot.data.localizeRouter.path;
      const subPathSegments = path.split('/');
      return this.buildUrlFromSegments(snapshot, subPathSegments);
    } else if (snapshot.parent && snapshot.parent.parent) { // Not lang route and no localizeRouter data = excluded path
      const path = snapshot.routeConfig.path;
      const subPathSegments = path.split('/');
      return this.buildUrlFromSegments(snapshot, subPathSegments);
    } else {
      return '';
    }
    /* if (snapshot.routeConfig) {
      if (snapshot.routeConfig.path === '**') {
        return snapshot.url.filter((segment: UrlSegment) => segment.path).map((segment: UrlSegment) => segment.path).join('/');
      } else {
        const subPathSegments = snapshot.routeConfig.path.split('/');
        return subPathSegments.map((s: string, i: number) => s.indexOf(':') === 0 ? snapshot.url[i].path : s).join('/');
      }
    }
    return ''; */
  }

  private parseSegmentValueMatcher(snapshot: ActivatedRouteSnapshot): string[] {
    const localizeMatcherParams = snapshot.data && snapshot.data.localizeMatcher && snapshot.data.localizeMatcher.params || { };
    const subPathSegments: string[] = snapshot.url
      .map((segment: LocalizedMatcherUrlSegment) => {
        const currentPath = segment.path;
        const matchedParamName = segment.localizedParamName;
        const val = (matchedParamName && localizeMatcherParams[matchedParamName]) ?
          localizeMatcherParams[matchedParamName](currentPath) : null;
        return val || `${this.parser.getEscapePrefix()}${currentPath}`;
      });
    return subPathSegments;
  }

  /**
   * Translate route to current language
   * If new language is explicitly provided then replace language part in url with new language
   */
  translateRoute(path: string | any[]): string | any[] {
    if (typeof path === 'string') {
      const url = this.parser.translateRoute(path);
      return !path.indexOf('/') ? this.parser.addPrefixToUrl(url) : url;
    }
    // it's an array
    const result: any[] = [];
    (path as Array<any>).forEach((segment: any, index: number) => {
      if (typeof segment === 'string') {
        const res = this.parser.translateRoute(segment);
        if (!index && !segment.indexOf('/')) {
          result.push(this.parser.addPrefixToUrl(res));
        } else {
          result.push(res);
        }
      } else {
        result.push(segment);
      }
    });
    return result;
  }

  /**
   * Event handler to react on route change
   */
  private _routeChanged(): (eventPair: [NavigationStart, NavigationStart]) => void {
    return ([previousEvent, currentEvent]: [NavigationStart, NavigationStart]) => {
      const previousLang = this.parser.getLocationLang(previousEvent.url) || this.parser.defaultLang;
      const currentLang = this.parser.getLocationLang(currentEvent.url) || this.parser.defaultLang;
      const lastExtras = this.lastExtras;

      if (currentLang !== previousLang && this.latestUrl !== currentEvent.url) {
        this.latestUrl = currentEvent.url;
        this.cancelCurrentNavigation();
        this.parser.translateRoutes(currentLang)
          .subscribe(() => {
            // Reset routes again once they are all translated
            this.applyConfigToRouter(this.parser.routes);
            // Clear global extras
            this.lastExtras = undefined;
            // Init new navigation with same url to take new config in consideration
            this.router.navigateByUrl(currentEvent.url, lastExtras);
            // Fire route change event
            this.routerEvents.next(currentLang);
          });
      }
      this.latestUrl = currentEvent.url;
    };
  }

  /**
   * Drop the current Navigation
   */
  private cancelCurrentNavigation() {
    const currentNavigation = this.router.getCurrentNavigation();
    const url = this.router.serializeUrl(currentNavigation.extractedUrl);
    (this.router.events as Subject<Event>).next(new NavigationCancel(currentNavigation.id, url, ''));
    (this.router as any).navigationTransitions.transitions.next({
      ...(this.router as any).navigationTransitions.transitions.getValue(),
      id: 0,
    });
  }

  /**
   * Apply config to Angular RouterModule
   * @param config routes to apply
   */
  private applyConfigToRouter(config: Routes) {
    this.router.resetConfig(deepCopy(config));
  }

}
