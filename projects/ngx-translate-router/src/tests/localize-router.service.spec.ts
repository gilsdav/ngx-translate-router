import { Injector, Type } from '@angular/core';
import { LocalizeRouterService } from '../lib/localize-router.service';
import { LocalizeParser, ManualParserLoader } from '../lib/localize-router.parser';
import { LocalizeRouterSettings } from '../lib/localize-router.config';
import { LocalizeRouterModule } from '../lib/localize-router.module';
import { getTestBed, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  Routes, Router, Event, NavigationStart, NavigationEnd, ActivatedRoute,
  ActivatedRouteSnapshot, UrlSegment, Params, Data, Route, ParamMap, Navigation,
  UrlTree
} from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule, Location } from '@angular/common';
import { of as ObservableOf } from 'rxjs';

class FakeTranslateService {
  defLang: string;
  currentLang: string;

  browserLang: string = '';

  content: any = {
    'PREFIX.home': 'home_TR',
    'PREFIX.about': 'about_TR'
  };

  setDefaultLang = (lang: string) => { this.defLang = lang; };
  use = (lang: string) => { this.currentLang = lang; };
  get = (input: string) => ObservableOf(this.content[input] || input);
  getBrowserLang = () => this.browserLang;
}

class FakeRouter {
  config: Routes;
  fakeRouterEvents: Subject<Event> = new Subject<Event>();
  transitions = new BehaviorSubject({});

  resetConfig = (routes: Routes) => { this.config = routes; };

  get events(): Observable<Event> {
    return this.fakeRouterEvents;
  }

  parseUrl = () => '';

  serializeUrl = () => '';

  getCurrentNavigation = (): Navigation => ({
    extractedUrl: new UrlTree(),
    id: 1,
    trigger: 'imperative',
    extras: {},
    initialUrl: '',
    previousNavigation: undefined
  });

}

class FakeLocation {
  path = () => '';
}

class DummyComponent {
}

export class FakeActivatedRoute implements ActivatedRoute {
  get paramMap(): Observable<ParamMap> {
    return ObservableOf({} as ParamMap);
  }
  get queryParamMap(): Observable<ParamMap> {
    return ObservableOf({} as ParamMap);
  }
  snapshot: ActivatedRouteSnapshot;
  url: Observable<UrlSegment[]>;
  params: Observable<Params>;
  queryParams: Observable<Params>;
  fragment: Observable<string>;
  data: Observable<Data>;
  outlet: string;
  component: Type<any> | string;
  routeConfig: Route;
  root: ActivatedRoute;
  parent: ActivatedRoute;
  firstChild: ActivatedRoute;
  children: ActivatedRoute[];
  pathFromRoot: ActivatedRoute[];
  toString(): string {
    return '';
  };
}

describe('LocalizeRouterService', () => {
  let injector: Injector;
  let parser: LocalizeParser;
  let router: Router;
  let settings: LocalizeRouterSettings;
  let localizeRouterService: LocalizeRouterService;
  let routes: Routes;

  beforeEach(() => {
    routes = [
      { path: 'home', component: DummyComponent },
      { path: 'home/about', component: DummyComponent }
    ];

    TestBed.configureTestingModule({
      imports: [CommonModule, LocalizeRouterModule.forRoot(routes, {
        parser: {
            provide: LocalizeParser,
            useFactory: (translate, location, settings) =>
                new ManualParserLoader(translate, location, settings, ['en','de'], 'YOUR_PREFIX'),
            deps: [TranslateService, Location, LocalizeRouterSettings]
        }
    })],
      providers: [
        { provide: Router, useClass: FakeRouter },
        { provide: TranslateService, useClass: FakeTranslateService },
        { provide: Location, useClass: FakeLocation }
      ]
    });
    injector = getTestBed();
    parser = injector.get(LocalizeParser);
    router = injector.get(Router);
    settings = injector.get(LocalizeRouterSettings);
  });

  afterEach(() => {
    injector = void 0;
    localizeRouterService = void 0;
  });

  it('is defined', () => {
    expect(LocalizeRouterService).toBeDefined();
    localizeRouterService = new LocalizeRouterService(parser, settings, router, new FakeActivatedRoute());
    expect(localizeRouterService).toBeDefined();
    expect(localizeRouterService instanceof LocalizeRouterService).toBeTruthy();
  });

  it('should initialize routerEvents', () => {
    localizeRouterService = new LocalizeRouterService(parser, settings, router, new FakeActivatedRoute());
    expect(localizeRouterService.routerEvents).toBeDefined();
  });

  it('should reset route config on init', () => {
    expect((<any>router)['routes']).toEqual(void 0);
    parser.routes = routes;
    spyOn(router, 'resetConfig').and.callThrough();

    localizeRouterService = new LocalizeRouterService(parser, settings, router, new FakeActivatedRoute());
    localizeRouterService.init();
    expect(router.resetConfig).toHaveBeenCalledWith(routes);
  });

  it('should call parser translateRoute', () => {
    localizeRouterService = new LocalizeRouterService(parser, settings, router, new FakeActivatedRoute());
    let testString = 'result/path';
    spyOn(parser, 'translateRoute').and.returnValue(testString);

    let res = localizeRouterService.translateRoute('my/path');
    expect(res).toEqual(testString);
    expect(parser.translateRoute).toHaveBeenCalledWith('my/path');
  });

  it('should append language if root route', () => {
    console.log(parser);
    localizeRouterService = new LocalizeRouterService(parser, settings, router, new FakeActivatedRoute());
    parser.currentLang = 'de';
    parser.locales = ['de', 'en'];
    let testString = '/my/path';
    spyOn(parser, 'translateRoute').and.returnValue(testString);

    let res = localizeRouterService.translateRoute(testString);
    expect(res).toEqual('/de' + testString);
    expect(parser.translateRoute).toHaveBeenCalledWith('/my/path');
  });

  it('should translate complex route', () => {
    localizeRouterService = new LocalizeRouterService(parser, settings, router, new FakeActivatedRoute());
    parser.currentLang = 'de';
    parser.locales = ['de', 'en'];
    spyOn(parser, 'translateRoute').and.callFake((val: any) => val);

    let res = localizeRouterService.translateRoute(['/my/path', 123, 'about']);
    expect(res[0]).toEqual('/de/my/path');

    expect(parser.translateRoute).toHaveBeenCalledWith('/my/path');
    expect(parser.translateRoute).toHaveBeenCalledWith('about');
  });

  it('should translate routes if language had changed on route event', () => {
    localizeRouterService = new LocalizeRouterService(parser, settings, router, new FakeActivatedRoute());
    localizeRouterService.init();
    parser.currentLang = 'de';
    (<any>router).fakeRouterEvents.next(new NavigationStart(1, '/de/new/path'));
    parser.locales = ['de', 'en'];
    spyOn(parser, 'translateRoutes').and.returnValue(ObservableOf(void 0));

    (<any>router).fakeRouterEvents.next(new NavigationStart(2, '/en/new/path'));
    expect(parser.translateRoutes).toHaveBeenCalledWith('en');
  });

  it('should not translate routes if language not found', () => {
    localizeRouterService = new LocalizeRouterService(parser, settings, router, new FakeActivatedRoute());
    parser.currentLang = 'de';
    parser.locales = ['de', 'en'];
    spyOn(parser, 'translateRoutes').and.stub();

    (<any>router).fakeRouterEvents.next(new NavigationStart(1, '/bla/new/path'));
    expect(parser.translateRoutes).not.toHaveBeenCalled();
  });

  it('should not translate routes if language is same', () => {
    localizeRouterService = new LocalizeRouterService(parser, settings, router, new FakeActivatedRoute());
    parser.currentLang = 'de';
    parser.locales = ['de', 'en'];
    spyOn(parser, 'translateRoutes').and.stub();

    (<any>router).fakeRouterEvents.next(new NavigationStart(1, '/de/new/path'));
    expect(parser.translateRoutes).not.toHaveBeenCalled();
  });

  it('should not translate routes if not NavigationStart', () => {
    localizeRouterService = new LocalizeRouterService(parser, settings, router, new FakeActivatedRoute());
    parser.currentLang = 'de';
    parser.locales = ['de', 'en'];
    spyOn(parser, 'translateRoutes').and.stub();

    (<any>router).fakeRouterEvents.next(new NavigationEnd(1, '/en/new/path', '/en/new/path'));
    expect(parser.translateRoutes).not.toHaveBeenCalled();
  });

  it('should not set new url if same language', fakeAsync(() => {
    localizeRouterService = new LocalizeRouterService(parser, settings, router, new FakeActivatedRoute());
    parser.currentLang = 'de';
    parser.locales = ['de', 'en'];
    parser.routes = routes;
    spyOn(router, 'parseUrl').and.returnValue(null);
    spyOn(parser, 'translateRoutes').and.returnValue(ObservableOf('en'));
    spyOn(history, 'pushState').and.stub();

    localizeRouterService.changeLanguage('de');
    tick();
    expect(history.pushState).not.toHaveBeenCalled();
  }));
});
