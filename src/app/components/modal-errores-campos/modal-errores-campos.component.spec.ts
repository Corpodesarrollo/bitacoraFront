import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalErroresCamposComponent } from './modal-errores-campos.component';

describe('ModalErroresCamposComponent', () => {
  let component: ModalErroresCamposComponent;
  let fixture: ComponentFixture<ModalErroresCamposComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalErroresCamposComponent]
    });
    fixture = TestBed.createComponent(ModalErroresCamposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
