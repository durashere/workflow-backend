import app from './config/express';
import mongoose from './config/mongoose';
import { port } from './config/config';

mongoose();

app.listen(port, () => {
  console.log(`Server has started on port ${port}!`);
});
