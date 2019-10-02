import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollOverviewComponent } from './poll-overview.component';

describe('PollOverviewComponent', () => {
  let component: PollOverviewComponent;
  let fixture: ComponentFixture<PollOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
