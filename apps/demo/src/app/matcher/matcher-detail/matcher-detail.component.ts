import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-matcher-detail',
  templateUrl: './matcher-detail.component.html',
  styleUrls: ['./matcher-detail.component.css']
})
export class MatcherDetailComponent implements OnInit, OnDestroy {

  params: string[] = [];
  private paramsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log('init');
    this.paramsSubscription = this.route.paramMap.subscribe((paramMap) => {
      console.log('params:', paramMap);
      this.params = [];
      const keys = [...paramMap.keys];
      for (const key of keys) {
        this.params.push(`${key}: ${paramMap.get(key)}`);
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

}
