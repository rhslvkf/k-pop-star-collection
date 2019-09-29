import { TestBed } from '@angular/core/testing';

import { VliveService } from './vlive.service';

describe('VliveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VliveService = TestBed.get(VliveService);
    expect(service).toBeTruthy();
  });
});
