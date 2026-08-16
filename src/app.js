// src/app.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { handleMessage } = require('./controllers/messagecontroller');

const app = express();

// Middleware
app.use(helmet());          // security headers
app.use(cors());            // allow cross-origin requests
app.use(express.json());    // parse JSON
app.use(morgan('dev'));     // request logging

// Serve static frontend
app.use(express.static(path.join(__dirname, '../public')));

// Rate Limiting for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

// Chatbot route
app.post('/api/message', apiLimiter, handleMessage);

// 404 handler (catch unknown routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
