import { LocalizeRouterHttpLoader } from '../lib/http-loader';
import { Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { getTestBed, inject, TestBed } from '@angular/core/testing';
import {
  ALWAYS_SET_PREFIX, CACHE_MECHANISM, CACHE_NAME, CacheMechanism, DEFAULT_LANG_FUNCTION,
  LocalizeRouterSettings, USE_CACHED_LANG, COOKIE_FORMAT
} from '@gilsdav/ngx-translate-router';
import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

class FakeTranslateService {

}

class FakeLocation {
  path(): string {
    return '';
  }
}

describe('LocalizeRouterHttpLoader try 2', () => {
  let injector: Injector;
  let loader: LocalizeRouterHttpLoader;
  let translate: TranslateService;
  let location: Location;
  let settings: LocalizeRouterSettings;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule],
      providers: [
        { provide: TranslateService, useClass: FakeTranslateService },
        { provide: Location, useClass: FakeLocation },
        { provide: USE_CACHED_LANG, useValue: true },
        { provide: DEFAULT_LANG_FUNCTION, useValue: void 0 },
        { provide: CACHE_NAME, useValue: 'LOCALIZE_DEFAULT_LANGUAGE' },
        { provide: CACHE_MECHANISM, useValue: CacheMechanism.LocalStorage },
        { provide: ALWAYS_SET_PREFIX, useValue: true },
        { provide: COOKIE_FORMAT, useValue: '{{value}};{{expires}}' },
        LocalizeRouterSettings
      ]
    });
    injector = getTestBed();
    translate = injector.get(TranslateService);
    location = injector.get(Location);
    settings = injector.get(LocalizeRouterSettings);
    http = injector.get(HttpClient);
    loader = new LocalizeRouterHttpLoader(translate, location, settings, http);
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    injector = undefined;
    translate = undefined;
    location = undefined;
    http = undefined;
    loader = undefined;

    httpMock.verify();
  }));

  it('should set locales and prefix from file', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    const mockResponse = {
      locales: ['en', 'de', 'fr'],
      prefix: 'PREFIX'
    };
    const myPromise = Promise.resolve();
    spyOn(<any> loader, 'init').and.returnValue(myPromise);

    const promise = loader.load([]);

    const req = httpMock.expectOne('assets/locales.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    promise.then(() => {
      expect((<any> loader).init).toHaveBeenCalledWith([]);
      expect(loader.locales).toEqual(mockResponse.locales);
      expect((<any> loader).prefix).toEqual(mockResponse.prefix);
    });
  }));

  it('should set default value for prefix if not provided', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    const mockResponse = {
      locales: ['en', 'de', 'fr']
    };
    const myPromise = Promise.resolve();
    spyOn(<any> loader, 'init').and.returnValue(myPromise);

    const promise = loader.load([]);
    const req = httpMock.expectOne('assets/locales.json');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    promise.then(() => {
      expect((<any> loader).prefix).toEqual('');
    });
  }));

  it('should load config from custom path', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    const mockResponse = {
      locales: ['en', 'de', 'fr']
    };
    const customPath = 'my/custom/path/to/config.json';
    const myPromise = Promise.resolve();
    loader = new LocalizeRouterHttpLoader(translate, location, settings, http, customPath);
    spyOn(<any> loader, 'init').and.returnValue(myPromise);

    loader.load([]);
    const req = httpMock.expectOne(customPath);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  }));
});
