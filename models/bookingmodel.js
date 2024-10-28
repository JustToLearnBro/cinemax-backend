// const mongoose = require('mongoose');

import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookingSchema = new Schema({
  imdbID: {
    type: String,
    required: true,
  },
  bookedSeats: [{
    seat: {
      type: [String],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }],
});
const Booking=mongoose.model('Booking', bookingSchema);

export default Booking