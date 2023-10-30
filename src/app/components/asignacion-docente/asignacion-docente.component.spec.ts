import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionDocenteComponent } from './asignacion-docente.component';

describe('AsinacionDocenteComponent', () => {
  let component: AsignacionDocenteComponent;
  let fixture: ComponentFixture<AsignacionDocenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignacionDocenteComponent]
    });
    fixture = TestBed.createComponent(AsignacionDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
