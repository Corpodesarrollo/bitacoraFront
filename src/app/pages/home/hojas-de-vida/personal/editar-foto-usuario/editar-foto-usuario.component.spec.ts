import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarFotoUsuarioComponent } from './editar-foto-usuario.component';

describe('EditarFotoUsuarioComponent', () => {
  let component: EditarFotoUsuarioComponent;
  let fixture: ComponentFixture<EditarFotoUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarFotoUsuarioComponent]
    });
    fixture = TestBed.createComponent(EditarFotoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
