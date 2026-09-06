import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { paisResolver } from './pais-resolver';

describe('paisResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => paisResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
