import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { cancionAlbumResolver } from './cancion-album-resolver';

describe('cancionAlbumResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => cancionAlbumResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
