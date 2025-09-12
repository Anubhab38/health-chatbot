// src/app.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { handleMessage } = require('./controllers/messagecontroller');

const app = express();

// Middleware
app.use(helmet());          // security headers
app.use(cors());            // allow cross-origin requests
app.use(express.json());    // parse JSON
app.use(morgan('dev'));     // request logging

// Health check route
app.get('/', (req, res) => {
  res.send('✅ API is running');
});

// Chatbot route
app.post('/api/message', handleMessage);

// 404 handler (catch unknown routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
