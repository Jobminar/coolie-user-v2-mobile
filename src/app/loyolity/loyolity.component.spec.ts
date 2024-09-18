import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyolityComponent } from './loyolity.component';

describe('LoyolityComponent', () => {
  let component: LoyolityComponent;
  let fixture: ComponentFixture<LoyolityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoyolityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoyolityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
