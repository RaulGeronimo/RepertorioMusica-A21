import { TestBed } from '@angular/core/testing';

import { BúsquedaService } from './búsqueda.service';

describe('BúsquedaService', () => {
  let service: BúsquedaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BúsquedaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
