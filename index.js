const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const router = require('./routes');

const app = express();
const port = process.env.PORT || 3001;

// Rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⬇️ PENTING
app.use(express.static(path.join(__dirname, 'public'), {
  index: false
}));

// API
app.use('/api', router);

// Root → 404 UI
app.get('/', (req, res) => {
  res.status(404).sendFile(
    path.join(__dirname, 'public', '404.html')
  );
});

// Optional
app.get('/dokumentasi', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dokumentasi.html'));
});

// Fallback
app.use((req, res) => {
  res.status(404).sendFile(
    path.join(__dirname, 'public', '404.html')
  );
});

app.listen(port, () => {
  console.log(`API running on ${port}`);
});

module.exports = app;
