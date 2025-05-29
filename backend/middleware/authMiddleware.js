const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token for authentication.
 * Looks for the token in header, cookies, or query parameters.
 */
const authMiddleware = async (req, res, next) => {
  // 1. Retrieve token from headers, cookies, or query string
  const token = req.header('x-auth-token') || req.cookies?.token || req.query?.token;

  // 2. If no token found, deny access
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required: No token provided'
    });
  }

  try {
    // 3. Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach decoded user info to request object
    req.user = {
      id: decoded.userId, // Ensure your token includes `userId`
      token
    };

    // 5. Proceed to next middleware or route handler
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);

    // 6. Send specific error messages based on the type of token error
    let message = 'Invalid token';
    if (err.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Malformed token';
    }

    res.status(401).json({ 
      success: false,
      message
    });
  }
};

/**
 * Middleware to check if the user has admin privileges.
 * Assumes `isAdmin` flag is available in the decoded token/user object.
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required'
    });
  }
  next(); // User is admin, proceed to next middleware
};

// Export the middlewares for use in routes
module.exports = {
  authMiddleware,
  adminMiddleware
};
