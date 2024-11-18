import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { BobComponent } from './bob/bob.component';
import { Test2Component } from './test2/test2.component';

@NgModule({
    imports: [
        CommonModule,
        TestRoutingModule,
        BobComponent,
        Test2Component
    ]
})
export class TestModule { }
