import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaColegiosComponent } from './lista-colegios.component';

describe('ListaColegiosComponent', () => {
  let component: ListaColegiosComponent;
  let fixture: ComponentFixture<ListaColegiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaColegiosComponent]
    });
    fixture = TestBed.createComponent(ListaColegiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
