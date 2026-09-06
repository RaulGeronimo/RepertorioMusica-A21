import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistaList } from './artista-list';

describe('ArtistaList', () => {
  let component: ArtistaList;
  let fixture: ComponentFixture<ArtistaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtistaList],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
