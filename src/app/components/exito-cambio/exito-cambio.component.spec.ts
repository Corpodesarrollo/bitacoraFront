import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitoCambioComponent } from './exito-cambio.component';

describe('ExitoCambioComponent', () => {
  let component: ExitoCambioComponent;
  let fixture: ComponentFixture<ExitoCambioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExitoCambioComponent]
    });
    fixture = TestBed.createComponent(ExitoCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
