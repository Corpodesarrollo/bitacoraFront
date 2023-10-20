import { TestBed } from '@angular/core/testing';

import { ContraseniaService } from './contrasenia.service';

describe('ContraseniaService', () => {
  let service: ContraseniaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContraseniaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
