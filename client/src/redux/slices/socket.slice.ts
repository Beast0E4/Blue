import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

// Use environment variable at the top
const BASE_URL: string = import.meta.env.VITE_BASE_URL;

let socketInstance: Socket | null = null;

interface SocketState {
  connected: boolean;
}

interface InitSocketPayload {
  userId: string;
  dispatch: any;
}

const initialState: SocketState = {
  connected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initSocket: (state, action: PayloadAction<InitSocketPayload>) => {
      const { userId, dispatch } = action.payload;

      if (!socketInstance) {
        socketInstance = io(BASE_URL, {
          transports: ["websocket"],
          autoConnect: false,
          query: { userId },
        });

        socketInstance.connect();

        // Global listeners
        socketInstance.on("connect", () => {
          console.log("Socket connected");
          dispatch(setConnected(true));
        });

        socketInstance.on("disconnect", () => {
          console.log("Socket disconnected");
          dispatch(setConnected(false));
        });

        socketInstance.on("receiveMessage", (data: any) => {
        //   dispatch(updateMessages({ message: data }));
        });
      }
    },

    disconnectSocket: (state) => {
      if (socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("disconnect");
        socketInstance.off("receiveMessage");

        socketInstance.disconnect();
        socketInstance = null;
        state.connected = false;
      }
    },

    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
  },
});

export const { initSocket, disconnectSocket, setConnected } =
  socketSlice.actions;

export default socketSlice.reducer;

export const getSocket = (): Socket | null => socketInstance;
