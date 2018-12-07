const { Rental } = require('../models/rental');
const app = require('express');
const router = app.Router();

router.post('/', (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send('customerId not provided');

  if (!req.body.movieId) return res.status(400).send('movieId not provided');

  res.status(401).send('Unauthorized');
});

module.exports = router;
