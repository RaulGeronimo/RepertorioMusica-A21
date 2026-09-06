import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoList } from './grupo-list';

describe('GrupoList', () => {
  let component: GrupoList;
  let fixture: ComponentFixture<GrupoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrupoList],
    }).compileComponents();

    fixture = TestBed.createComponent(GrupoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
