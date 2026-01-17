const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const _ = require('lodash');

const { dataGame } = require('./utils/data');
const router = require('./routes');

const app = express();

/* =======================
   Security & Limit
======================= */
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* =======================
   API ROUTES ONLY
======================= */
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

/* =======================
   EXPORT ONLY
======================= */
module.exports = app;
