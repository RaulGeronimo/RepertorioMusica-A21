import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentoArtistaForm } from './instrumento-artista-form';

describe('InstrumentoArtistaForm', () => {
  let component: InstrumentoArtistaForm;
  let fixture: ComponentFixture<InstrumentoArtistaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstrumentoArtistaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(InstrumentoArtistaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
