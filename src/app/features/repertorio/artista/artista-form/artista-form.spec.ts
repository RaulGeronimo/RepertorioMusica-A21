import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistaForm } from './artista-form';

describe('ArtistaForm', () => {
  let component: ArtistaForm;
  let fixture: ComponentFixture<ArtistaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtistaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
