import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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
