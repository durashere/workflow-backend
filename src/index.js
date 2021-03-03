import mongoose from './config/mongoose';
import app from './config/express';
import { port } from './config/config';

mongoose.connect();

app.listen(port, () => {
  console.log(`Server has started on port ${port}!`);
});
