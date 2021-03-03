import path from 'path';
import dotenvSafe from 'dotenv-safe';

dotenvSafe.config({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  mongo: {
    uri:
      process.env.NODE_ENV === 'development'
        ? process.env.MONGO_URI_DEVELOPMENT
        : process.env.MONGO_URI_PRODUCTION,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
