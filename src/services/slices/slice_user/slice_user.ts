import {
  TRegisterData,
  loginUserApi,
  TLoginData,
  getUserApi,
  logoutApi,
  updateUserApi,
  registerUserApi
} from '../../../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../../utils/cookie';

type TUser_State = {
  user_data: TUser | null;
  is_auth_checked: boolean;
  is_loading: boolean;
  error_message: string | null;
};

const initialState: TUser_State = {
  user_data: null,
  is_auth_checked: false,
  is_loading: true,
  error_message: null
};

const set_auth_tokens = (access_token: string, refresh_token: string) => {
  setCookie('accessToken', access_token);
  localStorage.setItem('refreshToken', refresh_token);
};

const clear_auth_tokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

const handle_error = (error: unknown, default_message: string) => {
  if (error instanceof Error) {
    return error.message || default_message;
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    return (error as any).response?.data?.message || default_message;
  } else {
    return default_message;
  }
};

export const fetch_register_user = createAsyncThunk(
  'user/fetch_register_user',
  async (register_data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(register_data);
      return response;
    } catch (error) {
      return rejectWithValue(handle_error(error, 'Ошибка при регистрации'));
    }
  }
);

export const fetch_login_user = createAsyncThunk(
  'user/fetch_login_user',
  async (login_data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(login_data);
      set_auth_tokens(response.accessToken, response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(handle_error(error, 'Ошибка при авторизации'));
    }
  }
);

export const fetch_user = createAsyncThunk(
  'user/fetch_user',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response;
    } catch (error) {
      return rejectWithValue(
        handle_error(error, 'Ошибка при получении данных пользователя')
      );
    }
  }
);

export const fetch_update_user = createAsyncThunk(
  'user/fetch_update_user',
  async (user_data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(user_data);
      return response;
    } catch (error) {
      return rejectWithValue(
        handle_error(error, 'Ошибка при обновлении данных пользователя')
      );
    }
  }
);

export const fetch_logout = createAsyncThunk(
  'user/fetch_logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      clear_auth_tokens();
    } catch (error) {
      return rejectWithValue(
        handle_error(error, 'Ошибка при выходе из системы')
      );
    }
  }
);

export const user_slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout_user: (state) => {
      state.user_data = null;
      state.is_auth_checked = false;
      state.is_loading = false;
      state.error_message = null;
      clear_auth_tokens();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch_register_user.pending, (state) => {
        state.is_loading = true;
      })
      .addCase(fetch_register_user.fulfilled, (state, action) => {
        state.user_data = action.payload.user;
        state.is_auth_checked = true;
        state.is_loading = false;
        state.error_message = null;
      })
      .addCase(fetch_register_user.rejected, (state, action) => {
        state.is_auth_checked = false;
        state.is_loading = false;
        state.error_message = action.payload as string;
      })
      .addCase(fetch_login_user.pending, (state) => {
        state.is_loading = true;
      })
      .addCase(fetch_login_user.fulfilled, (state, action) => {
        state.user_data = action.payload.user;
        state.is_auth_checked = true;
        state.is_loading = false;
        state.error_message = null;
      })
      .addCase(fetch_login_user.rejected, (state, action) => {
        state.is_auth_checked = true;
        state.is_loading = false;
        state.error_message = action.payload as string;
      })
      .addCase(fetch_user.pending, (state) => {
        state.is_loading = true;
      })
      .addCase(fetch_user.fulfilled, (state, action) => {
        state.user_data = action.payload.user;
        state.is_auth_checked = true;
        state.is_loading = false;
        state.error_message = null;
      })
      .addCase(fetch_user.rejected, (state, action) => {
        state.is_auth_checked = true;
        state.is_loading = false;
        state.error_message = action.payload as string;
      })
      .addCase(fetch_logout.fulfilled, (state) => {
        state.user_data = null;
        state.is_auth_checked = false;
        state.is_loading = false;
        state.error_message = null;
      });
  }
});

export const { logout_user } = user_slice.actions;

export const getUserState = (state: { user: TUser_State }) => state.user;

export const user_selectors = {
  user_selector: (state: { user: TUser_State }) => state.user.user_data,
  is_auth_checked_selector: (state: { user: TUser_State }) =>
    state.user.is_auth_checked,

  is_loading_selector: (state: { user: TUser_State }) => state.user.is_loading,

  error_message_selector: (state: { user: TUser_State }) =>
    state.user.error_message,

  user_status_selector: (state: { user: TUser_State }) => {
    if (state.user.is_loading) {
      return 'loading';
    }
    if (state.user.error_message) {
      return 'error';
    }
    if (state.user.user_data) {
      return 'authenticated';
    }
    return 'unauthenticated';
  }
};

export default user_slice.reducer;
