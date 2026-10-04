import { beforeAll, describe, expect, it, vi } from 'vitest';

// In-memory stand-in for IndexedDB so crypto utils can persist key material in jsdom
const { store } = vi.hoisted(() => ({ store: new Map() }));

vi.mock('idb-keyval', () => ({
  get: (key) => Promise.resolve(store.get(key)),
  set: (key, value) => {
    store.set(key, value);
    return Promise.resolve();
  },
}));

import {
  getSocketBaseUrl,
  loadOrCreateKeyPair,
  encryptMessagePayload,
  decryptMessagePayload,
} from '../utils/crypto.js';

beforeAll(async () => {
  await loadOrCreateKeyPair();
});

describe('getSocketBaseUrl', () => {
  it('strips the trailing /api to reach the socket.io origin', () => {
    expect(getSocketBaseUrl()).toBe('http://localhost:5000');
  });
});

describe('loadOrCreateKeyPair', () => {
  it('creates an X25519 keypair once and reuses the persisted keys', async () => {
    const first = await loadOrCreateKeyPair();

    expect(first.privateKey).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(first.publicKey).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(store.get('algonive:messaging:private-key')).toBe(first.privateKey);

    const second = await loadOrCreateKeyPair();
    expect(second).toEqual(first);
  });
});

describe('E2EE message roundtrip', () => {
  it('decrypts a payload encrypted for the current user back to plaintext', async () => {
    const payload = await encryptMessagePayload({
      plaintext: 'secret hi',
      participantMap: {},
      recipientIds: [],
      senderId: 'user-1',
    });

    expect(payload.ciphertext).not.toBe('secret hi');
    expect(Object.keys(payload.metadata.envelopes)).toContain('user-1');

    const plaintext = await decryptMessagePayload({ ...payload, currentUserId: 'user-1' });
    expect(plaintext).toBe('secret hi');
  });

  it('refuses to decrypt when no envelope exists for the current user', async () => {
    const payload = await encryptMessagePayload({
      plaintext: 'secret hi',
      participantMap: {},
      recipientIds: [],
      senderId: 'user-1',
    });

    await expect(decryptMessagePayload({ ...payload, currentUserId: 'stranger' })).rejects.toThrow(
      'No session envelope for current user'
    );
  });
});
