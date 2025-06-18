import { Component, OnInit } from '@angular/core';
import { LocalizeRouterService, LocalizeRouterPipe } from 'ngx-translate-router';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterLink,
    RouterOutlet,
    TranslatePipe,
    LocalizeRouterPipe
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
