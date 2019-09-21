import { TestBed } from '@angular/core/testing';

import { MensaRouteService } from './mensa-route.service';

describe('MensaRouteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MensaRouteService = TestBed.get(MensaRouteService);
    expect(service).toBeTruthy();
  });
});
