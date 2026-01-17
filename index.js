const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const _ = require('lodash');
const { dataGame } = require('./utils/data');
const router = require('./routes');

const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
   STATIC FILES
===================== */
app.use('/public', express.static(path.join(__dirname, 'public')));

/* =====================
   API
===================== */
app.use('/api', router);

app.get('/endpoint', (req, res) => {
  const newDataGame = dataGame.map(item => ({
    name: item.name,
    slug: item.slug,
    endpoint: `/api/game/${item.slug}`,
    query: `?id=xxxx${item.isZone ? '&zone=xxx' : ''}`,
    hasZoneId: item.isZone,
    listZoneId: item.dropdown
      ? `/api/game/get-zone/${item.slug}`
      : null,
  }));

  res.json({
    name: 'XSTBot Whatsapp',
    data: _.orderBy(newDataGame, ['name'], ['asc']),
  });
});

/* =====================
   PAGES
===================== */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '404.html'));
});

app.get('/dokumentasi', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dokumentasi.html'));
});

/* =====================
   404 FALLBACK (WEB ONLY)
===================== */
app.use((req, res) => {
  res.status(404).sendFile(
    path.join(__dirname, 'public', '404.html')
  );
});

/* =====================
   EXPORT ONLY (NO LISTEN)
===================== */
module.exports = app;
