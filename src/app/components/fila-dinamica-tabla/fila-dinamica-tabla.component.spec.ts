import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilaDinamicaTablaComponent } from './fila-dinamica-tabla.component';

describe('FilaDinamicaTablaComponent', () => {
  let component: FilaDinamicaTablaComponent;
  let fixture: ComponentFixture<FilaDinamicaTablaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilaDinamicaTablaComponent]
    });
    fixture = TestBed.createComponent(FilaDinamicaTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
