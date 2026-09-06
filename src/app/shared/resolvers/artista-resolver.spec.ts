import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { artistaResolver } from './artista-resolver';

describe('artistaResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => artistaResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
