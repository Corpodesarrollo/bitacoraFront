import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeDescargarReporteComponent } from './mensaje-descargar-reporte.component';

describe('MensajeDescargarReporteComponent', () => {
  let component: MensajeDescargarReporteComponent;
  let fixture: ComponentFixture<MensajeDescargarReporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MensajeDescargarReporteComponent]
    });
    fixture = TestBed.createComponent(MensajeDescargarReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
