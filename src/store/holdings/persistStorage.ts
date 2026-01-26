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

export function isStorageDisabledError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as {
    name?: string;
    message?: string;
  };

  const name = typeof candidate.name === 'string' ? candidate.name : '';
  const message = typeof candidate.message === 'string' ? candidate.message.toLowerCase() : '';

  if (name === 'SecurityError') {
    return true;
  }

  if (message.length === 0) {
    return false;
  }

  const mentionsStorage =
    message.includes('localstorage') || message.includes('local storage') || message.includes('storage');
  const indicatesBlocked =
    message.includes('disabled') ||
    message.includes('denied') ||
    message.includes('not available') ||
    message.includes('blocked') ||
    message.includes('insecure') ||
    message.includes('access');

  return mentionsStorage && indicatesBlocked;
}

export function createPersistStorage(): WebStorage {
  const baseStorage = createWebStorage('local');

  return {
    getItem: (key) => baseStorage.getItem(key),
    setItem: async (key, value) => {
      await baseStorage.setItem(key, value);
    },
    removeItem: (key) => baseStorage.removeItem(key),
  };
}
