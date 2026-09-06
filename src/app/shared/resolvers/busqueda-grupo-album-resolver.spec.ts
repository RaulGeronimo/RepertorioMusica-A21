import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { busquedaGrupoAlbumResolver } from './busqueda-grupo-album-resolver';

describe('busquedaGrupoAlbumResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => busquedaGrupoAlbumResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
