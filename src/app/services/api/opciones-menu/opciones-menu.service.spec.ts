import { TestBed } from '@angular/core/testing';

import { OpcionesMenuService } from './opciones-menu.service';

describe('OpcionesMenuService', () => {
  let service: OpcionesMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpcionesMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
