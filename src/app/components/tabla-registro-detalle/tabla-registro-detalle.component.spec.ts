import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaRegistroDetalleComponent } from './tabla-registro-detalle.component';

describe('TablaRegistroDetalleComponent', () => {
  let component: TablaRegistroDetalleComponent;
  let fixture: ComponentFixture<TablaRegistroDetalleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaRegistroDetalleComponent]
    });
    fixture = TestBed.createComponent(TablaRegistroDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
