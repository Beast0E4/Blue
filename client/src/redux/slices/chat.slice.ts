import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import { showToast } from "./toast.slice";
import type { Message, User } from "../../types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface ChatState {
  users: User[];
  messages: Message[];
  unreadCounts: Record<string, number>;
  loading: boolean;
}

interface GetMessagesPayload {
  sender: string;
  recipient: string;
}

/* -------------------------------------------------------------------------- */
/*                                   STATE                                    */
/* -------------------------------------------------------------------------- */

const initialState: ChatState = {
  users: [],
  messages: [],
  unreadCounts: {},
  loading: false,
};

/* -------------------------------------------------------------------------- */
/*                                   THUNKS                                   */
/* -------------------------------------------------------------------------- */

/** Get all chat users */
export const getChatUsers = createAsyncThunk(
  "chat/getChatUsers",
  async (_, { dispatch }) => {
    try {
      const response = await axiosInstance.get("/chat/users", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });

      return response.data.users as User[];
    } catch (error: any) {
      dispatch(
        showToast({
          message:
            error?.response?.data?.error || "Failed to fetch users",
          type: "error",
        })
      );
      throw error;
    }
  }
);

/** Get messages between two users */
export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (data: GetMessagesPayload, { dispatch }) => {
    try {
      const response = await axiosInstance.get("/message", {
        params: {
          sender: data.sender,
          recipient: data.recipient,
        },
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });

      return response.data.messages as Message[];
    } catch (error: any) {
      dispatch(
        showToast({
          message:
            error?.response?.data?.error || "Failed to load messages",
          type: "error",
        })
      );
      throw error;
    }
  }
);

/* -------------------------------------------------------------------------- */
/*                                   SLICE                                    */
/* -------------------------------------------------------------------------- */

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    /** Clear chat state on logout */
    clearChat: () => initialState,

    /** Add a message from socket */
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },

    /** Increment unread count */
    incrementUnread: (state, action: PayloadAction<string>) => {
      const senderId = action.payload;
      state.unreadCounts[senderId] =
        (state.unreadCounts[senderId] || 0) + 1;
    },

    /** Reset unread count */
    resetUnread: (state, action: PayloadAction<string>) => {
      state.unreadCounts[action.payload] = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------------- USERS ---------------- */
      .addCase(getChatUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getChatUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.users = action.payload;
          state.loading = false;
        }
      )
      .addCase(getChatUsers.rejected, (state) => {
        state.loading = false;
      })

      /* ---------------- MESSAGES ---------------- */
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getMessages.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
          state.messages = action.payload;
          state.loading = false;
        }
      )
      .addCase(getMessages.rejected, (state) => {
        state.loading = false;
      });
  },
});

/* -------------------------------------------------------------------------- */
/*                                   EXPORTS                                  */
/* -------------------------------------------------------------------------- */

export const {
  clearChat,
  addMessage,
  incrementUnread,
  resetUnread,
} = chatSlice.actions;

export default chatSlice.reducer;
