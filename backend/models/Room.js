const mongoose = require('mongoose');

// Define the schema for a Room
const roomSchema = new mongoose.Schema({
  // Name of the room (required, trimmed, with max length)
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [50, 'Room name cannot exceed 50 characters']
  },

  // Unique room ID to identify the room
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true  // Makes queries faster on this field
  },

  // Reference to the user who created the room
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Array of participants who joined the room
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Reference to the User model
    },
    joinedAt: {
      type: Date,
      default: Date.now // Time when user joined the room
    }
  }],

  // Timestamp when the room was created
  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  // Timestamp when the room was last updated
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware to update 'updatedAt' timestamp before saving
roomSchema.pre('save', function(next) {
  this.updatedAt = Date.now(); // Update the timestamp
  next(); // Proceed to save
});

module.exports = roomSchema;
