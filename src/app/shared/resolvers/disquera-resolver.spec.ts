import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { disqueraResolver } from './disquera-resolver';

describe('disqueraResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => disqueraResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
