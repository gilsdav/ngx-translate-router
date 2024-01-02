import { LocalizeParser, LocalizeRouterSettings } from '@gilsdav/ngx-translate-router';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';
import { Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';


/**
 * Config interface
 */
export interface ILocalizeRouterParserConfig {
  locales: Array<string>;
  prefix?: string;
  escapePrefix?: string;
}

export class LocalizeRouterHttpLoader extends LocalizeParser {
  /**
   * CTOR
   * @param translate
   * @param location
   * @param settings
   * @param http
   * @param path
   */
  constructor(
    translate: TranslateService,
    location: Location,
    settings: LocalizeRouterSettings,
    private http: HttpClient,
    private path: string = 'assets/locales.json'
  ) {
    super(translate, location, settings);
  }

  /**
   * Initialize or append routes
   * @param routes
   */
  load(routes: Routes): Promise<any> {
    return new Promise((resolve: any) => {
      firstValueFrom(
        this.http.get(this.path)
      ).then((data: ILocalizeRouterParserConfig) => {
        this.locales = data.locales;
        this.prefix = data.prefix || '';
        this.escapePrefix = data.escapePrefix || '';
        this.init(routes).then(resolve);
      });
    });

  }
}
