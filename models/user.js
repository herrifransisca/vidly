const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    }
  })
);

function validateUser(user) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
