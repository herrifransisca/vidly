const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model(
  'Rental',
  new mongoose.Schema({
    dateOut: {
      type: Date,
      required: true,
      default: Date.now
    },
    dateReturned: {
      type: Date
    },
    customer: {
      type: new mongoose.Schema({
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        name: {
          type: String,
          required: true,
          min: 5,
          max: 50
        },
        isGold: {
          type: Boolean,
          required: true,
          default: false
        },
        phone: {
          type: String,
          required: true,
          min: 5,
          max: 50
        }
      }),
      required: true
    },
    movie: {
      type: new mongoose.Schema({
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        title: {
          type: String,
          required: true,
          trim: true,
          min: 5,
          max: 255
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0
        }
      }),
      required: true
    }
  })
);

function validateRental(rental) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  };

  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
