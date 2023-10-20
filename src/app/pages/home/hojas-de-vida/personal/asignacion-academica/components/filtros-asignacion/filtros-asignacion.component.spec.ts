import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosAsignacionComponent } from './filtros-asignacion.component';

describe('FiltrosComponent', () => {
  let component: FiltrosAsignacionComponent;
  let fixture: ComponentFixture<FiltrosAsignacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltrosAsignacionComponent]
    });
    fixture = TestBed.createComponent(FiltrosAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
