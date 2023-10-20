import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeErrorComponentComponent } from './mensaje-error-component.component';

describe('MensajeErrorComponentComponent', () => {
  let component: MensajeErrorComponentComponent;
  let fixture: ComponentFixture<MensajeErrorComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MensajeErrorComponentComponent]
    });
    fixture = TestBed.createComponent(MensajeErrorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
