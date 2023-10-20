import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarFotografiaComponent } from './cargar-fotografia.component';

describe('CargarFotografiaComponent', () => {
  let component: CargarFotografiaComponent;
  let fixture: ComponentFixture<CargarFotografiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargarFotografiaComponent]
    });
    fixture = TestBed.createComponent(CargarFotografiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
