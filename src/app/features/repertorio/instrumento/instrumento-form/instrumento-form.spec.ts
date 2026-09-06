import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentoForm } from './instrumento-form';

describe('InstrumentoForm', () => {
  let component: InstrumentoForm;
  let fixture: ComponentFixture<InstrumentoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstrumentoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(InstrumentoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
