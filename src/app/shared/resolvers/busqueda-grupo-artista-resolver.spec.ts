import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { busquedaGrupoArtistaResolver } from './busqueda-grupo-artista-resolver';

describe('busquedaGrupoArtistaResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => busquedaGrupoArtistaResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
