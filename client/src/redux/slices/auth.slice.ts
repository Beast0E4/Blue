import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance'
import { showToast } from './toast.slice';

/* ================= TYPES ================= */

interface User {
  _id: string;
  username?: string;
  email?: string;
  following?: string[];
  follower?: string[];
}

interface Notification {
  _id: string;
  message?: string;
}

interface AuthState {
  data: User | null;
  notifications: Notification[];
  token: string;
  isLoggedIn: boolean;
  isRead: boolean;
}

interface SignupArgs {
  username: string;
  email: string;
  password: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  data: JSON.parse(localStorage.getItem('data') || 'null'),
  notifications: JSON.parse(localStorage.getItem('notifications') || '[]'),
  token: localStorage.getItem('token') || '',
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  isRead: localStorage.getItem('isRead') === 'true'
};

/* ================= ASYNC THUNKS ================= */

export const signup = createAsyncThunk<
  any,
  SignupArgs,
  { rejectValue: string }
>('auth/signup', async (data, { dispatch, rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('auth/signup', data);

    if (!response) {
      dispatch(
        showToast({
          message: 'Something went wrong, try again!',
          type: 'error'
        })
      );
    }

    return response;
  } catch (error: any) {
    dispatch(
      showToast({
        message: error?.response?.data?.error || 'An error occurred!',
        type: 'error'
      })
    );
    return rejectWithValue('Signup failed');
  }
});

export const login = createAsyncThunk<
  any,
  LoginArgs,
  { rejectValue: string }
>('auth/login', async (data, { dispatch, rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('auth/signin', data);

    if (!response) {
      dispatch(
        showToast({
          message: 'Something went wrong, try again!',
          type: 'error'
        })
      );
    }

    return response;
  } catch (error: any) {
    dispatch(
      showToast({
        message: error?.response?.data?.error || 'An error occurred!',
        type: 'error'
      })
    );
    return rejectWithValue('Login failed');
  }
});

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.clear();
      state.data = null;
      state.token = '';
      state.isLoggedIn = false;
      state.notifications = [];
      state.isRead = false;
    },

    markAsRead(state) {
      state.isRead = true;
      localStorage.setItem('isRead', 'true');
    },

    addNotification(state, action: PayloadAction<Notification>) {
      const exists = state.notifications.some(
        notif => notif._id === action.payload._id
      );

      if (!exists) {
        state.notifications.unshift(action.payload);
        localStorage.setItem(
          'notifications',
          JSON.stringify(state.notifications)
        );
      }
    }
  },

  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        if (!action.payload?.data) return;

        state.isLoggedIn = Boolean(action.payload.data.token);
        state.data = action.payload.data.userdata;
        state.token = action.payload.data.token;
        state.notifications = action.payload.data.notifications || [];
        state.isRead = false;

        localStorage.setItem('token', state.token);
        localStorage.setItem('data', JSON.stringify(state.data));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem(
          'notifications',
          JSON.stringify(state.notifications)
        );
        localStorage.setItem('isRead', 'false');
      })

      .addCase(signup.fulfilled, () => {
        // no immediate state change
      });
  }
});

/* ================= EXPORTS ================= */

export const { logout, markAsRead, addNotification } = authSlice.actions;
export default authSlice.reducer;
