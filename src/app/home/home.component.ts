import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterLink, RouterOutlet, LocalizeRouterPipe, TranslatePipe]
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
