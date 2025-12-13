# Production-Grade Real-Time Chat Application

A scalable, production-ready chat application built with Node.js, Express, Socket.IO, MongoDB, Redis, and React.

## 🚀 Features

- **Authentication**: JWT-based authentication with access and refresh tokens
- **Real-time Messaging**: Socket.IO for instant message delivery
- **Online Presence**: Real-time user online/offline status
- **Typing Indicators**: See when other users are typing
- **Unread Messages**: Redis-backed unread message counting
- **Message Persistence**: All messages stored in MongoDB
- **Horizontal Scalability**: Redis Pub/Sub for multi-server deployment
- **Production Ready**: Docker containerization, health checks, graceful shutdown
- **Tested**: Jest test suite for APIs and socket events

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

## 🛠️ Quick Start

### Using Docker (Recommended)

1. Clone the repository
```bash
git clone <repo-url>
cd chat-app
```

2. Create environment file
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your secrets
```

3. Start all services
```bash
docker-compose up --build
```

4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

### Local Development

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │
│   (React)   │
└──────┬──────┘
       │
       ├───── HTTP (REST API)
       └───── WebSocket (Socket.IO)
              │
       ┌──────▼──────┐
       │   Backend   │
       │  (Node.js)  │
       └──────┬──────┘
              │
       ┌──────┴──────┐
       │             │
   ┌───▼───┐    ┌───▼───┐
   │MongoDB│    │ Redis │
   │  DB   │    │Pub/Sub│
   └───────┘    └───────┘
```

## 📁 Project Structure

```
chat-app/
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Express app setup
│   │   ├── server.ts              # Server entry point
│   │   ├── config/
│   │   │   ├── db.ts              # MongoDB connection
│   │   │   └── redis.ts           # Redis client
│   │   ├── modules/
│   │   │   ├── auth/              # Authentication logic
│   │   │   ├── chat/              # Chat features
│   │   │   └── message/           # Message handling
│   │   ├── socket/
│   │   │   ├── index.ts           # Socket.IO server
│   │   │   └── events.ts          # Socket event handlers
│   │   └── tests/                 # Jest tests
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── App.tsx                # Main React component
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Chat

- `GET /api/chat/users` - Get all users
- `GET /api/chat/users/search?q=query` - Search users
- `GET /api/chat/users/:userId` - Get specific user

### Messages

- `GET /api/messages/conversation/:userId` - Get conversation
- `PUT /api/messages/read/:senderId` - Mark messages as read
- `GET /api/messages/unread/:fromUserId` - Get unread count
- `GET /api/messages/unread` - Get all unread counts
- `GET /api/messages/conversations` - Get recent conversations

## 🔌 Socket.IO Events

### Client → Server

- `send_message` - Send a message
- `typing` - Typing indicator
- `mark_read` - Mark messages as read

### Server → Client

- `new_message` - Receive new message
- `message_sent` - Confirmation of sent message
- `user_typing` - User typing notification
- `user_status` - User online/offline status
- `messages_read` - Messages read notification
- `unread_counts` - Initial unread counts

## 🧪 Testing

```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Watch mode
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookie support (optional)
- CORS configuration
- Rate limiting ready (add middleware)
- Input validation
- SQL injection prevention (using Mongoose)

## 📈 Scalability

- **Redis Pub/Sub**: Enables horizontal scaling across multiple server instances
- **Connection pooling**: MongoDB and Redis connection management
- **Stateless architecture**: JWT tokens eliminate server-side sessions
- **Load balancer ready**: Can be deployed behind nginx or AWS ALB

## 🐳 Docker Services

- **mongodb**: MongoDB 7.0 with persistent storage
- **redis**: Redis 7 for caching and Pub/Sub
- **backend**: Node.js application server
- **frontend**: React app served by Nginx

## 🔧 Environment Variables

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/chatapp
REDIS_HOST=redis
REDIS_PORT=6379
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

## 📊 Monitoring

Health check endpoints are available:
- Backend: `GET /health`
- Frontend: `GET /health`

## 🚀 Deployment

### Docker Compose (Production)

```bash
docker-compose -f docker-compose.yml up -d
```

### Kubernetes

Kubernetes manifests can be generated from Docker Compose:
```bash
kompose convert
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 👥 Authors

Your team / organization

## 🙏 Acknowledgments

- Socket.IO documentation
- Express.js best practices
- MongoDB patterns
- Redis Pub/Sub patterns