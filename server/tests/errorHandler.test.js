import { describe, expect, it, vi } from 'vitest';
import { asyncHandler, notFound, errorHandler } from '../utils/errorHandler.js';

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const makeError = (name, props = {}) => {
  const err = new Error(props.message || 'boom');
  err.name = name;
  Object.assign(err, props);
  return err;
};

describe('asyncHandler', () => {
  it('passes req/res through to the wrapped handler', async () => {
    const handler = vi.fn(async () => 'ok');
    const wrapped = asyncHandler(handler);
    const req = { method: 'GET' };
    const res = mockRes();
    const next = vi.fn();

    await wrapped(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('routes errors thrown in async handlers to the Express next callback', async () => {
    const boom = new Error('db down');
    const wrapped = asyncHandler(async () => {
      throw boom;
    });
    const next = vi.fn();

    await wrapped({}, mockRes(), next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('notFound', () => {
  it('sets a 404 status and forwards an error naming the missed URL', () => {
    const res = mockRes();
    const next = vi.fn();

    notFound({ originalUrl: '/api/does-not-exist' }, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].message).toContain('/api/does-not-exist');
  });
});

describe('errorHandler', () => {
  it('maps a Mongoose CastError to 404 Resource not found', () => {
    const res = mockRes();

    errorHandler(makeError('CastError'), { method: 'GET', originalUrl: '/api/tasks/x' }, res, () => {});

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Resource not found' })
    );
  });

  it('maps a duplicate key error (code 11000) to 400', () => {
    const res = mockRes();
    const err = makeError('MongoServerError', { message: 'E11000', code: 11000 });

    errorHandler(err, { method: 'POST', originalUrl: '/api/auth/signup' }, res, () => {});

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Duplicate field value entered' })
    );
  });

  it('maps JWT errors to 401', () => {
    const res = mockRes();

    errorHandler(
      makeError('JsonWebTokenError', { message: 'jwt malformed' }),
      { method: 'GET', originalUrl: '/api/auth/me' },
      res,
      () => {}
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Invalid token' })
    );
  });

  it('falls back to 500 with the original message for unknown errors', () => {
    const res = mockRes();

    errorHandler(
      makeError('TypeError', { message: 'cannot read property of undefined' }),
      { method: 'GET', originalUrl: '/api/tasks' },
      res,
      () => {}
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'cannot read property of undefined' })
    );
  });
});
