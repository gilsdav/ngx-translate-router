# ngx-translate-router
> An implementation of routes localization for Angular.

* ngx-translate-router
[![npm version](https://badge.fury.io/js/%40gilsdav%2Fngx-translate-router.svg)](https://badge.fury.io/js/%40gilsdav%2Fngx-translate-router)
* ngx-translate-router-http-loader
[![npm version](https://badge.fury.io/js/%40gilsdav%2Fngx-translate-router-http-loader.svg)](https://badge.fury.io/js/%40gilsdav%2Fngx-translate-router-http-loader)
* ngx-translate-router-scully-plugin
[![npm version](https://badge.fury.io/js/%40gilsdav%2Fngx-translate-router-scully-plugin.svg)](https://badge.fury.io/js/%40gilsdav%2Fngx-translate-router-scully-plugin)
([Documentation here](https://github.com/gilsdav/ngx-translate-router/tree/master/projects/ngx-translate-router-scully-plugin#readme))



**Fork of [localize-router](https://github.com/Greentube/localize-router).**

Based on and extension of [ngx-translate](https://github.com/ngx-translate/core).

**Version to choose :**

| angular version | translate-router | http-loader | type   | remarks                |
|-----------------|------------------|-------------|--------|------------------------|
| 6 - 7           | 1.0.2            | 1.0.1       | legacy |
| 7               | 1.7.3            | 1.1.0       | legacy |
| 8               | 2.2.3            | 1.1.0       | legacy |
| 8 - 12          | 3.1.9            | 1.1.2       | active |
| 13              | 4.0.1            | 2.0.0       | active |
| 14              | 5.1.1            | 2.0.0       | active | need rxjs 7 or higher  |
| 15              | 6.0.0            | 2.0.0       | active | minimum angular 15.0.3 |
| 15.1            | 6.1.0            | 2.0.0       | active | minimum angular 15.1.0 |
| 16.1            | 6.1.1            | 2.0.0       | active | minimum angular 16.0.0 |

Demo project can be found under sub folder `src`.

> This documentation is for version 1.x.x which requires Angular 6+. If you are migrating from the older version follow [migration guide](https://github.com/Greentube/localize-router/blob/master/MIGRATION_GUIDE.md) to upgrade to latest version.

# Table of contents:
- [Installation](#installation)
- [Usage](#usage)
    - [Initialize module](#initialize-module)
        - [Http loader](#http-loader)
        - [Manual initialization](#manual-initialization)
        - [Initialization config](#initialization-config)
    - [Server side](#server-side)
        - [Deal with initialNavigation](#deal-with-initialNavigation)
    - [How it works](#how-it-works)
        - [Excluding routes](#excluding-routes)
        - [ngx-translate integration](#ngx-translate-integration)
        - [Path discrimination](#path-discrimination)
        - [WildCard path](#wildcard-path)
        - [Matcher params translation](#matcher-params-translation)
    - [Pipe](#pipe)
    - [Service](#service)
    - [AOT](#aot)
- [API](#api)
    - [LocalizeRouterModule](#localizeroutermodule)
    - [LocalizeRouterConfig](#localizerouterconfig)
    - [LocalizeRouterService](#localizerouterservice)
    - [LocalizeParser](#localizeparser)
- [License](#license)

## Installation

```
npm install --save @gilsdav/ngx-translate-router
```

## Usage

In order to use `@gilsdav/ngx-translate-router` you must initialize it with following information:
* Available languages/locales
* Prefix for route segment translations
* Routes to be translated

### Initialize module
`import {LocalizeRouterModule} from '@gilsdav/ngx-translate-router';`
Module can be initialized either using static file or manually by passing necessary values.

*Be careful to import this module after the standard RouterModule and the TranslateModule. This should be done for the main router as well as for lazy loaded ones.*

```ts
imports: [
  TranslateModule.forRoot(),
  RouterModule.forRoot(routes),
  LocalizeRouterModule.forRoot(routes)
]
```

#### Http loader

In order to use Http loader for config files, you must include `@gilsdav/ngx-translate-router-http-loader` package and use its `LocalizeRouterHttpLoader`. 

```ts
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from '@angular/core';
import {Location} from '@angular/common';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {LocalizeRouterModule} from '@gilsdav/ngx-translate-router';
import {LocalizeRouterHttpLoader} from '@gilsdav/ngx-translate-router-http-loader';
import {RouterModule} from '@angular/router';

import {routes} from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    RouterModule.forRoot(routes),
    LocalizeRouterModule.forRoot(routes, {
      parser: {
        provide: LocalizeParser,
        useFactory: (translate, location, settings, http) =>
            new LocalizeRouterHttpLoader(translate, location, settings, http),
        deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient]
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

More details are available on [localize-router-http-loader](https://github.com/Greentube/localize-router-http-loader).

If you are using child modules or routes you need to initialize them with `forChild` command:
```ts
@NgModule({
  imports: [
    TranslateModule,
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(routes)
  ],
  declarations: [ChildComponent]
})
export class ChildModule { }
```

#### Manual initialization
   With manual initialization you need to provide information directly:
   ```ts
   LocalizeRouterModule.forRoot(routes, {
       parser: {
           provide: LocalizeParser,
           useFactory: (translate, location, settings) =>
               new ManualParserLoader(translate, location, settings, ['en','de',...], 'YOUR_PREFIX'),
           deps: [TranslateService, Location, LocalizeRouterSettings]
       }
   })
   ```
   
#### Initialization config
Apart from providing routes which are mandatory, and parser loader you can provide additional configuration for more granular setting of `@gilsdav/ngx-translate-router`. More information at [LocalizeRouterConfig](#localizerouterconfig). 

### Server side

In order to use `@gilsdav/ngx-translate-router` in Angular universal application (SSR) you need to:

1. [Initialize the module](#initialize-module)
2. In case you opted for initializing with Http loader, you need to take care of static file location. `@gilsdav/ngx-translate-router-http-loader` by default will try loading the config file from `assets/locales.json`. This is a relative path which won't work with SSR. You could use one of the following approaches,
    1. Creating a factory function to override the default location with an absolute URL 
        ```ts
        export function localizeLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings, http: HttpClient) {
          return new LocalizeRouterHttpLoader(translate, location, settings, http, 'http://example.com/assets/locales.json');
        }
         
        LocalizeRouterModule.forRoot(routes, {
          parser: {
            provide: LocalizeParser,
            useFactory: localizeLoaderFactory,
            deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient]
          }
        })
        ```
    2. Using an HTTP interceptor in your `server.module` to convert relative paths to absolute ons, ex:
        ```ts
        intercept(request: HttpRequest<any>, next: HttpHandler) {
          if (request.url.startsWith('assets') && isPlatformServer(this.platformId)) {
            const req = this.injector.get(REQUEST);
            const url = req.protocol + '://' + req.get('host') + '/' + request.url;
            request = request.clone({
              url: url
            });
          }
          return next.handle(request);
        }
        
        ```
3. Let node server knows about the new routes:
    ```ts
    let fs = require('fs');
    let data: any = JSON.parse(fs.readFileSync(`src/assets/locales.json`, 'utf8'));
     
    app.get('/', ngApp);
    data.locales.forEach(route => {
      app.get(`/${route}`, ngApp);
      app.get(`/${route}/*`, ngApp);
    });
    ```
4. In case you want to use `cacheMechanism = CacheMechanism.Cookie` you will need to handle the cookie in your node server. Something like,

    ```ts
    app.use(cookieParser());
    
    app.get('/', (req, res) => {
      const defaultLang = 'de';
      const lang = req.acceptsLanguages('de', 'en');
      const cookieLang = req.cookies.LOCALIZE_DEFAULT_LANGUAGE; // This is the default name of cookie
    
      const definedLang = cookieLang || lang || defaultLang;
    
      res.redirect(301, `/${definedLang}/`);
    });
    ``` 

**Gotchas**

- In case you are using [domino](https://www.npmjs.com/package/domino) in your project, you will face the following error

  ```ts
  ERROR TypeError: Cannot read property 'indexOf' of undefined
  at TranslateService.getBrowserLang
  ```

  to overcome this, use the following:

  ```ts
  // language is readonly so normally you can't assign a value to it.
  // The following comments remove the compile time error and the IDE warning
  // @ts-ignore
  // noinspection JSAnnotator
  window.navigator.language = 'en';
  ```

#### Deal with initialNavigation

When you add Universal into your app you will have `initialNavigation` set to `"enabled"`. This is to avoid the flickering of the lazy-load.

Unfortunatly it doesn't help with this library and can cause issues.
So you need to set it to `"disabled"` and add the ngx-translate-router option `initialNavigation: true` to have this desired behavior.

```ts
imports: [
  RouterModule.forRoot(routes, { initialNavigation: 'disabled' }),
  LocalizeRouterModule.forRoot(routes, {
    ...
    initialNavigation: true
  })
]
```

### How it works

`@gilsdav/ngx-translate-router` intercepts Router initialization and translates each `path` and `redirectTo` path of Routes.
The translation process is done with [ngx-translate](https://github.com/ngx-translate/core). In order to separate 
router translations from normal application translations we use `prefix`. Default value for prefix is `ROUTES.`. Finally, in order to avoid accidentally translating a URL segment that should not be translated, you can optionally use `escapePrefix` so the prefix gets stripped and the segment doesn't get translated. Default `escapePrefix` is unset. 

```
'home' -> 'ROUTES.home'
```

Example to escape the translation of the segment with `escapePrefix: '!'`
```
'!segment' -> 'segment'
```
```
{ path: '!home/first' ... } -> '/fr/home/premier'
```

Upon every route change `@gilsdav/ngx-translate-router` kicks in to check if there was a change to language. Translated routes are prepended with two letter language code:
```
http://yourpath/home -> http://yourpath/en/home
```

If no language is provided in the url path, application uses: 
* cached language in LocalStorage/SessionStorage/Cookie (browser only) or
* current language of the browser (browser only) or 
* first locale in the config

Make sure you therefore place most common language (e.g. 'en') as a first string in the array of locales.

> Note that `ngx-translate-router` does not redirect routes like `my/route` to translated ones e.g. `en/my/route`. All routes are prepended by currently selected language so route without language is unknown to Router.

#### Excluding routes

Sometimes you might have a need to have certain routes excluded from the localization process e.g. login page, registration page etc. This is possible by setting flag `skipRouteLocalization` on route's data object.

In case you want to redirect to an url when skipRouteLocalization is activated, you can also provide config option `localizeRedirectTo` to skip route localization but localize redirect to. Otherwise, route and redirectTo will not be translated.

```ts
let routes = [
  // this route gets localized
  { path: 'home', component: HomeComponent },
  // this route will not be localized
  { path: 'login', component: LoginComponent, data: { skipRouteLocalization: true } }
    // this route will not be localized, but redirect to will do
  { path: 'logout', redirectTo: 'login', data: { skipRouteLocalization: { localizeRedirectTo: true } } }
];
```

Note that this flag should only be set on root routes. By excluding root route, all its sub routes are automatically excluded.
Setting this flag on sub route has no effect as parent route would already have or have not language prefix.

#### ngx-translate integration

`LocalizeRouter` depends on `ngx-translate` core service and automatically initializes it with selected locales.
Following code is run on `LocalizeParser` init:
```ts
this.translate.setDefaultLang(cachedLanguage || languageOfBrowser || firstLanguageFromConfig);
// ...
this.translate.use(languageFromUrl || cachedLanguage || languageOfBrowser || firstLanguageFromConfig);
```

Both `languageOfBrowser` and `languageFromUrl` are cross-checked with locales from config.

#### Path discrimination

Do you use same path to load multiple lazy-loaded modules and you have wrong component tree ?
`discriminantPathKey` will help ngx-translate-router to generate good component tree. 

```ts
  {
    path: '',
    loadChildren: () => import('app/home/home.module').then(m => m.HomeModule),
    data: {
        discriminantPathKey: 'HOMEPATH'
    }
  },
  {
    path: '',
    loadChildren: () => import('app/information/information.module').then(m => m.InformationModule),
    data: {
        discriminantPathKey: 'INFOPATH'
    }
  }
```

#### WildCard Path
##### Favored way

The favored way to use WildCard ( `'**'` path ) is to use the `redirectTo`. It will let the user to translate the "not found" page message.

```ts
{
  path: '404',
  component: NotFoundComponent
},
{
  path: '**',
  redirectTo: '/404'
}
```

##### Alternative

If you need to keep the wrong url you will face to a limitation: ***You can not translate current page.***
This limitation is because we can not determine the language from a wrong url.

```ts
{
  path: '**',
  component: NotFoundComponent
}
```

#### Matcher params translation

##### Configure routes
In case you want to translate some params of matcher, `localizeMatcher` provides you the way to do it through a function per each param. Make sure that the key is the same as the one used in the navigate path (example: if the function returns "map", it must be contained in the not localized path: `[routerLink]="['/matcher', 'aaa', 'map'] | localize"`) otherwise you will not be able to use `routerLinkActiveOptions`. 

Example: 

```ts
{
  path: 'matcher',
  children: [
    {
      matcher: detailMatcher,
      loadChildren: () => import('./matcher/matcher-detail/matcher-detail.module').then(mod => mod.MatcherDetailModule)
    },
    {
      matcher: baseMatcher,
      loadChildren: () => import('./matcher/matcher.module').then(mod => mod.MatcherModule),
      data: {
        localizeMatcher: {
          params: {
            mapPage: shouldTranslateMap
          }
        }
      }
    }
  ]
}

...

export function shouldTranslateMap(param: string): string {
  if (isNaN(+param)) {
    return 'map';
  }
  return null;
}
```

The output of the function should be `falsy` if the param must not be translated or should return the `key` (without prefix) you want to use when translating if you want to translate the param. 

Notice that any function that you use in `localizeMatcher` must be exported to be compatible with AOT.

##### Small changes to your matcher

We work with `UrlSegment` to split URL into "params" in basic `UrlMatchResult` but there is not enough information to apply the translations.

You must use the `LocalizedMatcherUrlSegment` type to more strongly associate a segment with a parameter. It contains only the `localizedParamName` attribute in addition to basic UrlSegment. Set this attribute before adding the segment into `consumed` and` posParams`.

```ts
const result: UrlMatchResult = {
  consumed: [],
  posParams: { }
};

...

(segment as LocalizedMatcherUrlSegment).localizedParamName = name;
result.consumed.push(segment);
result.posParams[name] = segment;
```

##### Matcher params translated without localizeMatcher issue
If the URL is accidentally translated from a language to another which creates an inconsistent state you have to enable `escapePrefix` mechanism. (example: `escapePrefix: '!'`)

### Pipe

`LocalizeRouterPipe` is used to translate `routerLink` directive's content. Pipe can be appended to partial strings in the routerLink's definition or to entire array element:
```html
<a [routerLink]="['user', userId, 'profile'] | localize">{{'USER_PROFILE' | translate}}</a>
<a [routerLink]="['about' | localize]">{{'ABOUT' | translate}}</a>
```

Root routes work the same way with addition that in case of root links, link is prepended by language.
Example for german language and link to 'about':
```
'/about' | localize -> '/de/über'
```

### Service

Routes can be manually translated using `LocalizeRouterService`. This is important if you want to use `router.navigate` for dynamical routes.

```ts
class MyComponent {
    constructor(private localize: LocalizeRouterService) { }

    myMethod() {
        let translatedPath: any = this.localize.translateRoute('about/me');
       
        // do something with translated path
        // e.g. this.router.navigate([translatedPath]);
    }
}
```

### AOT

In order to use Ahead-Of-Time compilation any custom loaders must be exported as functions.
This is the implementation currently in the solution:

```ts
export function localizeLoaderFactory(translate: TranslateService, location: Location, http: Http) {
  return new StaticParserLoader(translate, location, http);
}
```

## API
### LocalizeRouterModule
#### Methods:
- `forRoot(routes: Routes, config: LocalizeRouterConfig = {}): ModuleWithProviders`: Main initializer for @gilsdav/ngx-translate-router. Can provide custom configuration for more granular settings.
- `forChild(routes: Routes): ModuleWithProviders`: Child module initializer for providing child routes.
### LocalizeRouterConfig
#### Properties
- `parser`: Provider for loading of LocalizeParser. Default value is `StaticParserLoader`.
- `useCachedLang`: boolean. Flag whether default language should be cached. Default value is `true`.
- `alwaysSetPrefix`: boolean. Flag whether language should always prefix the url. Default value is `true`.  
  When value is `false`, prefix will not be used for for default language (this includes the situation when there is only one language).
- `cacheMechanism`: CacheMechanism.LocalStorage || CacheMechanism.SessionStorage || CacheMechanism.Cookie. Default value is `CacheMechanism.LocalStorage`.
- `cacheName`: string. Name of cookie/local store. Default value is `LOCALIZE_DEFAULT_LANGUAGE`.
- `defaultLangFunction`: (languages: string[], cachedLang?: string, browserLang?: string) => string. Override method for custom logic for picking default language, when no language is provided via url. Default value is `undefined`.
- `cookieFormat`: string. Format of cookie to store. Default value is `'{{value}};{{expires}}'`. (Extended format e.g : `'{{value}};{{expires}};path=/'`) 
  - `{{value}}` will be replaced by the value to save (`CACHE_NAME=language`). Must be present into format.
  - `{{expires}}` will be replaced by `expires=currentDate+30days`. Optional if you want session cookie.
    - you can configure the number of expiration days by using this synthax: `{{expires:365}}`. It will result as `expires=currentDate+365days`.
  - results to : `LOCALIZE_DEFAULT_LANGUAGE=en;expires=Wed, 11 Sep 2019 21:19:23 GMT`. 
### LocalizeRouterService
#### Properties:
- `routerEvents`: An EventEmitter to listen to language change event
```ts
localizeService.routerEvents.subscribe((language: string) => {
    // do something with language
});
```
- `parser`: Used instance of LocalizeParser
```ts
let selectedLanguage = localizeService.parser.currentLang;
```
#### Methods:
- `translateRoute(path: string | any[]): string | any[]`: Translates given path. If `path` starts with backslash then path is prepended with currently set language.
```ts
localizeService.translateRoute('/'); // -> e.g. '/en'
localizeService.translateRoute('/about'); // -> '/de/ueber-uns' (e.g. for German language)
localizeService.translateRoute('about'); // -> 'ueber-uns' (e.g. for German language)
```
- `changeLanguage(lang: string, extras?: NavigationExtras, useNavigateMethod?: boolean)`: Translates current url to given language and changes the application's language.
`extras` will be passed down to Angular Router navigation methods.
`userNavigateMethod` tells localize-router to use `navigate` rather than `navigateByUrl` method.  
For german language and route defined as `:lang/users/:user_name/profile`
```
yoursite.com/en/users/John%20Doe/profile -> yoursite.com/de/benutzer/John%20Doe/profil
```
#### Hooks:
For now there is only one hook which is only interesting if you are using `initialNavigation` flag (and more specifically, if you are making an `AppInitializer` that uses Angular's `Router` or `ngx-translate-router`).
- `hooks.initialized`: an observable with event sent when initialNavigation is executed.

Usage example:
```ts
export const appInitializerFactory = (injector: Injector) => {
  return () => {
    const localize = injector.get(LocalizeRouterService);
    return firstValueFrom(
      localize.hooks.initialized
        .pipe(
          tap(() => {
            const router = injector.get(Router);
            router.events.pipe(
              filter(url => url instanceof NavigationEnd),
              first()
            ).subscribe((route: NavigationEnd) => {
              console.log(router.url, route.url);
              router.navigate(['/fr/accueil']);
            });
          })
        )
      )
  }
};
```
### LocalizeParser
#### Properties:
- `locales`: Array of used language codes
- `currentLang`: Currently selected language
- `routes`: Active translated routes
- `urlPrefix`: Language prefix for current language. Empty string if `alwaysSetPrefix=false` and `currentLang` is same as default language.

#### Methods:
- `translateRoutes(language: string): Observable<any>`: Translates all the routes and sets language and current 
language across the application.
- `translateRoute(path: string): string`: Translates single path
- `getLocationLang(url?: string): string`: Extracts language from current url if matching defined locales

## License
Licensed under MIT

## Thanks
Thanks to all our contributors
<a href="https://github.com/gilsdav/ngx-translate-router/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=gilsdav/ngx-translate-router" />
</a>

As well as to all the contributors of the initial project
<a href="https://github.com/Greentube/localize-router/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=Greentube/localize-router" />
</a>
<sub>*Made with [contributors-img](https://contributors-img.web.app).*</sub>
