const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Paths to your SSL certificate and key
const sslOptions = {
  key: fs.readFileSync('C:/Users/yltri/localhost+2-key.pem'),
  cert: fs.readFileSync('C:/Users/yltri/localhost+2.pem'),
};

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, 'build')));

// For all other requests, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

// Create HTTPS server
https.createServer(sslOptions, app).listen(3000, () => {
  console.log('HTTPS server running on https://localhost:3000');
});
