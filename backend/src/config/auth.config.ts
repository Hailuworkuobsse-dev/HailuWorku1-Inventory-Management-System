import dotenv from 'dotenv';
dotenv.config();

export const AUTH_CONFIG = {
  JWT_SECRET: process.env.NODE_ENV === 'production' 
    ? (() => { 
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required in production');
        return process.env.JWT_SECRET;
      })()
    : (process.env.JWT_SECRET || 'dev-secret-key-change-me'),
  JWT_EXPIRES_IN: '12h', // Session timeout (Req 12.1)
  BCRYPT_SALT_ROUNDS: 12,
};
