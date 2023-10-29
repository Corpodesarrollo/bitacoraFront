import { TestBed } from '@angular/core/testing';

import { TipoLogService } from './tipo-log.service';

describe('TipoLogService', () => {
  let service: TipoLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
