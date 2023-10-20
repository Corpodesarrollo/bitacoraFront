import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionAcademicaComponent } from './asignacion-academica.component';

describe('AsignacionAcademicaComponent', () => {
  let component: AsignacionAcademicaComponent;
  let fixture: ComponentFixture<AsignacionAcademicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignacionAcademicaComponent]
    });
    fixture = TestBed.createComponent(AsignacionAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
