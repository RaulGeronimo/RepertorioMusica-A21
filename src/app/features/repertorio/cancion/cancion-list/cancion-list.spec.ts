import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancionList } from './cancion-list';

describe('CancionList', () => {
  let component: CancionList;
  let fixture: ComponentFixture<CancionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancionList],
    }).compileComponents();

    fixture = TestBed.createComponent(CancionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
