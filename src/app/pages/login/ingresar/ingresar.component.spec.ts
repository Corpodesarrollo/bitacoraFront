import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarComponent } from './ingresar.component';

describe('IngresoComponent', () => {
  let component: IngresarComponent;
  let fixture: ComponentFixture<IngresarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngresarComponent]
    });
    fixture = TestBed.createComponent(IngresarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
