import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionAEComponent } from './sesion-ae.component';

describe('SesionAEComponent', () => {
  let component: SesionAEComponent;
  let fixture: ComponentFixture<SesionAEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SesionAEComponent]
    });
    fixture = TestBed.createComponent(SesionAEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
