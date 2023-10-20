import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAsignacionAcademicaComponent } from './ver-asignacion-academica.component';

describe('VerAsignacionAcademicaComponent', () => {
  let component: VerAsignacionAcademicaComponent;
  let fixture: ComponentFixture<VerAsignacionAcademicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerAsignacionAcademicaComponent]
    });
    fixture = TestBed.createComponent(VerAsignacionAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
