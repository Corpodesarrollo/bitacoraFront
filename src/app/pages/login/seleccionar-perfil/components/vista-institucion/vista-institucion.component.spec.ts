import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelInstitucionCuatroComponent } from './vista-institucion.component';

describe('NivelInstitucionCuatroComponent', () => {
  let component: NivelInstitucionCuatroComponent;
  let fixture: ComponentFixture<NivelInstitucionCuatroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NivelInstitucionCuatroComponent]
    });
    fixture = TestBed.createComponent(NivelInstitucionCuatroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
