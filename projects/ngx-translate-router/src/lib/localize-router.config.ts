import { Inject, InjectionToken, Provider, Injectable, Optional } from '@angular/core';
import { Routes } from '@angular/router';
import { LocalizeRouterModule } from './localize-router.module';

/**
 * Guard to make sure we have single initialization of forRoot
 */
export const LOCALIZE_ROUTER_FORROOT_GUARD = new InjectionToken<LocalizeRouterModule>('LOCALIZE_ROUTER_FORROOT_GUARD');

/**
 * Static provider for keeping track of routes
 */
export const RAW_ROUTES: InjectionToken<Routes[]> = new InjectionToken<Routes[]>('RAW_ROUTES');

/**
 * Type for Caching of default language
 */
// export type CacheMechanism = 'LocalStorage' | 'Cookie';

/**
 * Namespace for fail proof access of CacheMechanism
 */
export enum CacheMechanism {
  LocalStorage = 'LocalStorage',
  Cookie = 'Cookie'
}

/**
 * Boolean to indicate whether to use cached language value
 */
export const USE_CACHED_LANG = new InjectionToken<boolean>('USE_CACHED_LANG');
/**
 * Cache mechanism type
 */
export const CACHE_MECHANISM = new InjectionToken<CacheMechanism>('CACHE_MECHANISM');
/**
 * Cache name
 */
export const CACHE_NAME = new InjectionToken<string>('CACHE_NAME');
/**
 * Cookie cache format
 */
export const COOKIE_FORMAT = new InjectionToken<boolean>('COOKIE_FORMAT');
/**
 * Cookie cache format
 */
export const INITIAL_NAVIGATION = new InjectionToken<boolean>('INITIAL_NAVIGATION');

/**
 * Type for default language function
 * Used to override basic behaviour
 */
export type DefaultLanguageFunction = (languages: string[], cachedLang?: string, browserLang?: string) => string;

/**
 * Function for calculating default language
 */
export const DEFAULT_LANG_FUNCTION = new InjectionToken<DefaultLanguageFunction>('DEFAULT_LANG_FUNCTION');

/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 */
export const ALWAYS_SET_PREFIX = new InjectionToken<boolean>('ALWAYS_SET_PREFIX');

/**
 * Config interface for LocalizeRouter
 */
export interface LocalizeRouterConfig {
  parser?: Provider;
  useCachedLang?: boolean;
  cacheMechanism?: CacheMechanism;
  cacheName?: string;
  defaultLangFunction?: DefaultLanguageFunction;
  alwaysSetPrefix?: boolean;
  cookieFormat?: string;
  initialNavigation?: boolean;
}

const LOCALIZE_CACHE_NAME = 'LOCALIZE_DEFAULT_LANGUAGE';
const DEFAULT_COOKIE_FORMAT = '{{value}};{{expires}}';
const DEFAULT_INITIAL_NAVIGATION = false;

@Injectable()
export class LocalizeRouterSettings implements LocalizeRouterConfig {

  public cacheMechanism: CacheMechanism;
  public defaultLangFunction: DefaultLanguageFunction;

  /**
   * Settings for localize router
   */
  constructor(
    @Inject(USE_CACHED_LANG) public useCachedLang: boolean = true,
    @Inject(ALWAYS_SET_PREFIX) public alwaysSetPrefix: boolean = true,
    @Inject(CACHE_MECHANISM) cacheMechanism = CacheMechanism.LocalStorage,
    @Inject(CACHE_NAME) public cacheName: string = LOCALIZE_CACHE_NAME,
    @Inject(DEFAULT_LANG_FUNCTION) defaultLangFunction = void 0,
    @Inject(COOKIE_FORMAT) public cookieFormat: string = DEFAULT_COOKIE_FORMAT,
    @Inject(INITIAL_NAVIGATION) public initialNavigation: boolean = DEFAULT_INITIAL_NAVIGATION,
  ) {
    this.cacheMechanism = cacheMechanism;
    this.defaultLangFunction = defaultLangFunction;
  }

}
