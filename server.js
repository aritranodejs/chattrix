import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url'; // To handle __dirname in ESM

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Compress all responses
app.use(compression());

// Enable CORS
app.use(cors());

// Create an HTTP server to pass to Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.SITE_URL,
    methods: ['GET', 'POST'],
  },
});

// Express urlencoded and JSON middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Resolve __dirname in ESM
// In ES modules (.mjs), we cannot use __dirname directly as we can in CommonJS. However, we can replicate __dirname functionality using fileURLToPath and import.meta.url.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static resources
app.use('/public', express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to the database (make sure to add .js extension)
import connectDB from './config/database.js';
connectDB();

// Global variables
global.blacklistedTokens = new Set();

// Middleware to pass the io instance
app.use((req, res, next) => {
  req.io = io; // Attach the `socket.io` instance to the `req` object
  next();
});

import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);

import apiRoutes from './routes/api.js';
app.use('/api', apiRoutes);

import adminRoutes from './routes/admin.js';
app.use('/api/admin', adminRoutes);

// 404 route
app.use((req, res, next) => {
  res.status(404).render('404', {
    layout: false,
    title: 'Page Not Found',
  });
});

// Set ejs as the view engine
app.set('view engine', 'ejs');

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
  });
});

// Server listen
const PORT = process.env.APP_PORT || 5000;
server.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Express server started at http://localhost:${PORT}`);
});
