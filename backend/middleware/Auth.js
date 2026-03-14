const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.isAuth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "")|| req.body.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};
