import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorInicioComponent } from './error-inicio.component';

describe('ErrorInicioComponent', () => {
  let component: ErrorInicioComponent;
  let fixture: ComponentFixture<ErrorInicioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorInicioComponent]
    });
    fixture = TestBed.createComponent(ErrorInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
