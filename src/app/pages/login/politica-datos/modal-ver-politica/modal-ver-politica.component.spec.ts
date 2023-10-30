import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerPoliticaComponent } from './modal-ver-politica.component';

describe('ModalVerPoliticaComponent', () => {
  let component: ModalVerPoliticaComponent;
  let fixture: ComponentFixture<ModalVerPoliticaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalVerPoliticaComponent]
    });
    fixture = TestBed.createComponent(ModalVerPoliticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
