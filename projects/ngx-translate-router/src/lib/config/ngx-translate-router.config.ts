import { InjectionToken } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxTranslateRouterModule } from '../ngx-translate-router.module';

/**
 * Guard to make sure we have single initialization of forRoot
 */
export const LOCALIZE_ROUTER_FORROOT_GUARD = new InjectionToken<NgxTranslateRouterModule>('LOCALIZE_ROUTER_FORROOT_GUARD');

/**
 * Static provider for keeping track of routes
 */
export const RAW_ROUTES: InjectionToken<Routes[]> = new InjectionToken<Routes[]>('RAW_ROUTES');
