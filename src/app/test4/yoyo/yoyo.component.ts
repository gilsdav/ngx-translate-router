import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';

@Component({
  selector: 'app-yoyo',
  templateUrl: './yoyo.component.html',
  styleUrls: ['./yoyo.component.css'],
  standalone: true,
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
