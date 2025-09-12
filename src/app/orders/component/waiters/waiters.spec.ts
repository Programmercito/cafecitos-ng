import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Waiters } from './waiters';

describe('Waiters', () => {
  let component: Waiters;
  let fixture: ComponentFixture<Waiters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waiters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Waiters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
