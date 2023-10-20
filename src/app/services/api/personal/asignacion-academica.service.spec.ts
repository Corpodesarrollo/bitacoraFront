import { TestBed } from '@angular/core/testing';

import { AsignacionAcademicaService } from './asignacion-academica.service';

describe('AsignacionAcademicaService', () => {
  let service: AsignacionAcademicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignacionAcademicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
