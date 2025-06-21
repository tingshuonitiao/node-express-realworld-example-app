import { expressjwt as jwt } from 'express-jwt';
import * as express from 'express';
import logger from '../../../logger';

logger.error(`JWT_SECRET in auth.ts is: ${process.env.JWT_SECRET}`); 

const getTokenFromHeaders = (req: express.Request): string | null => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    
    logger.error(`token: ${req.headers.authorization.split(' ')[1]}`);
    logger.error(`校验secret: ${process.env.JWT_SECRET || 'superSecret'}`);
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: process.env.JWT_SECRET,
    getToken: getTokenFromHeaders,
    algorithms: ['HS256'],
  }),
  optional: jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
    algorithms: ['HS256'],
  }),
};

export default auth;
