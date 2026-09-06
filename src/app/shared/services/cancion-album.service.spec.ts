import { TestBed } from '@angular/core/testing';

import { CancionAlbumService } from './cancion-album.service';

describe('CancionAlbumService', () => {
  let service: CancionAlbumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CancionAlbumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
