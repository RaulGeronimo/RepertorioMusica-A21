import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancionForm } from './cancion-form';

describe('CancionForm', () => {
  let component: CancionForm;
  let fixture: ComponentFixture<CancionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CancionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
