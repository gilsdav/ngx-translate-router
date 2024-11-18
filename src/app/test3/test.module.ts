import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { BobComponent } from './bob/bob.component';
import { Test3Component } from './test3/test3.component';

@NgModule({
    imports: [
        CommonModule,
        TestRoutingModule,
        BobComponent,
        Test3Component
    ]
})
export class TestModule { }
