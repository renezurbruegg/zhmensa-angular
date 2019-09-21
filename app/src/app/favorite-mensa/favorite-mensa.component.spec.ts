import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteMensaComponent } from './favorite-mensa.component';

describe('FavoriteMensaComponent', () => {
  let component: FavoriteMensaComponent;
  let fixture: ComponentFixture<FavoriteMensaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteMensaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteMensaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
