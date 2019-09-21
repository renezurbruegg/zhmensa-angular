import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCardComponentComponent } from './menu-card-component.component';

describe('MenuCardComponentComponent', () => {
  let component: MenuCardComponentComponent;
  let fixture: ComponentFixture<MenuCardComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCardComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
