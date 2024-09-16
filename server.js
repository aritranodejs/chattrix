const express = require("express");

// Load environment variables from .env file
require("dotenv").config();

// Create Express app
const app = express();

// Cors
const cors = require("cors");
app.use(cors());

// For Socket
const http = require('http'); // Import Node's HTTP module
const { Server } = require('socket.io');
// Create an HTTP server to pass to Socket.IO
const server = http.createServer(app);
// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
      origin: process.env.SITE_URL,  
      methods: ["GET", "POST"],
  }
});

// express urlencoded 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Path
const path = require("path");

// Serve Static Resources
app.use("/public", express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// Connect to the database
const connectDB = require("./config/database");
connectDB();

// Global variables
global.blacklistedTokens = new Set();

// Middleware to pass the io instance
app.use((req, res, next) => {
  req.io = io; // Attach the `socket.io` instance to the `req` object
  next();
});

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes); // Auth Route

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes); // API Route

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes); // Admin Route

app.use((req, res, next) => {
  res.status(404).render("404", {
    layout: false,
    title: "Page Not Found",
  });
}); // 404 Route

// ejs View Engine
app.set("view engine", "ejs");

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
var PORT = process.env.APP_PORT || 5000;
server.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Express server started at http://localhost:${PORT}`);
});
