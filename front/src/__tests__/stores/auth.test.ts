import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser, logout, setError } from '../../stores/auth/slice';
import { mockUser } from '../../__mocks__/data';
import { mockApiService } from '../../__mocks__/api';

jest.mock('../../services/api', () => ({
  apiService: mockApiService
}));

describe('Auth Slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
    jest.clearAllMocks();
  });

  test('should handle initial state', () => {
    const state = (store.getState() as any).auth;

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('should handle logout action', () => {
    // First set some authenticated state
    store.dispatch(loginUser.fulfilled({
      user: mockUser,
      token: 'test-token'
    }, '', { email: 'test@test.com', password: 'password' }));

    // Then logout
    store.dispatch(logout());

    const state = (store.getState() as any).auth;
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  test('should handle setError action', () => {
    const errorMessage = 'Test error message';
    store.dispatch(setError(errorMessage));

    const state = (store.getState() as any).auth;
    expect(state.error).toBe(errorMessage);
  });

  test('should handle loginUser.pending', () => {
    store.dispatch(loginUser.pending('', { email: 'test@test.com', password: 'password' }));

    const state = (store.getState() as any).auth;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle loginUser.fulfilled', () => {
    const payload = {
      user: mockUser,
      token: 'test-token'
    };

    store.dispatch(loginUser.fulfilled(payload, '', { email: 'test@test.com', password: 'password' }));

    const state = (store.getState() as any).auth;
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('test-token');
    expect(state.isAuthenticated).toBe(true);
  });

  test('should handle loginUser.rejected', () => {
    const errorMessage = 'Login failed';

    store.dispatch(loginUser.rejected(
      { name: 'Error', message: errorMessage },
      '',
      { email: 'test@test.com', password: 'password' },
      errorMessage
    ));

    const state = (store.getState() as any).auth;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.isAuthenticated).toBe(false);
  });
});
