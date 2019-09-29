import { TestBed } from '@angular/core/testing';

import { PollServiceService } from './poll-service.service';

describe('PollServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PollServiceService = TestBed.get(PollServiceService);
    expect(service).toBeTruthy();
  });
});
