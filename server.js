const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// Environment Variables
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'https://face-2snbrq2o3a-ue.a.run.app/detect';
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

// Proxy Route
app.post('/detect', async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);

    const externalResponse = await axios.post(EXTERNAL_API_URL, req.body, {
      headers: { 'Content-Type': 'application/json' },
    });

    res.status(externalResponse.status).json(externalResponse.data);
  } catch (error) {
    console.error('Error forwarding request to external API:', error);
    res.status(500).json({
      error: 'Failed to process the request.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Serve Angular App
app.use(express.static(path.resolve(__dirname, 'dist/face-detection-app')));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/face-detection-app/index.html'));
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
