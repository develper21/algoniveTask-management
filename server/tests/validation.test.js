import { describe, expect, it, vi } from 'vitest';
import { schemas, validate, validateObjectId } from '../utils/validation.js';

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('auth schemas', () => {
  it('accepts a valid signup payload and defaults role to member', () => {
    const { error, value } = schemas.register.validate({
      name: 'Ravi Kumar',
      email: 'ravi@example.com',
      password: 'secret123',
    });

    expect(error).toBeUndefined();
    expect(value.role).toBe('member');
  });

  it('rejects signup with a bad email, short name and short password', () => {
    const { error } = schemas.register.validate(
      {
        name: 'A',
        email: 'not-an-email',
        password: '123',
      },
      { abortEarly: false }
    );

    expect(error).toBeDefined();
    const fields = error.details.map((d) => d.path.join('.'));
    expect(fields).toContain('email');
    expect(fields).toContain('name');
    expect(fields).toContain('password');
  });

  it('requires both email and password for login', () => {
    const { error } = schemas.login.validate({ email: 'ravi@example.com' });

    expect(error).toBeDefined();
    expect(error.details.map((d) => d.path.join('.'))).toContain('password');
  });

  it('rejects an OTP that is not exactly 6 digits', () => {
    const { error } = schemas.verifyOTP.validate({ email: 'ravi@example.com', otp: '12ab56' });

    expect(error).toBeDefined();
    expect(error.details.map((d) => d.path.join('.'))).toContain('otp');
  });
});

describe('task schemas', () => {
  it('accepts a valid task and applies status/priority defaults', () => {
    const { error, value } = schemas.createTask.validate({
      title: 'Write CI pipeline',
      team: '507f1f77bcf86cd799439011',
    });

    expect(error).toBeUndefined();
    expect(value.status).toBe('pending');
    expect(value.priority).toBe('medium');
  });

  it('rejects a task whose team is not a valid MongoDB ObjectId', () => {
    const { error } = schemas.createTask.validate({
      title: 'Bad team id',
      team: 'not-an-object-id',
    });

    expect(error).toBeDefined();
    expect(error.details.map((d) => d.path.join('.'))).toContain('team');
  });

  it('rejects updateTask with an unsupported status value', () => {
    const { error } = schemas.updateTask.validate({ status: 'archived' });

    expect(error).toBeDefined();
  });
});

describe('taskQuery schema', () => {
  it('applies pagination and sort defaults for an empty query', () => {
    const { error, value } = schemas.taskQuery.validate({});

    expect(error).toBeUndefined();
    expect(value).toMatchObject({ page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' });
  });

  it('rejects an unsupported sortBy field', () => {
    const { error } = schemas.taskQuery.validate({ sortBy: 'banana' });

    expect(error).toBeDefined();
  });
});

describe('validate middleware', () => {
  it('responds 400 with field errors and blocks the request on invalid input', () => {
    const middleware = validate(schemas.login);
    const req = { body: { email: 'nope' } };
    const res = mockRes();
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Validation failed' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('strips unknown fields and calls next on valid input', () => {
    const middleware = validate(schemas.login);
    const req = { body: { email: 'ravi@example.com', password: 'secret123', injected: 'x' } };
    const next = vi.fn();

    middleware(req, mockRes(), next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body.injected).toBeUndefined();
  });
});

describe('validateObjectId middleware', () => {
  it('responds 400 for a malformed ObjectId param', () => {
    const middleware = validateObjectId('id');
    const res = mockRes();
    const next = vi.fn();

    middleware({ params: { id: 'abc123' } }, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next for a valid 24-char hex ObjectId', () => {
    const middleware = validateObjectId('id');
    const next = vi.fn();

    middleware({ params: { id: '507f1f77bcf86cd799439011' } }, mockRes(), next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
