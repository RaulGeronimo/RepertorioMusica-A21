import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { artistaGrupoResolver } from './artista-grupo-resolver';

describe('artistaGrupoResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => artistaGrupoResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
