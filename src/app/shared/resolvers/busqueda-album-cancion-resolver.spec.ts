import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { busquedaAlbumCancionResolver } from './busqueda-album-cancion-resolver';

describe('busquedaAlbumCancionResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => busquedaAlbumCancionResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
