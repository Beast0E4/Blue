import React, { useState, useEffect } from 'react';
// import { io, Socket } from 'socket.io-client';

import AuthForm from './components/auth/AuthForm';
import UsersList from './components/users/UsersList';
import ChatMessages from './components/chat/ChatMessages';

import type { User, Message, AuthTokens } from './types';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
//   const [socket, setSocket] = useState<Socket | null>(null);

  // Auth
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');

  // Chat
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  /* ---------------- SOCKET ---------------- */

//   useEffect(() => {
//     if (!isLoggedIn || !authTokens || socket) return;

//     const newSocket = io(API_URL, {
//       auth: { token: authTokens.accessToken },
//       transports: ['websocket', 'polling']
//     });

//     newSocket.on('new_message', (message: Message) => {
//       setMessages(prev => [...prev, message]);

//       const senderId =
//         typeof message.sender === 'string'
//           ? message.sender
//           : message.sender._id;

//       if (selectedUser?._id !== senderId) {
//         setUnreadCounts(prev => ({
//           ...prev,
//           [senderId]: (prev[senderId] || 0) + 1
//         }));
//       }
//     });

//     newSocket.on('message_sent', (message: Message) => {
//       setMessages(prev => [...prev, message]);
//     });

//     newSocket.on('user_typing', ({ userId, isTyping }) => {
//       setTypingUsers(prev => {
//         const next = new Set(prev);
//         isTyping ? next.add(userId) : next.delete(userId);
//         return next;
//       });
//     });

//     newSocket.on('user_status', ({ userId, isOnline }) => {
//       setUsers(prev =>
//         prev.map(u => (u._id === userId ? { ...u, isOnline } : u))
//       );
//     });

//     newSocket.on('unread_counts', counts => {
//       setUnreadCounts(counts);
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.close();
//       setSocket(null);
//     };
//   }, [isLoggedIn, authTokens, socket, selectedUser]);

  /* ---------------- FETCH ---------------- */

//   useEffect(() => {
//     if (isLoggedIn && authTokens) fetchUsers();
//   }, [isLoggedIn, authTokens]);

//   useEffect(() => {
//     if (selectedUser && authTokens) fetchMessages(selectedUser._id);
//   }, [selectedUser, authTokens]);

//   const fetchUsers = async () => {
//     const res = await fetch(`${API_URL}/api/chat/users`, {
//       headers: { Authorization: `Bearer ${authTokens?.accessToken}` }
//     });
//     const data = await res.json();
//     setUsers(data.users);
//   };

//   const fetchMessages = async (userId: string) => {
//     const res = await fetch(
//       `${API_URL}/api/messages/conversation/${userId}`,
//       {
//         headers: { Authorization: `Bearer ${authTokens?.accessToken}` }
//       }
//     );
//     const data = await res.json();
//     setMessages(data.messages);

//     socket?.emit('mark_read', { senderId: userId });
//     setUnreadCounts(prev => ({ ...prev, [userId]: 0 }));
//   };

  /* ---------------- AUTH ---------------- */

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setAuthError('');

//     const endpoint = isRegistering
//       ? '/api/auth/register'
//       : '/api/auth/login';

//     const body = isRegistering
//       ? authForm
//       : { email: authForm.email, password: authForm.password };

//     const res = await fetch(`${API_URL}${endpoint}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body)
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setAuthError(data.error);
//       return;
//     }

//     setAuthTokens(data.tokens);
//     setCurrentUser(data.user);
//     setIsLoggedIn(true);
//   };

  /* ---------------- CHAT ---------------- */

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser || !socket) return;

    socket.emit('send_message', {
      receiverId: selectedUser._id,
      content: messageInput.trim()
    });

    setMessageInput('');
    setIsTyping(false);
  };

  const handleTyping = (value: string) => {
    setMessageInput(value);

    if (!selectedUser || !socket) return;

    const typing = value.length > 0;
    if (typing !== isTyping) {
      setIsTyping(typing);
      socket.emit('typing', {
        receiverId: selectedUser._id,
        isTyping: typing
      });
    }
  };

  const handleLogout = () => {
    socket?.close();
    setSocket(null);
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthTokens(null);
    setSelectedUser(null);
    setMessages([]);
    setUsers([]);
  };

  /* ---------------- RENDER ---------------- */

  if (!isLoggedIn) {
    return (
      <AuthForm
        isRegistering={isRegistering}
        authForm={authForm}
        authError={authError}
        onSubmit={() => {}}
        toggleMode={() => {
          setIsRegistering(!isRegistering);
          setAuthError('');
        }}
        onChange={(field, value) =>
          setAuthForm(prev => ({ ...prev, [field]: value }))
        }
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow px-6 py-4 flex justify-between">
        <div>
          <h2 className="font-semibold">{currentUser?.username}</h2>
          <p className="text-sm text-gray-500">{currentUser?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <UsersList
          users={users}
          selectedUser={selectedUser}
          unreadCounts={unreadCounts}
          onSelect={setSelectedUser}
        />

        {selectedUser ? (
          <div className="flex-1 flex flex-col">
            <ChatMessages
              messages={messages}
              currentUser={currentUser}
              typing={typingUsers.has(selectedUser._id)}
            />

            <form
              onSubmit={handleSendMessage}
              className="bg-white p-4 flex gap-2 border-t"
            >
              <input
                value={messageInput}
                onChange={e => handleTyping(e.target.value)}
                className="flex-1 border rounded-full px-4 py-2"
                placeholder="Type a message..."
              />
              <button
                disabled={!messageInput.trim()}
                className="bg-blue-600 text-white px-6 rounded-full"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
