const mongoose = require('mongoose');

function requireDb(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    error: 'Service temporarily unavailable. Database connection is down. Please retry in a moment.'
  });
}

module.exports = requireDb;