export interface User {
  _id: string;
  username: string;
  email: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Message {
  _id: string;
  sender: User | string;
  receiver: User | string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
