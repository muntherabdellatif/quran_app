import { TestBed } from '@angular/core/testing';

import { SideBarService } from './side_bar.service';

describe('QuranAriaService', () => {
  let service: SideBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
