import { TestBed } from '@angular/core/testing';

import { Login } from './login-api';

describe('Login', () => {
  let service: Login;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Login);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
