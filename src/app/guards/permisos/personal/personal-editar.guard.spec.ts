import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { personalEditarGuard } from './personal-editar.guard';

describe('personalEditarGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => personalEditarGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
