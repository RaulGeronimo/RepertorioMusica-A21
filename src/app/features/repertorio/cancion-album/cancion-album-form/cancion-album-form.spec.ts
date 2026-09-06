import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancionAlbumForm } from './cancion-album-form';

describe('CancionAlbumForm', () => {
  let component: CancionAlbumForm;
  let fixture: ComponentFixture<CancionAlbumForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancionAlbumForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CancionAlbumForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
