import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { busquedaGrupoCancionResolver } from './busqueda-grupo-cancion-resolver';

describe('busquedaGrupoCancionResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => busquedaGrupoCancionResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
