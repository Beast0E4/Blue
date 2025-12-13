import express from 'express';
import type { Request, Response, NextFunction } from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import http from 'http';

// import userRoutes from './src/routes/user.routes.js';
// import { Mongo_DB_URL, PORT } from './src/config/db.config.js';
// import setupSocket from './socket/socket.js';

const app = express();
const server = http.createServer(app);

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Accept, Content-Type, X-Requested-With, x-access-token'
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ================= ROUTES ================= */

/** ✅ ONLY ONE ROUTE */
// app.use('/auth', userRoutes);

/* ================= ERROR HANDLER ================= */

app.use(
  (err: any, req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';

    res.status(statusCode).json({ message });
  }
);

/* ================= DATABASE ================= */

async function connectToDb(): Promise<void> {
  try {
    // await mongoose.connect(Mongo_DB_URL);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed');
    console.error(error);
    process.exit(1);
  }
}

connectToDb();

/* ================= SOCKET ================= */

setupSocket(server);

/* ================= SERVER ================= */

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
