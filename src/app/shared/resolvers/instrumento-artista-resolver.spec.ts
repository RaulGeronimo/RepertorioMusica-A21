import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { instrumentoArtistaResolver } from './instrumento-artista-resolver';

describe('instrumentoArtistaResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => instrumentoArtistaResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
