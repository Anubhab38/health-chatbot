// src/server.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;
const PUBLIC_URL = "https://health-chatbot-m26y.onrender.com";

function startKeepAlive() {
  // Ping the server every 14 minutes (14 * 60 * 1000 ms)
  setInterval(() => {
    try {
      fetch(PUBLIC_URL)
        .then(res => console.log(`[Keep-Alive] Pinged ${PUBLIC_URL} - Status: ${res.status}`))
        .catch(err => console.error(`[Keep-Alive] Ping failed:`, err.message));
    } catch (error) {
      console.error(`[Keep-Alive] Error:`, error.message);
    }
  }, 14 * 60 * 1000);
}

function startServer() {
  try {
    // Start Express
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      startKeepAlive();
    });
  } catch (err) {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  }
}

startServer();
