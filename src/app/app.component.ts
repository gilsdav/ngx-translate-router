import { Component, OnInit } from '@angular/core';
import { NgxTranslateRouterService } from 'ngx-translate-router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app';

    constructor(private routerService: NgxTranslateRouterService) { }

    ngOnInit() {
        this.routerService.changeLanguage('fr');
    }

}
