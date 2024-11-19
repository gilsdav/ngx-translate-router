import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-test2',
    templateUrl: './test2.component.html',
    styleUrls: ['./test2.component.css'],
    imports: [RouterOutlet]
})
export class Test2Component implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('Test2 on init');
  }

}
