import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterOrderComponent } from './after-order.component';

describe('AfterOrderComponent', () => {
  let component: AfterOrderComponent;
  let fixture: ComponentFixture<AfterOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AfterOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AfterOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
