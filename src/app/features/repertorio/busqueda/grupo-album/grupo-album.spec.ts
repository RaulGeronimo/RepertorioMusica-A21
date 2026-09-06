import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoAlbum } from './grupo-album';

describe('GrupoAlbum', () => {
  let component: GrupoAlbum;
  let fixture: ComponentFixture<GrupoAlbum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrupoAlbum],
    }).compileComponents();

    fixture = TestBed.createComponent(GrupoAlbum);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
