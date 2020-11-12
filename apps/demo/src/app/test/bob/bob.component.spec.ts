import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BobComponent } from './bob.component';

describe('BobComponent', () => {
  let component: BobComponent;
  let fixture: ComponentFixture<BobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
