import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesosDirectosComponent } from './accesos-directos.component';

describe('AccesosDirectosComponent', () => {
  let component: AccesosDirectosComponent;
  let fixture: ComponentFixture<AccesosDirectosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccesosDirectosComponent]
    });
    fixture = TestBed.createComponent(AccesosDirectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
