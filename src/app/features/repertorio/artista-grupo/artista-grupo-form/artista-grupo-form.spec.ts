import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistaGrupoForm } from './artista-grupo-form';

describe('ArtistaGrupoForm', () => {
  let component: ArtistaGrupoForm;
  let fixture: ComponentFixture<ArtistaGrupoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtistaGrupoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistaGrupoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
