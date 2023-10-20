import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaDatosComponent } from './politica-datos.component';

describe('PoliticaDatosComponent', () => {
  let component: PoliticaDatosComponent;
  let fixture: ComponentFixture<PoliticaDatosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoliticaDatosComponent]
    });
    fixture = TestBed.createComponent(PoliticaDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
