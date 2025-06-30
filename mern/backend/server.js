const express = require('express');
const os = require('os');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', hostname: os.hostname() });
});

// Get backend hostname
app.get('/api/hostname', (req, res) => {
  res.json({ 
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Hostname: ${os.hostname()}`);
});