import { beforeEach, describe, expect, it, vi } from 'vitest';

// Shared mock axios instance that services/api.js will receive from axios.create()
const { http } = vi.hoisted(() => {
  const http = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
  return { http };
});

vi.mock('axios', () => ({
  default: { create: vi.fn(() => http) },
}));

import api, { authAPI, teamAPI, taskAPI } from '../services/api';

// Captured while the module registers its interceptors (before any test clears mocks)
const requestInterceptor = http.interceptors.request.use.mock.calls[0][0];

beforeEach(() => {
  http.get.mockReset();
  http.post.mockReset();
  http.put.mockReset();
  http.patch.mockReset();
  http.delete.mockReset();
});

describe('api service endpoints', () => {
  it('authAPI.login posts credentials to /auth/login', async () => {
    http.post.mockResolvedValueOnce({ data: { token: 'jwt' } });

    await authAPI.login({ email: 'ravi@example.com', password: 'secret123' });

    expect(http.post).toHaveBeenCalledWith('/auth/login', {
      email: 'ravi@example.com',
      password: 'secret123',
    });
  });

  it('taskAPI.updateStatus sends a PATCH to /tasks/:id/status', async () => {
    http.patch.mockResolvedValueOnce({ data: {} });

    await taskAPI.updateStatus('507f1f77bcf86cd799439011', { status: 'completed' });

    expect(http.patch).toHaveBeenCalledWith('/tasks/507f1f77bcf86cd799439011/status', {
      status: 'completed',
    });
  });

  it('teamAPI.removeMember builds the remove-member DELETE url', async () => {
    http.delete.mockResolvedValueOnce({ data: {} });

    await teamAPI.removeMember('team-1', 'user-2');

    expect(http.delete).toHaveBeenCalledWith('/teams/team-1/remove-member/user-2');
  });

  it('caches repeat taskAPI.getById calls into a single GET', async () => {
    http.get.mockResolvedValue({ data: { task: { _id: 't1' } } });

    await taskAPI.getById('t1');
    await taskAPI.getById('t1');
    await taskAPI.getById('t1');

    expect(http.get).toHaveBeenCalledTimes(1);
    expect(http.get).toHaveBeenCalledWith('/tasks/t1');
  });
});

describe('request interceptor', () => {
  it('attaches the stored token as a Bearer Authorization header', () => {
    localStorage.setItem('token', 'jwt-123');

    const config = requestInterceptor({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer jwt-123');
  });

  it('leaves headers untouched when no token is stored', () => {
    const config = requestInterceptor({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });
});
