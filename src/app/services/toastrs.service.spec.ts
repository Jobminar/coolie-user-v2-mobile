import { TestBed } from '@angular/core/testing';

import { ToastrsService } from './toastrs.service';

describe('ToastrsService', () => {
  let service: ToastrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
