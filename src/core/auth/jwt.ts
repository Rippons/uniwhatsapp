import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { getEnv } from '@core/config';
import type { JwtPayload } from '@shared/types';

export function generateToken(payload: JwtPayload): string {
  const { JWT_SECRET, JWT_EXPIRES_IN } = getEnv();
  return jwt.sign({ ...payload }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as StringValue,
  });
}

export function verifyToken(token: string): JwtPayload {
  const { JWT_SECRET } = getEnv();
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
