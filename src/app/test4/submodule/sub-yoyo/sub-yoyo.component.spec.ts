/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SubYoyoComponent } from './sub-yoyo.component';

describe('SubYoyoComponent', () => {
  let component: SubYoyoComponent;
  let fixture: ComponentFixture<SubYoyoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubYoyoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubYoyoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
