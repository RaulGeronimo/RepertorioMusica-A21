import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentoArtistaList } from './instrumento-artista-list';

describe('InstrumentoArtistaList', () => {
  let component: InstrumentoArtistaList;
  let fixture: ComponentFixture<InstrumentoArtistaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstrumentoArtistaList],
    }).compileComponents();

    fixture = TestBed.createComponent(InstrumentoArtistaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
