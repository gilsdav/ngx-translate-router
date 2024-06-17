import { Component, OnInit } from '@angular/core';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css'],
    standalone: true,
    imports: [RouterLink, LocalizeRouterPipe]
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
