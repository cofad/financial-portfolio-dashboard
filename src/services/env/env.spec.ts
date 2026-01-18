import { describe, expect, it } from 'vitest';

describe('env', () => {
  it('should validate environment variables on import', async () => {
    const module = await import('./env');

    expect(module.env).toBeDefined();
  });
});
