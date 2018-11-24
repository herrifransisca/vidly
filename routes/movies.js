const { Movie, validate } = require('../models/movie');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let movie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  movie = await movie.save();

  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: req.body.genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      },
      { new: true }
    );

    return res.send(movie);
  } catch (err) {
    return res.status(404).send('The movie with the given ID was not found.');
  }

  // let movie = await Movie.findById(req.params.id);

  // if (!movie)
  //   return res.status(404).send('The movie with the given ID was not found.');

  // movie.title = req.body.title;
  // movie.genre = req.body.genre;
  // movie.numberInStock = req.body.numberInStock;
  // movie.dailyRentalRate = req.body.dailyRentalRate;

  // movie = await movie.save();

  // return res.send(movie);
});

router.delete('/:id', async (req, res) => {
  // const movie = await Movie.findByIdAndRemove(req.params.id);

  // if (!movie)
  //   return res.status(404).send('The movie with the given ID was not found.');

  // res.send(movie);

  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    res.send(movie);
  } catch (err) {
    return res.status(404).send('The movie with the given ID was not found.');
  }
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

module.exports = router;
