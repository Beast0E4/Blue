import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/* ================= TYPES ================= */

type ToastType = 'success' | 'error';

interface ToastPayload {
  message: string;
  type?: ToastType;
  image?: string;
}

interface ToastState {
  message: string;
  type: ToastType;
  image?: string;
  visible: boolean;
}

/* ================= INITIAL STATE ================= */

const initialState: ToastState = {
  message: '',
  type: 'success',
  image: '',
  visible: false
};

/* ================= SLICE ================= */

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<ToastPayload>) {
      state.message = action.payload.message;
      state.type = action.payload.type || 'success';
      state.image = action.payload.image || '';
      state.visible = true;
    },

    hideToast(state) {
      state.visible = false;
    }
  }
});

/* ================= EXPORTS ================= */

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
