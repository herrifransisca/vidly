const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

mongoose
  .connect(
    'mongodb://localhost/vidly',
    { useNewUrlParser: true }
  )
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Failed to connect MongoDB...'));

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  }
});

const Genre = mongoose.model('Genre', genreSchema);

router.get('/', (req, res) => {
  Genre.find()
    .then(genres => res.send(genres))
    .catch(error => res.send('No data found.'));
});

async function getGenre(id, res) {
  const genre = await Genre.find({ _id: id });
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.'); // doesn't work. error displayed on terminal

  res.send(genre);
}

router.get('/:id', (req, res) => {
  // const genre = genres.find(g => g.id === parseInt(req.params.id));
  // if (!genre)
  //   return res.status(404).send('The genre with the given ID was not found.');

  // res.send(genre);

  // use find()
  // Genre.find({ _id: req.params.id })
  //   .then(result => res.send(result))
  //   .catch(() =>
  //     res.status(404).send('The genre with the given ID was not found.')
  //   );

  // use findById()
  Genre.findById(req.params.id)
    .then(result => res.send(result))
    .catch(() =>
      res.status(404).send('The genre with the given ID was not found.')
    );

  // getGenre(req.params.id, res);
});

router.post('/', (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) res.status(400).send(error.details[0].message);

  // code #4
  const genre = new Genre({ name: req.body.name });
  genre
    .save()
    .then(genre => res.send(genre))
    .catch(error => res.send(error.message));

  // code  #3
  // const genre = new Genre({ name: req.body.name });
  // createGenre(genre)
  //   .then(genre => res.send(genre))
  //   .catch(err => console.error(err.message));

  // code #2
  // const genre = { name: req.body.name };
  // createGenre(genre).then(genre => res.send(genre));

  // code #1 - failed
  // const result = createGenre(genre);
  // console.log(result);
  // res.send(result);  // returns empty object -> {}
});

async function updateGenre(id, res) {
  try {
    const genre = await Genre.findById(id);
  } catch (ex) {
    return res.status(404).send('The genre with the given ID was not found.');
  }

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  genre.set(obj);

  const result = await genre.save();
  res.send(result);
}

router.put('/:id', (req, res) => {
  // const genre = genres.find(g => g.id === parseInt(req.params.id));
  // if (!genre)
  //   return res.status(404).send('The genre with the given ID was not found.');

  // const { error } = validateGenre(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  // genre.name = req.body.name;
  // res.send(genre);

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  obj = { name: req.body.name };

  updateGenre(req.params.id, res, obj);
});

async function removeGenre(id, res) {
  const genre = await Genre.findByIdAndRemove(id);
  if (genre === null)
    return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);

  // code 9
  // return genre;
}

router.delete('/:id', (req, res) => {
  // const genre = genres.find(g => g.id === parseInt(req.params.id));
  // if (!genre)
  //   return res.status(404).send('The genre with the given ID was not found.');

  // const index = genres.indexOf(genre);
  // genres.splice(index, 1);

  // res.send(genre);

  removeGenre(req.params.id, res);

  // code 9
  // const genre = removeGenre(req.params.id, res);
  // genre.then(result => res.send(result));
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(genre, schema);
}

async function getGenres() {
  return await Genre.find();
}

async function createGenre(genre) {
  return await genre.save();

  // code #1 - failed
  // try {
  //   return await genre.save();
  // } catch (err) {
  //   return err.message;
  // }

  // const genre = new Genre(obj);
  // return await genre.save();
}

module.exports = router;
