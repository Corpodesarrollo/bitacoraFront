import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDatosDocenteComponent } from './editar-datos-docente.component';

describe('EditarDatosDocenteComponent', () => {
  let component: EditarDatosDocenteComponent;
  let fixture: ComponentFixture<EditarDatosDocenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarDatosDocenteComponent]
    });
    fixture = TestBed.createComponent(EditarDatosDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
