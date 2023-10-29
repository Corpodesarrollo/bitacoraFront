import { TestBed } from '@angular/core/testing';

import { UsuarioFiltrosService } from './usuario-filtros.service';

describe('UsuarioFiltrosService', () => {
  let service: UsuarioFiltrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioFiltrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
