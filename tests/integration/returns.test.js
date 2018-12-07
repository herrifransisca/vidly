// POST /api/returns  { customerId, movieId }

// Returns 401 if client is not logged in
// Returns 400 if customerId is not provided
// Returns 400 if movieId is not provided
// Returns 404 if no rental found for this customer/movie
// Returns 400 if rental already processed
// Returns 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental

const request = require('supertest');
const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;

  beforeEach(async () => {
    server = require('../../index');

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.remove({});
  });

  it('should return 401 if client is not logged in', async () => {
    const res = await request(server)
      .post('/api/returns')
      .send({ customerId, movieId });

    expect(res.status).toBe(401);
  });
});
