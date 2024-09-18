import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackproviderComponent } from './trackprovider.component';

describe('TrackproviderComponent', () => {
  let component: TrackproviderComponent;
  let fixture: ComponentFixture<TrackproviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackproviderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackproviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
