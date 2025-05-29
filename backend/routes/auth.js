const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../config/db');

const authRouter = express.Router();

/**
 * POST /register
 * Register a new user
 * - Checks if user with the given email already exists
 * - Creates new user and saves to DB
 * - Generates JWT token
 */
authRouter.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    console.log(user);
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create and save new user
    user = new User({ username, email, password });
    await user.save();

    // Generate JWT token with 7-day expiry
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Respond with token and user info
    console.log(user);
    res.json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
});

/**
 * POST /login
 * Login existing user
 * - Accepts either email or username as identity
 * - Verifies password
 * - Returns JWT token and user info if valid
 */
authRouter.post('/login', async (req, res) => {
  const { identity, password } = req.body;

  try {
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identity }, { username: identity }],
    });

    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Check if provided password matches the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate JWT token with 7-day expiry
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Respond with token and user info
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = authRouter;
