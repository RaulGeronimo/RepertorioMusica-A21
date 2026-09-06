import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancionAlbumList } from './cancion-album-list';

describe('CancionAlbumList', () => {
  let component: CancionAlbumList;
  let fixture: ComponentFixture<CancionAlbumList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancionAlbumList],
    }).compileComponents();

    fixture = TestBed.createComponent(CancionAlbumList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
