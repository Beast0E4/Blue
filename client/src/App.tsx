import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./redux/store";

import AuthForm from "./components/auth/AuthForm";
import UsersList from "./components/users/UsersList";
import ChatMessages from "./components/chat/ChatMessages";

import type { User } from "./types";
import { getSocket } from "./redux/slices/socket.slice";
import { initSocket, disconnectSocket } from "./redux/slices/socket.slice";
import {
  getChatUsers,
  getMessages,
  resetUnread,
  clearChat,
} from "./redux/slices/chat.slice";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const socket = getSocket();

  const users = useSelector((state: any) => state.chat.users);
  const messages = useSelector((state: any) => state.chat.messages);
  const unreadCounts = useSelector(
    (state: any) => state.chat.unreadCounts
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authTokens, setAuthTokens] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  /* ---------------- SOCKET ---------------- */

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      dispatch(
        initSocket({
          userId: currentUser._id,
          dispatch,
        })
      );
    }

    return () => {
      dispatch(disconnectSocket());
      dispatch(clearChat());
    };
  }, [isLoggedIn, currentUser, dispatch]);

  /* ---------------- DATA ---------------- */

  useEffect(() => {
    if (isLoggedIn && authTokens) {
        dispatch(getChatUsers());
    }
    }, [isLoggedIn, authTokens, dispatch]);


  useEffect(() => {
    if (selectedUser && authTokens && currentUser) {
        dispatch(
        getMessages({
            sender: currentUser._id,
            recipient: selectedUser._id,
        })
        );

        socket?.emit("mark_read", { senderId: selectedUser._id });
        dispatch(resetUnread(selectedUser._id));
    }
    }, [selectedUser, authTokens, currentUser, dispatch]);


  /* ---------------- CHAT ---------------- */

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser || !socket) return;

    socket.emit("send_message", {
      receiverId: selectedUser._id,
      content: messageInput.trim(),
    });

    setMessageInput("");
  };

  /* ---------------- AUTH ---------------- */

  if (!isLoggedIn) {
    return (
      <AuthForm
        isRegistering={isRegistering}
        toggleMode={() => setIsRegistering(!isRegistering)}
        onAuthSuccess={(user, tokens) => {
          setCurrentUser(user);
          setAuthTokens(tokens);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="h-screen flex flex-col">
      <UsersList
        users={users}
        selectedUser={selectedUser}
        unreadCounts={unreadCounts}
        onSelect={setSelectedUser}
      />

      {selectedUser && (
        <ChatMessages
          messages={messages}
          currentUser={currentUser}
          typing={true}
        />
      )}

      <form onSubmit={handleSendMessage}>
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button>Send</button>
      </form>
    </div>
  );
}
