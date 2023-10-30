import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPoliticasComponent } from './ver-politicas.component';

describe('VerPoliticasComponent', () => {
  let component: VerPoliticasComponent;
  let fixture: ComponentFixture<VerPoliticasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerPoliticasComponent]
    });
    fixture = TestBed.createComponent(VerPoliticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
