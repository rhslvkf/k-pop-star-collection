import { TestBed } from '@angular/core/testing';

import { YoutubeEventListenerService } from './youtube-event-listener.service';

describe('YoutubeEventListenerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YoutubeEventListenerService = TestBed.get(YoutubeEventListenerService);
    expect(service).toBeTruthy();
  });
});
