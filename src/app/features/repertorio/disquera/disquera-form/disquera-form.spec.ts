import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisqueraForm } from './disquera-form';

describe('DisqueraForm', () => {
  let component: DisqueraForm;
  let fixture: ComponentFixture<DisqueraForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisqueraForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DisqueraForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
