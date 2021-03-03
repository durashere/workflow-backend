import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['cms'],
      required: [true, 'You must provide category'],
    },
    name: {
      type: String,
      required: [true, 'You must provide name'],
    },
    link: {
      type: String,
      required: [true, 'You must provide link'],
    },
  },
  { timestamps: true }
);

const Template = mongoose.model('Template', templateSchema);

export default Template;
