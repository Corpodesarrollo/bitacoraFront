import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinPerfilComponent } from './sin-perfil.component';

describe('SinPerfilComponent', () => {
  let component: SinPerfilComponent;
  let fixture: ComponentFixture<SinPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinPerfilComponent]
    });
    fixture = TestBed.createComponent(SinPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
