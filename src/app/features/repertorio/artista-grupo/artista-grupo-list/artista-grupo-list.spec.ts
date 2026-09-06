import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistaGrupoList } from './artista-grupo-list';

describe('ArtistaGrupoList', () => {
  let component: ArtistaGrupoList;
  let fixture: ComponentFixture<ArtistaGrupoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtistaGrupoList],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistaGrupoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
