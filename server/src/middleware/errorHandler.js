import { sendError } from '../utils/response.js';

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 'Validation failed', statusCode, errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, `${field} already exists`, 409);
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return sendError(res, 'Invalid ID format', 400);
  }

  if (err.name === 'JsonWebTokenError') return sendError(res, 'Invalid token', 401);
  if (err.name === 'TokenExpiredError') return sendError(res, 'Token expired', 401);

  if (process.env.NODE_ENV === 'development' && !err.isOperational) {
    console.error('ERROR:', err);
  }

  sendError(res, message, statusCode);
};

export default errorHandler;
