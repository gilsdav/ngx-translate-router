import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatcherDetailComponent } from './matcher-detail.component';

describe('MatcherDetailComponent', () => {
  let component: MatcherDetailComponent;
  let fixture: ComponentFixture<MatcherDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatcherDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatcherDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
