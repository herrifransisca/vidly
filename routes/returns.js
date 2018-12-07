const { Rental } = require('../models/rental');
const app = require('express');
const router = app.Router();

router.post('/', (req, res) => {
  res.status(401).send('Unauthorized');
});

module.exports = router;
