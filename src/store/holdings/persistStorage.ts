import createWebStorage from 'redux-persist/es/storage/createWebStorage';
import type { WebStorage } from 'redux-persist/es/types';
import log from 'loglevel';

export function isQuotaExceededError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as {
    name?: string;
    code?: number;
    message?: string;
  };

  const name = typeof candidate.name === 'string' ? candidate.name : '';
  const code = typeof candidate.code === 'number' ? candidate.code : 0;
  const message = typeof candidate.message === 'string' ? candidate.message : '';

  return (
    name === 'QuotaExceededError' ||
    name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    code === 22 ||
    code === 1014 ||
    message.toLowerCase().includes('quota')
  );
}

export function createPersistStorage(): WebStorage {
  const baseStorage = createWebStorage('local');

  return {
    getItem: (key) => baseStorage.getItem(key),
    setItem: async (key, value) => {
      try {
        await baseStorage.setItem(key, value);
      } catch (error) {
        if (!isQuotaExceededError(error)) {
          log.error(error);
          throw error;
        }

        try {
          await baseStorage.removeItem(key);
        } catch (e) {
          log.error(e);
        }
      }
    },
    removeItem: (key) => baseStorage.removeItem(key),
  };
}
