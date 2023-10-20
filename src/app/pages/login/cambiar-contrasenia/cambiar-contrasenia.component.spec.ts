import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContraseniaComponentLogin } from './cambiar-contrasenia.component';

describe('CambiarContraseniaComponent', () => {
  let component: CambiarContraseniaComponentLogin;
  let fixture: ComponentFixture<CambiarContraseniaComponentLogin>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CambiarContraseniaComponentLogin]
    });
    fixture = TestBed.createComponent(CambiarContraseniaComponentLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
