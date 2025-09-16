import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commisions } from './commisions';

describe('Commisions', () => {
  let component: Commisions;
  let fixture: ComponentFixture<Commisions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commisions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Commisions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
