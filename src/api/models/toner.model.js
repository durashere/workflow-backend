import mongoose from 'mongoose';

const tonerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'You must enter toner code'],
    },
    amount: { type: Number, default: 0 },
    color: {
      type: String,
      enum: ['Black', 'Cyan', 'Magenta', 'Yellow'],
      required: [true, 'You must select toner color'],
    },
    location: {
      type: String,
      enum: {
        values: ['kra', 'war'],
        message: 'Location must be set',
      },
    },
  },
  { timestamps: true }
);

const Toner = mongoose.model('Toner', tonerSchema);

export default Toner;
