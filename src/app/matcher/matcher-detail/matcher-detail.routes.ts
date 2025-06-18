import { Routes, UrlSegment, UrlMatchResult } from '@angular/router';

import { LocalizedMatcherUrlSegment } from 'ngx-translate-router';

import { MatcherDetailComponent } from './matcher-detail.component';

export function detailMatcher(baseSegments: UrlSegment[]): UrlMatchResult {
  const segments = [...baseSegments];
  // /:id
  // /:a/:id
  // /:a/:b/:id
  // /:a/:b/:c/:id

  if (!segments.length || !isId(segments[segments.length - 1])) {
    return null;
  }

  const result: UrlMatchResult = {
    consumed: [],
    posParams: { }
  };

  for (const segment of 'abc'.substr(0, segments.length - 1)) {
    takeSegment(segment);
  }
  takeSegment('id');

  return result;

  function takeSegment(name: string): void {
    const segment = segments.shift();
    (segment as LocalizedMatcherUrlSegment).localizedParamName = name;
    result.consumed.push(segment);
    result.posParams[name] = segment;
  }
  function isId(url: UrlSegment): boolean {
    return (url.path.startsWith('ROUTES.') ? url.path.substring(7) : url.path).match(/^[a-f\d]{8}$/i) !== null;
  }
}

export const matcherDetailRoutes: Routes = [
  { path: '', component: MatcherDetailComponent, data: { discriminantPathKey: 'DETAIL' } }
];
