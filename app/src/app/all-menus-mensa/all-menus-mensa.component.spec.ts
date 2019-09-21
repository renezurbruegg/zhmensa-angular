import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMenusMensaComponent } from './all-menus-mensa.component';

describe('AllMenusMensaComponent', () => {
  let component: AllMenusMensaComponent;
  let fixture: ComponentFixture<AllMenusMensaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllMenusMensaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMenusMensaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
