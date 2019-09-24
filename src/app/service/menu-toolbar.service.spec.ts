import { TestBed } from '@angular/core/testing';

import { MenuToolBarService } from './menu-toolbar.service';

describe('MenuToolBarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuToolBarService = TestBed.get(MenuToolBarService);
    expect(service).toBeTruthy();
  });
});
