import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pendings } from './pendings';

describe('Pendings', () => {
  let component: Pendings;
  let fixture: ComponentFixture<Pendings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pendings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pendings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
