require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const adminRoutes = require('./routes/admin');
const vendorRoutes = require('./routes/vendor');
const publicRoutes = require('./routes/public');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const DB_STATE_MAP = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'rocketwheel-backend',
    dbState: mongoose.connection.readyState,
    dbStatus: DB_STATE_MAP[mongoose.connection.readyState] || 'unknown'
  });
});

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rocketwheel';
mongoose.set('bufferCommands', false);
const MONGO_OPTS = {
  serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 5000),
  socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 20000),
  connectTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 10000),
  maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 10)
};

const reconnectDelayMs = Number(process.env.MONGO_RETRY_DELAY_MS || 5000);
let reconnectTimer = null;

function scheduleReconnect(reason) {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    console.warn(`Retrying MongoDB connection (${reason})...`);
    try {
      await mongoose.connect(MONGO, MONGO_OPTS);
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB reconnect error:', err.message || err);
      scheduleReconnect('retry-failed');
    }
  }, reconnectDelayMs);
}

async function connectMongoWithRetry() {
  try {
    await mongoose.connect(MONGO, MONGO_OPTS);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    scheduleReconnect('startup-failure');
  }
}

connectMongoWithRetry();

mongoose.connection.on('disconnected', () => {
  console.error('MongoDB disconnected');
  scheduleReconnect('disconnected-event');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message || err);
  scheduleReconnect('connection-error');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/public', publicRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
