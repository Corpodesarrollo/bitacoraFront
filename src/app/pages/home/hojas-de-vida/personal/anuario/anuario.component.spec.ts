import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuarioComponent } from './anuario.component';

describe('AnuarioComponent', () => {
  let component: AnuarioComponent;
  let fixture: ComponentFixture<AnuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnuarioComponent]
    });
    fixture = TestBed.createComponent(AnuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
