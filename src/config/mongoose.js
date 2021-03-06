import mongoose from 'mongoose';
import { env, mongo } from './config';

if (env === 'development') {
  mongoose.set('debug', true);
}

export default async () => {
  try {
    await mongoose.connect(mongo.uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      autoIndex: true,
      keepAlive: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected to ${env}`);
  } catch (err) {
    console.log(err);
  }
};
