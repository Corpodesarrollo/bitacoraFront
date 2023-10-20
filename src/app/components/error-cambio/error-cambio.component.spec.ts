import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorCambioComponent } from './error-cambio.component';

describe('ErrorCambioComponent', () => {
  let component: ErrorCambioComponent;
  let fixture: ComponentFixture<ErrorCambioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorCambioComponent]
    });
    fixture = TestBed.createComponent(ErrorCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
