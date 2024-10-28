import mongoose from 'mongoose';

const screeningSchema = new mongoose.Schema({
  imdbID: {
    type: String,
    required: true,
  },
  screeningDate: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

const Screening = mongoose.model('Screening', screeningSchema);

export default Screening
