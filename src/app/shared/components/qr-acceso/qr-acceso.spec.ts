import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrAcceso } from './qr-acceso';

describe('QrAcceso', () => {
  let component: QrAcceso;
  let fixture: ComponentFixture<QrAcceso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrAcceso],
    }).compileComponents();

    fixture = TestBed.createComponent(QrAcceso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
