import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';

@Component({
  selector: 'app-yoyo',
  templateUrl: './yoyo.component.html',
  styleUrls: ['./yoyo.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    LocalizeRouterModule
  ]
})
export class YoyoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
