import express from 'express';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.get('/api/backend-hostname', async (req, res) => {
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
