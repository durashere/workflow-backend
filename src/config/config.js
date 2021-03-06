import dotenvSafe from 'dotenv-safe';
import path from 'path';

dotenvSafe.config({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

export const env = process.env.NODE_ENV;
export const jwtExpire = process.env.JWT_EXPIRE;
export const jwtSecret = process.env.JWT_SECRET;
export const logs = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
export const mongo = {
  uri:
    process.env.NODE_ENV === 'development'
      ? process.env.MONGO_URI_DEVELOPMENT
      : process.env.MONGO_URI_PRODUCTION,
};
export const port = process.env.PORT;
