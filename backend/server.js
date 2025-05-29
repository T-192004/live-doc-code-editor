// Import required packages and modules
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db, User, Room, Document } = require('./config/db');

// Import route handlers
const authRouter = require("./routes/auth");
const roomRouter = require("./routes/room");
const documentRouter = require("./routes/document");

// Load environment variables from .env file
dotenv.config();

// Create Express app and apply middlewares
const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// MongoDB connection listener
db.once('open', () => {
  console.log('MongoDB connected to database');
});

// Create HTTP server and initialize Socket.IO with CORS support
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 120000 // 2 minutes to recover disconnected sockets
  }
});

// Attach routers for API endpoints
app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/documents", documentRouter);

// Socket state tracking
const userSocketMap = {};  // Maps socketId -> username
const roomUserMap = {};    // Maps roomId -> array of usernames

// Utility to get all connected clients in a room
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketId => ({
    socketId,
    username: userSocketMap[socketId],
  }));
};

// Cleanup function to remove user references from maps
const cleanupUser = (socketId) => {
  const username = userSocketMap[socketId];
  if (!username) return;

  // Remove user from all room maps
  Object.keys(roomUserMap).forEach(roomId => {
    roomUserMap[roomId] = roomUserMap[roomId].filter(u => u !== username);
    if (roomUserMap[roomId].length === 0) {
      delete roomUserMap[roomId]; // Clean up empty rooms
    }
  });

  delete userSocketMap[socketId]; // Remove socket mapping
};

// Handle new socket connections
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Handle joining a room
  socket.on("join", async ({ roomId, username }, callback) => {
    try {
      if (!roomId || !username) throw new Error("Room ID and username are required");

      // Check if the same user is already connected on another socket
      const existingSocketId = Object.entries(userSocketMap)
        .find(([id, name]) => name === username && id !== socket.id)?.[0];
      
      // If found, disconnect the old socket
      if (existingSocketId) {
        const existingSocket = io.sockets.sockets.get(existingSocketId);
        if (existingSocket) existingSocket.disconnect();
        cleanupUser(existingSocketId);
      }

      // Add user to room map
      if (!roomUserMap[roomId]) roomUserMap[roomId] = [];
      if (!roomUserMap[roomId].includes(username)) {
        roomUserMap[roomId].push(username);
      }

      userSocketMap[socket.id] = username; // Save socket-username mapping
      socket.join(roomId); // Join the socket room

      // Fetch or create the associated document
      let document = await Document.findOne({ roomId });
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found in database");

      if (!document) {
        document = new Document({
          roomId,
          content: "// Start coding here...",
          createdBy: user._id,
          lastEditedBy: user._id
        });
        await document.save();
      }

      // Send response to the joining client with current room state
      const clients = getAllConnectedClients(roomId);
      callback({ 
        success: true, 
        clients,
        initialCode: document.content
      });

      // Notify all other clients in the room
      socket.to(roomId).emit("joined", {
        clients,
        username,
        socketId: socket.id
      });

      console.log(`${username} joined room ${roomId}`);
    } catch (err) {
      console.error("Join error:", err.message);
      callback({ success: false, error: err.message });
    }
  });

  // Handle code change events from clients
  socket.on("code-change", async ({ roomId, code }) => {
    try {
      const username = userSocketMap[socket.id];
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");

      // Broadcast the code to all other clients in the room
      socket.to(roomId).emit("code-change", { code });

      // Persist the latest code to the database
      await Document.findOneAndUpdate(
        { roomId },
        { 
          content: code,
          lastEditedBy: user._id,
          lastEditedAt: Date.now()
        },
        { upsert: true } // Create if it doesn’t exist
      );
    } catch (err) {
      console.error("Code update error:", err);
    }
  });

  // Handle user starting to disconnect
  socket.on("disconnecting", () => {
    const username = userSocketMap[socket.id];
    if (username) {
      socket.rooms.forEach(roomId => {
        if (roomId !== socket.id) {
          socket.to(roomId).emit("disconnected", {
            socketId: socket.id,
            username
          });
        }
      });
      console.log(`User ${username} disconnecting`);
    }
  });

  // Final disconnect cleanup
  socket.on("disconnect", () => {
    cleanupUser(socket.id);
    console.log(`Socket ${socket.id} disconnected`);
  });
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
