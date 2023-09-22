import { TestBed } from '@angular/core/testing';

import { ReadServiceService } from './read-service.service';

describe('ReadServiceService', () => {
  let service: ReadServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
