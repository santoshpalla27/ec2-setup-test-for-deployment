const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3001;
const SERVICE_NAME = process.env.SERVICE_NAME || 'backend';

app.get('/hostname', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    hostname: os.hostname(),
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} running on port ${PORT}`);
});
