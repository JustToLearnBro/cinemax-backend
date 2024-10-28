// const Booking = require('../models/bookingModel');
// const User = require('../models/userModel');

// import User from "../models/usermodel";

import Booking from "../models/bookingmodel.js";
import Screening from "../models/screeningmodel.js";

// Add a booking
export const addBooking = async (req, res) => {
  const { imdbID, seat, userId } = req.body;
  // console.log(req.body)

  if (!imdbID || !seat || !userId) {
    return res.status(405).json({ msg: 'Please provide all required fields' });
  }

  try {
    // Find if the booking for the imdbID already exists
    let booking = await Booking.findOne({ imdbID });

    // If no booking found for this imdbID, create a new one
    if (!booking) {
      booking = new Booking({
        imdbID,
        bookedSeats: [{ seat, user: userId }],
      });
    } else {
      // If booking exists, check if the seat is already booked
      if (booking.bookedSeats.find((s) => s.seat === seat)) {
        return res.status(400).json({ msg: 'Seat already booked' });
      }

      // Add the seat and user to the bookedSeats array
      booking.bookedSeats.push({ seat, user: userId });
    }

    await booking.save();
    res.status(200).json({ msg: 'Seat booked successfully', booking });
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'An error occurred', error });
  }
};

// Get booked seats for a specific movie by imdbID
export const getBookedSeats = async (req, res) => {
  const { imdbID } = req.params;

  try {
    const booking = await Booking.findOne({ imdbID }).populate('bookedSeats.user');

    if (!booking) {
      return res.status(404).json({ msg: 'No bookings found for this movie' });
    }

    res.status(200).json({ bookedSeats: booking.bookedSeats });
  } catch (error) {
    res.status(500).json({ msg: 'An error occurred', error });
  }
};

export const hasBooked = async (req,res) => {
  const { imdbID, userId } = req.body;
  // console.log("req",req.body)

  const existingBooking = await Booking.findOne({ imdbID, 'bookedSeats.user': userId });
  // console.log(existingBooking)
  if (existingBooking) {
    return res.status(200).json({ status: true });
  }
  else
  {
    return res.status(201).json({ status: false });
  }
}

export const getUserBooking = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all bookings where bookedSeats contains the specified userId
    const userBookings = await Booking.find({
      'bookedSeats.user': userId
    }).select('imdbID bookedSeats screeningId date');

    if (userBookings.length === 0) {
      return res.status(404).json({ msg: 'No bookings found for this user.' });
    }

    // Prepare array of imdbIDs to fetch the corresponding screening dates
    const imdbIDs = userBookings.map(booking => booking.imdbID);

    // Fetch screening dates for all imdbIDs from the Screening model
    const screenings = await Screening.find({
      imdbID: { $in: imdbIDs }
    }).select('imdbID screeningDate');

    // Create a map of imdbID -> screeningDate for quick lookup
    const screeningMap = screenings.reduce((map, screening) => {
      map[screening.imdbID] = screening.screeningDate;
      return map;
    }, {});

    // Map over the bookings to extract the necessary information
    // const bookings = userBookings.map(booking => {
    //   const userSeats = booking.bookedSeats.filter(seat => seat.user == userId);
    //   return {
    //     imdbID: booking.imdbID,
        
    //     // date: booking.date, // Assuming booking has its own date field
    //     seats: userSeats.map(seat => seat.seatNumber) // Mapping seat numbers
    //   };
    // });

    let bookings = userBookings.map(booking => {
      // console.log(booking)
      const userSeats = booking.bookedSeats.filter(seat => seat.user == userId);
      return {
        imdbID: booking.imdbID,
        // screeningId: booking.screeningId,
        screeningDate: screeningMap[booking.imdbID], // Get screeningDate from the map
        seats: userSeats.flatMap(seat => seat.seat), 
      };
    });
    // console.log("return",bookings)
    bookings=bookings.sort((a, b) => new Date(b.screeningDate) - new Date(a.screeningDate));
    // console.log(bookings)
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ msg: 'Error fetching user bookings. Please try again later.' });
  }
};




