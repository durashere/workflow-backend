import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'You must provide address'],
  },
  code: {
    type: String,
    required: [true, 'You must provide code'],
  },
  city: {
    type: String,
    required: [true, 'You must provide city'],
  },
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
