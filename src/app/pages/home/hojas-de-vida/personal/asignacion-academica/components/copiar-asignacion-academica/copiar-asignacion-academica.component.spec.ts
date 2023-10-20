import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopiarAsignacionAcademicaComponent } from './copiar-asignacion-academica.component';

describe('CopiarAsignacionAcademicaComponent', () => {
  let component: CopiarAsignacionAcademicaComponent;
  let fixture: ComponentFixture<CopiarAsignacionAcademicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopiarAsignacionAcademicaComponent]
    });
    fixture = TestBed.createComponent(CopiarAsignacionAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
