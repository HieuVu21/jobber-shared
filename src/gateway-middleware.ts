import jwt from 'jsonwebtoken';
import { NotAuthorizeError } from './error-handler';
import { Request, Response, NextFunction } from 'express';
const tokens: string[] = [
  'auth',
  'gig',
  'seller',
  'search',
  'buyer',
  'message',
  'order',
  'review',
];

export function verifyGatewayRequest(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.headers?.gatewaytoken) {
    throw new NotAuthorizeError(
      'invalid request',
      'request not coming from api gateway'
    );
  }
  const token: string = req.headers?.gatewaytoken as string;
  if (!token) {
    throw new NotAuthorizeError(
      'invalid request',
      'request not coming from api gateway'
    );
  }
  try {
    const payload: { id: string; iat: number } = jwt.verify(token, 'wWDLjsTTXOCdNEKRQsLHiGIZlcaIACxRmePyyjQGDjBpwLfxGRWCoqaCEfRVrVeX') as {
      id: string;
      iat: number;
    };
    if (!token.includes(payload.id)) {
      throw new NotAuthorizeError('invalid request', 'payload invalid');
    }
  } catch (error) {
    throw new NotAuthorizeError(
      'invalid request',
      'request not coming from api gateway'
    );
  }
  next();
}
