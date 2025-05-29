const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,       // Username is required
    unique: true,         // Must be unique across users
    trim: true            // Removes whitespace from both ends
  },
  email: {
    type: String,
    required: true,       // Email is required
    unique: true,         // Must be unique across users
    trim: true            // Removes whitespace from both ends
  },
  password: {
    type: String,
    required: true,       // Password is required
    minlength: 6          // Minimum password length is 6 characters
  }
});

// Mongoose pre-save middleware to hash the password before saving
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Generate a salt with 10 rounds
  const salt = await bcrypt.genSalt(10);

  // Hash the password using the generated salt
  this.password = await bcrypt.hash(this.password, salt);

  // Proceed to save the user
  next();
});

module.exports = UserSchema;
