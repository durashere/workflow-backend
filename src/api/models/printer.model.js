import mongoose from 'mongoose';

const printerSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      enum: ['Xerox', 'HP'],
      required: [true, 'You must enter printer brand'],
    },
    model: {
      type: String,
      required: [true, 'You must select printer model'],
    },
    location: {
      type: String,
      enum: {
        values: ['kra', 'war'],
        message: 'Location must be set',
      },
    },
    toners: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Toner',
      },
    ],
  },
  { timestamps: true }
);

const Printer = mongoose.model('Printer', printerSchema);

export default Printer;
