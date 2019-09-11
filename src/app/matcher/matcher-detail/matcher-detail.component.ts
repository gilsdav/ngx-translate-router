import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-matcher-detail',
  templateUrl: './matcher-detail.component.html',
  styleUrls: ['./matcher-detail.component.css']
})
export class MatcherDetailComponent implements OnInit {

  params: string[][] = [];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.params = [];
      const keys = [...paramMap.keys];
      for (let index = keys.length - 2; index >= 0 ; index--) {
        this.params.push(['/matcher', ...keys.slice(0, index), keys[keys.length - 1]]);
      }
      this.params.push(['/matcher']);
    });
  }

}
