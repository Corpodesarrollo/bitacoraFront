import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoMensajeComponent } from './nuevo-mensaje.component';

describe('NuevoMensajeComponent', () => {
  let component: NuevoMensajeComponent;
  let fixture: ComponentFixture<NuevoMensajeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevoMensajeComponent]
    });
    fixture = TestBed.createComponent(NuevoMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
