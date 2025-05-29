const mongoose = require('mongoose');

// Define schema for storing collaborative documents
const documentSchema = new mongoose.Schema({
  // ID of the room this document belongs to (UUID format used instead of ObjectId)
  roomId: { 
    type: String, 
    required: true 
  },

  // The actual content/text of the document
  content: { 
    type: String, 
    required: true 
  },

  // Reference to the user who created the document
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // Reference to the user who last edited the document
  lastEditedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },

  // Timestamp for when the document was created
  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  // Timestamp for when the document was last edited
  lastEditedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Export the schema to be used in the model
module.exports = documentSchema;
