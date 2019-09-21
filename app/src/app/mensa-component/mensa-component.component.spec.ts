import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensaComponentComponent } from './mensa-component.component';

describe('MensaComponentComponent', () => {
  let component: MensaComponentComponent;
  let fixture: ComponentFixture<MensaComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensaComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensaComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
