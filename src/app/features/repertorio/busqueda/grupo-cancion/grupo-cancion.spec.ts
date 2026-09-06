import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoCancion } from './grupo-cancion';

describe('GrupoCancion', () => {
  let component: GrupoCancion;
  let fixture: ComponentFixture<GrupoCancion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrupoCancion],
    }).compileComponents();

    fixture = TestBed.createComponent(GrupoCancion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
