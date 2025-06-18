import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LocalizeRouterPipe } from 'ngx-translate-router';

@Component({
  selector: 'app-yoyo',
  templateUrl: './yoyo.component.html',
  styleUrls: ['./yoyo.component.css'],
  imports: [
    RouterOutlet,
    RouterLink,
    LocalizeRouterPipe
  ]
})
export class YoyoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
