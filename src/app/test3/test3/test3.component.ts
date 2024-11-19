import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-test3',
    templateUrl: './test3.component.html',
    styleUrls: ['./test3.component.css'],
    imports: [RouterOutlet]
})
export class Test3Component implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('Test3 on init');
  }

}
