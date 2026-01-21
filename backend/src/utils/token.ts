import crypto from 'crypto';

export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const verifyTokenHash = (token: string, hash: string): boolean => {
  return hashToken(token) === hash;
};
