// Import mongoose for MongoDB interaction
const mongoose = require('mongoose');

// ✅ MongoDB connection URI (make sure this is secured via environment variables in production)
const MONGO_URI = 'mongodb+srv://tanvi023:Re8_MVTrSQxH@real-time-code-editor-d.ty9przt.mongodb.net/?retryWrites=true&w=majority&appName=Real-time-code-editor-data';

// ✅ Create a single connection to the MongoDB cluster
const connection = mongoose.createConnection(MONGO_URI, {
  useNewUrlParser: true,       // Parses connection string correctly
  useUnifiedTopology: true     // Uses new server discovery and monitoring engine
});

// ✅ Use the specific database named "test" inside the cluster
const db = connection.useDb("test");

// ✅ Import Mongoose schemas for each model
const UserSchema = require('../models/User');
const roomSchema = require('../models/Room');
const documentSchema = require('../models/Document');

// ✅ Register models using the selected database instance
// This ensures that these models operate on the "test" DB
const User = db.model("User", UserSchema);
const Room = db.model('Room', roomSchema);
const Document = db.model('Document', documentSchema);

// ✅ Export the DB instance and models for use in other files
module.exports = { db, User, Room, Document };
