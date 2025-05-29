const express = require('express');
const router = express.Router();
const { Document } = require('../config/db');
const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate user using JWT
 * - Extracts token from Authorization header
 * - Verifies the token using the secret key
 * - Attaches the decoded user info to req.user
 */
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Expecting "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    req.user = decoded; // Attach decoded user to request
    next(); // Proceed to next middleware or route
  } catch (err) {
    res.status(401).send("Authentication failed"); // Token invalid or missing
  }
};

/**
 * PUT /:roomId
 * Save or update the document content for a given room ID
 * - Requires authentication
 * - Updates the content in the database
 */
router.put('/:roomId', auth, async (req, res) => {
  try {
    const { content } = req.body;

    // Find the document by roomId and update its content
    const document = await Document.findOneAndUpdate(
      { roomId: req.params.roomId },
      { content },
      { new: true } // Return the updated document
    );

    if (!document) {
      return res.status(404).send("Document not found");
    }

    res.status(200).json(document); // Return updated document
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * GET /:roomId
 * Fetch the document for a given room ID
 * - Requires authentication
 */
router.get('/:roomId', auth, async (req, res) => {
  try {
    // Find document by roomId
    const document = await Document.findOne({ roomId: req.params.roomId });
    
    if (!document) {
      return res.status(404).send("Document not found");
    }

    res.status(200).json(document); // Return document
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
