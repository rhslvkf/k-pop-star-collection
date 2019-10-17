import { TestBed } from '@angular/core/testing';

import { StreamingchartService } from './streamingchart.service';

describe('StreamingchartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StreamingchartService = TestBed.get(StreamingchartService);
    expect(service).toBeTruthy();
  });
});
