import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContrasenaComponent } from './cambiar-contrasena.component';

describe('CambiarContrasenaComponent', () => {
  let component: CambiarContrasenaComponent;
  let fixture: ComponentFixture<CambiarContrasenaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CambiarContrasenaComponent]
    });
    fixture = TestBed.createComponent(CambiarContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
