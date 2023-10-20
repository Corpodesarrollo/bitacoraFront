import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesasociarFuncionarioComponent } from './desasociar-funcionario.component';

describe('DesasociarFuncionarioComponent', () => {
  let component: DesasociarFuncionarioComponent;
  let fixture: ComponentFixture<DesasociarFuncionarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesasociarFuncionarioComponent]
    });
    fixture = TestBed.createComponent(DesasociarFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
