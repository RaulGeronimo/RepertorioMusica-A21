import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentoList } from './instrumento-list';

describe('InstrumentoList', () => {
  let component: InstrumentoList;
  let fixture: ComponentFixture<InstrumentoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstrumentoList],
    }).compileComponents();

    fixture = TestBed.createComponent(InstrumentoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
