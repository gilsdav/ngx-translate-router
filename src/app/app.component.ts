import { Component, OnInit } from '@angular/core';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app';

    constructor(private localize: LocalizeRouterService) { }

    ngOnInit() {
        // this.routerService.changeLanguage('fr');
    }

    public routerOutletActivation(active: boolean) {
      console.log('routerOutletActivation', active);
    }

}
