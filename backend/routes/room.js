const express = require('express');
const roomRouter = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Room } = require('../config/db');
const { authMiddleware } = require('../middleware/authMiddleware');


// =======================
// 🔧 Create a New Room
// POST /api/rooms
// Requires: name, userId
// Protected Route
// =======================
roomRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, userId } = req.body;

    // Validate input
    if (!name || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Room name and user ID are required'
      });
    }

    // Generate a unique room ID
    const roomId = uuidv4();

    // Create a new Room instance
    const newRoom = new Room({
      name,
      roomId,
      createdBy: userId,
      participants: [{
        user: userId,
        joinedAt: new Date()
      }]
    });

    await newRoom.save();

    // Respond with room info
    res.status(201).json({
      success: true,
      room: {
        id: newRoom.roomId,
        name: newRoom.name,
        createdAt: newRoom.createdAt,
        createdBy: req.user.userId
      }
    });

  } catch (err) {
    console.error('Room creation error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create room'
    });
  }
});


// ===============================
// 📋 Get All Rooms for Current User
// GET /api/rooms/my-rooms
// Protected Route
// ===============================
roomRouter.get('/my-rooms', authMiddleware, async (req, res) => {
  try {
    // Find rooms where user is a participant
    const rooms = await Room.find({
      'participants.user': req.user.id
    })
      .populate('createdBy', 'username')
      .populate('participants.user', 'username')
      .sort({ updatedAt: -1 });

    // Format the response
    const formattedRooms = rooms.map(room => ({
      id: room.roomId,
      name: room.name,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      createdBy: room.createdBy.username,
      participants: room.participants.map(p => ({
        username: p.user.username,
        joinedAt: p.joinedAt
      }))
    }));

    res.json({
      success: true,
      rooms: formattedRooms
    });

  } catch (err) {
    console.error('Fetch rooms error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
});


// =======================
// 🚪 Join an Existing Room
// POST /api/rooms/:roomId/join
// Protected Route
// =======================
roomRouter.post('/:roomId/join', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;

    // Validate Room ID
    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID is required'
      });
    }

    // Find room by ID
    const room = await Room.findOne(
      { roomId },
      { participants: 1, name: 1, roomId: 1 }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const currentUserId = req.user?.id?.toString?.();

    // Check if user already joined
    const alreadyJoined = room.participants.some(p => {
      if (!p || !p.user) return false;

      let userId;
      try {
        userId = typeof p.user === 'object' && p.user._id
          ? p.user._id.toString()
          : p.user.toString();
      } catch (e) {
        return false;
      }

      return userId === currentUserId;
    });

    if (alreadyJoined) {
      return res.status(200).json({
        success: true,
        message: 'Already in room',
        room: {
          id: room.roomId,
          name: room.name
        }
      });
    }

    // Add user to participants
    const updatedRoom = await Room.findOneAndUpdate(
      { roomId },
      {
        $push: {
          participants: {
            user: req.user.id,
            joinedAt: new Date()
          }
        },
        $set: { updatedAt: new Date() }
      },
      { new: true, select: 'roomId name participants' }
    );

    res.json({
      success: true,
      message: 'Joined room successfully',
      room: {
        id: updatedRoom.roomId,
        name: updatedRoom.name,
        participantsCount: updatedRoom.participants.length
      }
    });

  } catch (err) {
    console.error('Join room error:', err);

    // Handle common errors
    let status = 500;
    let message = 'Failed to join room';

    if (err.name === 'CastError') {
      status = 400;
      message = 'Invalid user or room reference';
    }

    res.status(status).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


// ==========================
// 🔍 Check if Room Exists
// GET /api/rooms/:roomId
// Public Route
// ==========================
roomRouter.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    // Find room by ID
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    // Return basic room info
    res.status(200).json({
      success: true,
      room: {
        name: room.name,
        roomId: room.roomId,
        createdAt: room.createdAt
      }
    });

  } catch (err) {
    console.error("Fetch room error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch room details"
    });
  }
});


// ===========================
// 🧑‍🤝‍🧑 Get Rooms by User ID
// GET /api/rooms/user/:userId
// Protected Route
// ===========================
roomRouter.get('/user/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    // Find rooms where user is a participant
    const rooms = await Room.find({ "participants.user": userId });

    res.json({ rooms });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
});


// Export the router
module.exports = roomRouter;
