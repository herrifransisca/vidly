const Joi = require('joi');
const { genreSchema } = require('./genre');
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, minlength: 5, maxlength: 50, required: true },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, default: 0, min: 0 },
  dailyRentalRate: { type: Number, default: 0, min: 0 }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(50)
      .required(),
    genre: Joi.required(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0)
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
