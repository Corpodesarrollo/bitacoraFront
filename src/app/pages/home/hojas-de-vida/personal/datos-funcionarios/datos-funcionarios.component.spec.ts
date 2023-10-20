import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosFuncionariosComponent } from './datos-funcionarios.component';

describe('DatosFuncionariosComponent', () => {
  let component: DatosFuncionariosComponent;
  let fixture: ComponentFixture<DatosFuncionariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatosFuncionariosComponent]
    });
    fixture = TestBed.createComponent(DatosFuncionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
