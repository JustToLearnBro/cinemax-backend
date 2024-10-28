// const express = require('express');
import express from 'express';
const router = express.Router();
import { addBooking, getBookedSeats,hasBooked,getUserBooking } from '../controllers/booking.controller.js';

// Route to add a booking
router.post('/book', addBooking);

// Route to get booked seats for a specific movie (by imdbID)
router.get('/:imdbID/booked-seats', getBookedSeats);

router.post('/:imdbID/hasBooked', hasBooked);

router.get('/user/:userId',getUserBooking);





export default router;