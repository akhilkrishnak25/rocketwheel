const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function adminAuth(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ error: 'Forbidden' });
}

function vendorAuth(req, res, next) {
  if (req.user && req.user.role === 'vendor') return next();
  res.status(403).json({ error: 'Forbidden' });
}

module.exports = { verifyToken, adminAuth, vendorAuth };
