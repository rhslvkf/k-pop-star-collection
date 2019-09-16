import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VlivePage } from './vlive.page';

describe('VlivePage', () => {
  let component: VlivePage;
  let fixture: ComponentFixture<VlivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VlivePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VlivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
