import { describe, expect, it, vi } from 'vitest';

import { convertToDateString, convertToTimeString, getNowIsoWithOffset, isDateString, isTimeString } from './date';

describe('date utils', () => {
  describe('isDateString', () => {
    it('validates date strings in YYYY-MM-DD format', () => {
      expect(isDateString('2024-02-29')).toBe(true);
      expect(isDateString('2024-2-29')).toBe(false);
      expect(isDateString('2024-13-01')).toBe(false);
    });
  });

  describe('isTimeString', () => {
    it('validates time strings in ISO format with offset', () => {
      expect(isTimeString('2024-02-28T12:00:00+00:00')).toBe(true);
      expect(isTimeString('2024-02-29T15:04:05')).toBe(false);
    });
  });

  describe('convertToDateString', () => {
    it('converts dates to branded date strings', () => {
      const date = new Date(2024, 1, 29, 12, 0, 0);
      expect(convertToDateString(date)).toBe('2024-02-29');
    });
  });

  describe('convertToTimeString', () => {
    it('converts dates to branded time strings', () => {
      const date = new Date(2024, 1, 29, 15, 4, 5);
      expect(convertToTimeString(date)).toBe('2024-02-29T15:04:05+00:00');
    });
  });

  describe('getNowIsoWithOffset', () => {
    it('returns the current time in ISO format with offset', () => {
      const now = new Date(2024, 0, 15, 8, 30, 12);

      vi.useFakeTimers();
      vi.setSystemTime(now);

      expect(getNowIsoWithOffset()).toBe('2024-01-15T08:30:12+00:00');

      vi.useRealTimers();
    });
  });
});
