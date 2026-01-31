import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('loglevel', () => ({
  default: {
    error: vi.fn(),
  },
}));

// eslint-disable-next-line no-restricted-syntax
const originalEnv = { ...import.meta.env };

describe('env', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    // eslint-disable-next-line no-restricted-syntax
    Object.assign(import.meta.env, originalEnv);
    vi.restoreAllMocks();
  });

  it('should validate environment variables on import', async () => {
    const module = await import('./env');

    expect(module.env).toBeDefined();
  });

  // Reactivate test once environment variables are required to be set
  it.skip('should throw when required environment variables are invalid', async () => {
    // eslint-disable-next-line no-restricted-syntax
    const mutableEnv = import.meta.env as Record<string, string>;
    mutableEnv.NODE_ENV = '';

    await expect(import('./env')).rejects.toThrow('Invalid environment variables');
  });
});
