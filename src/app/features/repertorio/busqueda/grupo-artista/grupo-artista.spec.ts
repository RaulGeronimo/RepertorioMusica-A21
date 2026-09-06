import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoArtista } from './grupo-artista';

describe('GrupoArtista', () => {
  let component: GrupoArtista;
  let fixture: ComponentFixture<GrupoArtista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrupoArtista],
    }).compileComponents();

    fixture = TestBed.createComponent(GrupoArtista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
