import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { BobComponent } from './bob/bob.component';

@NgModule({
    imports: [
        CommonModule,
        TestRoutingModule,
        BobComponent
    ]
})
export class TestModule { }
