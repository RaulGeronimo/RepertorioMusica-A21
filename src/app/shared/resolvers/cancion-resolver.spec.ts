import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { cancionResolver } from './cancion-resolver';

describe('cancionResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => cancionResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
