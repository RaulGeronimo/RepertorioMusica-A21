import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacoraCarga } from './bitacora-carga';

describe('BitacoraCarga', () => {
  let component: BitacoraCarga;
  let fixture: ComponentFixture<BitacoraCarga>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BitacoraCarga],
    }).compileComponents();

    fixture = TestBed.createComponent(BitacoraCarga);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
