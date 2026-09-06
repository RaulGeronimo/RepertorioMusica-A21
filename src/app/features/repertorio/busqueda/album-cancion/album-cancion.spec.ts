import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumCancion } from './album-cancion';

describe('AlbumCancion', () => {
  let component: AlbumCancion;
  let fixture: ComponentFixture<AlbumCancion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlbumCancion],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumCancion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
