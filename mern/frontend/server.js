const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get frontend hostname
app.get('/api/frontend-hostname', (req, res) => {
  res.json({ 
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

// Serve the main page with backend URL injection
app.get('/', (req, res) => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
  const indexPath = path.join(__dirname, 'public', 'index.html');
  
  // Read the HTML file and inject the backend URL
  const fs = require('fs');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error loading page');
    }
    
    // Inject the backend URL as a global variable
    const modifiedHtml = data.replace(
      '<script>',
      `<script>
        window.BACKEND_URL = '${backendUrl}';`
    );
    
    res.send(modifiedHtml);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Hostname: ${os.hostname()}`);
});