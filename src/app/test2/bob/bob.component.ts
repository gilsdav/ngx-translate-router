import { Component, OnInit } from '@angular/core';

import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';


@Component({
  selector: 'app-bob',
  templateUrl: './bob.component.html',
  styleUrls: ['./bob.component.css']
})
export class BobComponent implements OnInit {

  constructor(private localize: LocalizeRouterService) { }

  ngOnInit() {
    console.log('on init');
  }

  public switchLang() {
    console.log('change lang');
    this.localize.changeLanguage(this.localize.parser.currentLang === 'fr' ? 'en' : 'fr');
  }

}
