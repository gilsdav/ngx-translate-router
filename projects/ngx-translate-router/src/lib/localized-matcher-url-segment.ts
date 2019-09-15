import { UrlSegment } from '@angular/router';

export type LocalizedMatcherUrlSegment = UrlSegment & { localizedParamName: string };
