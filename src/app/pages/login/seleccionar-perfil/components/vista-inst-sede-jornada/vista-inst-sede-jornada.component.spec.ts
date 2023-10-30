import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaInstSedeJornadaComponent } from './vista-inst-sede-jornada.component';

describe('VistaInstSedeJornadaComponent', () => {
  let component: VistaInstSedeJornadaComponent;
  let fixture: ComponentFixture<VistaInstSedeJornadaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaInstSedeJornadaComponent]
    });
    fixture = TestBed.createComponent(VistaInstSedeJornadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
