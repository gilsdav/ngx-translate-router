import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatcherComponent } from './matcher.component';

describe('MatcherComponent', () => {
  let component: MatcherComponent;
  let fixture: ComponentFixture<MatcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [MatcherComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
