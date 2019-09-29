import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingPagePage } from './loading-page.page';

describe('LoadingPagePage', () => {
  let component: LoadingPagePage;
  let fixture: ComponentFixture<LoadingPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
