import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosConsultaComponent } from './filtros-consulta.component';

describe('FiltrosConsultaComponent', () => {
  let component: FiltrosConsultaComponent;
  let fixture: ComponentFixture<FiltrosConsultaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltrosConsultaComponent]
    });
    fixture = TestBed.createComponent(FiltrosConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
