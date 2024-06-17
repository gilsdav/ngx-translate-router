import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [RouterLink, RouterOutlet, LocalizeRouterPipe, TranslateModule]
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    console.log('home init');
  }

  ngOnDestroy() {
    console.log('home destroy');
  }

  public routerOutletActivation(active: boolean) {
    console.log('routerOutletActivation', active);
  }

}
