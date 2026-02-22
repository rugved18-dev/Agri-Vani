const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // 1. Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Get user from the token (exclude password)
      try {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
      } catch (dbError) {
        console.error('Database error:', dbError.message);
        // For development, create mock user from token if database is unavailable
        req.user = {
          id: decoded.id,
          email: decoded.email || 'dev@example.com'
        };
        console.warn('Using mock user due to database unavailability');
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};