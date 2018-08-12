const express = require('express');

const logger = require('../common').logger;

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
  return next();
});

router.use((err, req, res, next) => {
  logger.error(err);
});

router.use((req, res, next) => {
  res.sendStatus(404);
});

module.exports = router;
