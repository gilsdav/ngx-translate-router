import { ManualParserLoader, CacheMechanism } from '@gilsdav/ngx-translate-router';
import { TranslateService, TranslateDefaultParser, TranslateStore, FakeMissingTranslationHandler } from '@ngx-translate/core';
import { Location, LocationStrategy, LocationChangeListener } from '@angular/common';
import { join } from 'path';

const translateService = new TranslateService(
  new TranslateStore(),
  null,
  null,
  new TranslateDefaultParser(),
  new FakeMissingTranslationHandler(),
  null,
  null,
  null,
  null
);

class MyLocationStrategy extends LocationStrategy {
  path(includeHash?: boolean): string {
    throw new Error('path not implemented.');
  }
  prepareExternalUrl(internal: string): string {
    throw new Error('prepareExternalUrl not implemented.');
  }
  pushState(state: any, title: string, url: string, queryParams: string): void {
    throw new Error('pushState not implemented.');
  }
  replaceState(state: any, title: string, url: string, queryParams: string): void {
    throw new Error('replaceState not implemented.');
  }
  forward(): void {
    throw new Error('forward not implemented.');
  }
  back(): void {
    throw new Error('back not implemented.');
  }
  onPopState(fn: LocationChangeListener): void {
    // throw new Error('onPopState not implemented.');
  }
  getBaseHref(): string {
    // throw new Error('getBaseHref not implemented.');
    return '/';
  }

}

const parser = new ManualParserLoader(translateService, new Location(new MyLocationStrategy(), null), {
  alwaysSetPrefix: true,
  useCachedLang: false,
  defaultLangFunction: () => 'en',
  cacheName: 'none',
  cacheMechanism: CacheMechanism.Cookie,
  cookieFormat: '',
  initialNavigation: false
} as any);

export async function parseRoutes(routes: any[], config: any) {
  const newRoutes = [];
  const langKeys = Object.keys(config.langs);
  for (const langKey of langKeys) {
    const subRoutes = await translateRoutes(langKey, config.langs[langKey], routes, config.defaultLang);
    newRoutes.push(...subRoutes);
  }
  return newRoutes;
}

async function translateRoutes(lang, filePath, routeList, defaultLang) {
  // @ts-ignore
  return await import(join(process.cwd(), filePath)).then(translation => {
    // @ts-ignore
    parser._translationObject = translation;
    parser.currentLang = lang;
    parser.defaultLang = defaultLang;
    return routeList.reduce((result, element) => {
      if (element.type === 'default') {
        const translatedRoute = '/' + parser.currentLang + parser.translateRoute(element.route);
        result.push({...element, route: translatedRoute});
      } else if (element?.data?.lang === parser.currentLang) {
        const translatedRoute = '/' + parser.currentLang + parser.translateRoute(element.route);
        result.push({...element, route: translatedRoute});
      }
      return result;
    }, []);
  });

}
