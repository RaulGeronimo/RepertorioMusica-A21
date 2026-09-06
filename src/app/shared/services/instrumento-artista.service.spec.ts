import { TestBed } from '@angular/core/testing';

import { InstrumentoArtistaService } from './instrumento-artista.service';

describe('InstrumentoArtistaService', () => {
  let service: InstrumentoArtistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstrumentoArtistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
