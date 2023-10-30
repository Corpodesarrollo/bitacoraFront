import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaNoInstitucionComponent } from './vista-no-institucion.component';

describe('VistaNoInstitucionComponent', () => {
  let component: VistaNoInstitucionComponent;
  let fixture: ComponentFixture<VistaNoInstitucionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaNoInstitucionComponent]
    });
    fixture = TestBed.createComponent(VistaNoInstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
