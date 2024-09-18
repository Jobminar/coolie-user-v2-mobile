import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeperateSecheduleComponent } from './seperate-sechedule.component';

describe('SeperateSecheduleComponent', () => {
  let component: SeperateSecheduleComponent;
  let fixture: ComponentFixture<SeperateSecheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeperateSecheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeperateSecheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
