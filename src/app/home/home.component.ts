import { Component, OnInit } from '@angular/core';
import { LocalizeRouterService } from 'ngx-translate-router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private localize: LocalizeRouterService) { }

  ngOnInit() {
  }

  public switchLang() {
    console.log('change lang');
    this.localize.changeLanguage(this.localize.parser.currentLang === 'fr' ? 'en' : 'fr');
  }

}
