import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { TestRoutingModule } from './test-routing.module';
import { BobComponent } from './bob/bob.component';

@NgModule({
    imports: [
        CommonModule,
        TestRoutingModule,
        TranslateModule.forChild(),
        BobComponent
    ]
})
export class TestModule { }
