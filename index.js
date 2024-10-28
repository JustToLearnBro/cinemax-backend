import express from "express";
import connectDB from "./db/db.config.js";  // Import the connectDB function
// import cors from "cors";
import userRouter from "./routes/user.routes.js";  // Import the router correctly

import bookingRouter from "./routes/booking.routes.js"

import screeningRouter from "./routes/screening.routes.js";

// import cors from "cors"
const app = express();

// Connect to the database

import cors from 'cors';
app.use(cors());
connectDB();

// Middleware (if you need any in the future)

// app.use(cors)
app.use(express.json()); // Parse incoming JSON requests


// Routes
app.get('/cinemax', (req, res) => {
  res.send('Hello World!');
});

// Use the router for user-related routes
app.use('/users', userRouter);


// Use the router for user-related routes
app.use('/screenings', screeningRouter);


app.use('/booking', bookingRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
