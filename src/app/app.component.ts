import { Component, OnInit } from '@angular/core';
import { LocalizeRouterService, LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    LocalizeRouterPipe,
    TranslateModule
  ]
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private localize: LocalizeRouterService) { }

  ngOnInit() {
    // should be triggered on every language change
    this.localize.routerEvents.subscribe((language: string) => {
      console.log(language);
      console.log('app-comp', this.localize.translateRoute('/'));
      console.log('app-comp', this.localize.translateRoute('/?test=ok'));
      console.log('app-comp', this.localize.translateRoute('/bob?test=coucou'));
      console.log('app-comp', this.localize.translateRoute('bob?test=coucou'));
    });
  }

  public routerOutletActivation(active: boolean) {
    console.log('routerOutletActivation', active);
  }

  public switchLang() {
    console.log('change lang replaceUrl');
    this.localize.changeLanguage(this.localize.parser.currentLang === 'fr' ? 'en' : 'fr', { replaceUrl: true });
  }

}
