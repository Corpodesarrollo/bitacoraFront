import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactivarUsuarioComponent } from './inactivar-usuario.component';

describe('InactivarUsuarioComponent', () => {
  let component: InactivarUsuarioComponent;
  let fixture: ComponentFixture<InactivarUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InactivarUsuarioComponent]
    });
    fixture = TestBed.createComponent(InactivarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
