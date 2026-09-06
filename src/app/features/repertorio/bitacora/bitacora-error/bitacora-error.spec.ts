import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacoraError } from './bitacora-error';

describe('BitacoraError', () => {
  let component: BitacoraError;
  let fixture: ComponentFixture<BitacoraError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BitacoraError],
    }).compileComponents();

    fixture = TestBed.createComponent(BitacoraError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
