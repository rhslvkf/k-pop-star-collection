import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingchartPage } from './streamingchart.page';

describe('StreamingchartPage', () => {
  let component: StreamingchartPage;
  let fixture: ComponentFixture<StreamingchartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamingchartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamingchartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
