import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisqueraList } from './disquera-list';

describe('DisqueraList', () => {
  let component: DisqueraList;
  let fixture: ComponentFixture<DisqueraList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisqueraList],
    }).compileComponents();

    fixture = TestBed.createComponent(DisqueraList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
