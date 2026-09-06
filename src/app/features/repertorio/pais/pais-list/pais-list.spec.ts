import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaisList } from './pais-list';

describe('PaisList', () => {
  let component: PaisList;
  let fixture: ComponentFixture<PaisList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaisList],
    }).compileComponents();

    fixture = TestBed.createComponent(PaisList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
