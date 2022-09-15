import {Injectable} from '@angular/core';
import {RouterStateSnapshot, TitleStrategy} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';


@Injectable()
export class TranslateTitleStrategy extends TitleStrategy {
  constructor(private translateService: TranslateService,
              private readonly title: Title) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let title = this.buildTitle(snapshot);
    if (!title) {
      title = 'DEFAULT_TITLE';
    }
    this.translateService.get(title).subscribe((translatedTitle) => {
      this.title.setTitle(translatedTitle);
    });
  }
}
