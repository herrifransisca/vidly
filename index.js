const mongoose = require('mongoose');
const home = require('./routes/home');
const genres = require('./routes/genres');
const express = require('express');
const app = express();

mongoose
  .connect(
    'mongodb://localhost/vidly',
    { useNewUrlParser: true }
  )
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/', home);
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
