import { describe, expect, it } from 'vitest';
import {
  generateOTP,
  validateOTP,
  isOTPExpired,
  generateSecureToken,
  hashOTP,
  verifyOTP,
} from '../utils/otpUtils.js';

describe('generateOTP', () => {
  it('returns a 6-digit numeric string between 100000 and 999999', () => {
    const otp = generateOTP();

    expect(typeof otp).toBe('string');
    expect(otp).toMatch(/^\d{6}$/);
    expect(Number(otp)).toBeGreaterThanOrEqual(100000);
    expect(Number(otp)).toBeLessThanOrEqual(999999);
  });
});

describe('validateOTP', () => {
  it('accepts only exactly 6 digits', () => {
    expect(validateOTP('123456')).toBe(true);
    expect(validateOTP('000000')).toBe(true);
  });

  it('rejects short, long and non-numeric OTPs', () => {
    expect(validateOTP('12345')).toBe(false);
    expect(validateOTP('1234567')).toBe(false);
    expect(validateOTP('12ab56')).toBe(false);
    expect(validateOTP('')).toBe(false);
  });
});

describe('isOTPExpired', () => {
  it('flags timestamps in the past as expired', () => {
    expect(isOTPExpired(new Date(Date.now() - 60_000))).toBe(true);
  });

  it('treats future timestamps as still valid', () => {
    expect(isOTPExpired(new Date(Date.now() + 60_000))).toBe(false);
  });
});

describe('generateSecureToken', () => {
  it('returns a unique 64-char hex token (32 random bytes)', () => {
    const a = generateSecureToken();
    const b = generateSecureToken();

    expect(a).toMatch(/^[a-f0-9]{64}$/);
    expect(a).not.toBe(b);
  });
});

describe('hashOTP + verifyOTP', () => {
  it('verifies the correct OTP against its bcrypt hash', async () => {
    const otp = '987654';
    const hash = await hashOTP(otp);

    expect(hash).not.toBe(otp);
    await expect(verifyOTP(otp, hash)).resolves.toBe(true);
  });

  it('rejects a wrong OTP', async () => {
    const hash = await hashOTP('123456');

    await expect(verifyOTP('654321', hash)).resolves.toBe(false);
  });
});
