import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { grupoResolver } from './grupo-resolver';

describe('grupoResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => grupoResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
