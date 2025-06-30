const express = require('express');
const os = require('os');
const path = require('path');
const fetch = require('node-fetch');



const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/hostname';
const SERVICE_NAME = process.env.SERVICE_NAME || 'frontend';

app.use(express.static(path.join(__dirname)));

app.get('/frontend-hostname', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    hostname: os.hostname(),
    port: PORT
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: SERVICE_NAME });
});

app.get('/api/hostname', async (req, res) => {
  try {
    const response = await fetch(BACKEND_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch backend hostname', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} running on port ${PORT}`);
});
