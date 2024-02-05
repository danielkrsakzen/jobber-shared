import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from './error-handler';

const tokens: string[] = [
  'auth',
  'seller',
  'gig',
  'search',
  'buyer',
  'message',
  'order',
  'review',
];

const verifyGatewayRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.headers.gatewayToken) {
    throw new NotAuthorizedError(
      'Invalid request',
      'verifyGatewayRequest() method: Request not coming from API gateway'
    );
  }

  const token: string = req.headers.gatewayToken as string;

  const payload: { id: string; iat: number } = JWT.verify(token, 'asdf') as {
    id: string;
    iat: number;
  };

  if (!tokens.includes(payload.id)) {
    throw new NotAuthorizedError(
      'Invalid request',
      'verifyGatewayRequest() method: Request payload is invalid'
    );
  }

  next();
};
