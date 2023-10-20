import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarCerrarSesionComponent } from './confirmar-cerrar-sesion.component';

describe('ConfirmarCerrarSesionComponent', () => {
  let component: ConfirmarCerrarSesionComponent;
  let fixture: ComponentFixture<ConfirmarCerrarSesionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmarCerrarSesionComponent]
    });
    fixture = TestBed.createComponent(ConfirmarCerrarSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
