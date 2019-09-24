import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarPage } from './star.page';

describe('StarPage', () => {
  let component: StarPage;
  let fixture: ComponentFixture<StarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
