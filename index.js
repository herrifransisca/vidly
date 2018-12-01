require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const error = require('./middleware/error');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

// way #1 for "uncaught exception"
// process.on('uncaughtException', ex => {
//   console.log('WE GOT AN UNCAUGHT EXCEPTION');
//   winston.error(ex.message, ex);
//   process.exit(1);
// });

// way #2 for "uncaught exception"
winston.handleExceptions(
  new winston.transports.File({ filename: 'uncaughtExceptions.log' })
);

// way #1 for "unhandled promise rejection"
// process.on('unhandledRejection', ex => {
//   winston.error(ex.message, ex);
//   process.exit(1);
// });

// way #2 for "unhandled promise rejection"
process.on('unhandledRejection', ex => {
  throw ex;
});

winston.add(winston.transports.File, { filename: 'logfile.log' });
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly' });

// throw new Error('Something failed during startup.'); // for uncaught exception

const p = Promise.reject(new Error('Something failed miserably!'));
p.then(() => console.log('Done')); // -> will have unhandled promise rejection

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

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
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
