import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaisForm } from './pais-form';

describe('PaisForm', () => {
  let component: PaisForm;
  let fixture: ComponentFixture<PaisForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaisForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PaisForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
