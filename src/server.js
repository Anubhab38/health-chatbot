// src/server.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

function startServer() {
  try {
    // Start Express
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  }
}

startServer();
