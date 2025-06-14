import reducer, {
  fetch_register_user,
  fetch_login_user,
  fetch_user,
  fetch_logout,
  logout_user,
} from './slice_user';

const mockUser = {
  name: 'Bombatcat',
  email: 'bombatcat@mail.com',
};

describe('Тестирование редьюсера пользователя (альтернативный стиль)', () => {
  const baseState = {
    user_data: null,
    is_auth_checked: false,
    is_loading: true,
    error_message: null,
  };

  
  const getLoadedState = (state = baseState) => reducer(state, { type: 'unknown' });

  const runPendingTest = (actionType: string) => {
    const action = { type: actionType };
    const result = reducer(baseState, action);
    return {
      isLoading: result.is_loading,
      error: result.error_message,
    };
  };

  const runFulfilledTest = (actionType: string, payload: any) => {
    const action = { type: actionType, payload };
    return reducer(baseState, action);
  };

  const runRejectedTest = (actionType: string, message: string) => {
    const action = { type: actionType, payload: message };
    return reducer(baseState, action);
  };


  test('Возвращает начальное состояние при пустом действии', () => {
    expect(getLoadedState()).toEqual(baseState);
  });

  describe('Синхронное действие: выход из аккаунта', () => {
    const filledState = {
      user_data: mockUser,
      is_auth_checked: true,
      is_loading: false,
      error_message: 'Some error',
    };

    test('Очищает данные пользователя после выхода', () => {
      const result = reducer(filledState, logout_user());
      expect(result.user_data).toBeNull();
      expect(result.is_auth_checked).toBeFalsy();
    });
  });

  describe('fetch_register_user - регистрация', () => {
    test('pending - активирует загрузку и очищает ошибку', () => {
      const res = runPendingTest(fetch_register_user.pending.type);
      expect(res.isLoading).toBeTruthy();
      expect(res.error).toBeNull();
    });

    test('fulfilled - сохраняет данные пользователя', () => {
      const result = runFulfilledTest(fetch_register_user.fulfilled.type, {
        user: mockUser,
      });

      expect(result.user_data?.name).toBe(mockUser.name);
      expect(result.is_auth_checked).toBe(true);
      expect(result.is_loading).toBeFalsy();
    });

    test('rejected - записывает сообщение об ошибке', () => {
      const result = runRejectedTest(
        fetch_register_user.rejected.type,
        'Registration error'
      );

      expect(result.is_loading).toBeFalsy();
      expect(result.error_message).toBe('Registration error');
      expect(result.is_auth_checked).toBeFalsy();
    });
  });

  describe('fetch_login_user - вход в аккаунт', () => {
    test('pending - активирует индикатор загрузки', () => {
      const res = runPendingTest(fetch_login_user.pending.type);
      expect(res.isLoading).toBeTruthy();
    });

    test('fulfilled - обновляет данные пользователя', () => {
      const result = runFulfilledTest(fetch_login_user.fulfilled.type, {
        user: mockUser,
        accessToken: 'abc123',
        refreshToken: 'xyz789',
      });

      expect(result.user_data).toMatchObject(mockUser);
      expect(result.is_auth_checked).toBe(true);
      expect(result.is_loading).toBeFalsy();
    });

    test('rejected - устанавливает текст ошибки', () => {
      const result = runRejectedTest(
        fetch_login_user.rejected.type,
        'Login error'
      );

      expect(result.is_loading).toBeFalsy();
      expect(result.error_message).toBe('Login error');
      expect(result.is_auth_checked).toBe(true);
    });
  });

  describe('fetch_user - получение данных пользователя', () => {
    test('pending - включает загрузку', () => {
      const res = runPendingTest(fetch_user.pending.type);
      expect(res.isLoading).toBeTruthy();
    });

    test('fulfilled - устанавливает данные пользователя', () => {
      const result = runFulfilledTest(fetch_user.fulfilled.type, {
        user: mockUser,
      });

      expect(result.user_data).toHaveProperty('email', mockUser.email);
      expect(result.is_auth_checked).toBe(true);
      expect(result.is_loading).toBeFalsy();
    });

    test('rejected - записывает ошибку', () => {
      const result = runRejectedTest(
        fetch_user.rejected.type,
        'Fetch user error'
      );

      expect(result.is_loading).toBeFalsy();
      expect(result.error_message).toBe('Fetch user error');
      expect(result.is_auth_checked).toBe(true);
    });
  });

  describe('fetch_logout - выход через API', () => {
    const filledState = {
      user_data: mockUser,
      is_auth_checked: true,
      is_loading: false,
      error_message: 'Some error',
    };

    test('fulfilled - очищает данные пользователя', () => {
      const result = reducer(filledState, {
        type: fetch_logout.fulfilled.type,
      });

      expect(result).toEqual({
        user_data: null,
        is_auth_checked: false,
        is_loading: false,
        error_message: null,
      });
    });
  });
});