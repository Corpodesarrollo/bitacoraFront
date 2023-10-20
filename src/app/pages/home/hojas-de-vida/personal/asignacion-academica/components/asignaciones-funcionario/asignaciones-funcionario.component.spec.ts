import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionesFuncionarioComponent } from './asignaciones-funcionario.component';

describe('AsignacionesFuncionarioComponent', () => {
  let component: AsignacionesFuncionarioComponent;
  let fixture: ComponentFixture<AsignacionesFuncionarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignacionesFuncionarioComponent]
    });
    fixture = TestBed.createComponent(AsignacionesFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
