const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Customer = mongoose.model(
  'Customer',
  new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    phone: { type: String, required: true },
    isGold: { type: Boolean, required: true }
  })
);

router.get('/', async (req, res) => {
  const customer = await Customer.find().sort('name');

  res.send(customer);
});

router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  customer = await customer.save();

  res.send(customer);
});

router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
      { new: true }
    );
    res.send(customer);
  } catch (err) {
    return res
      .status(404)
      .send('The customer with the given ID was not found.');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    res.send(customer);
  } catch (err) {
    return res
      .status(404)
      .send('The customer with the given ID was not found.');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    return res
      .status(404)
      .send('The customer with the given ID was not found.');
  }
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean().required()
  };

  return Joi.validate(customer, schema);
}

module.exports = router;
