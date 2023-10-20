import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigaPanComponent } from './miga-pan.component';

describe('MigaPanComponent', () => {
  let component: MigaPanComponent;
  let fixture: ComponentFixture<MigaPanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MigaPanComponent]
    });
    fixture = TestBed.createComponent(MigaPanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
