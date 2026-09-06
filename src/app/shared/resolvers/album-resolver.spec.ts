import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { albumResolver } from './album-resolver';

describe('albumResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => albumResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
