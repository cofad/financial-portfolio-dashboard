import '@testing-library/jest-dom/vitest';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import useDebounce from './useDebounce';

describe('useDebounce', function () {
  it('returns the latest value after the delay', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value, delayMs }) => useDebounce(value, delayMs), {
      initialProps: {
        value: 'initial',
        delayMs: 250,
      },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'next', delayMs: 250 });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(249);
    });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('next');

    vi.useRealTimers();
  });

  it('clears the timeout on unmount', () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

    const { unmount, rerender } = renderHook(({ value, delayMs }) => useDebounce(value, delayMs), {
      initialProps: {
        value: 'first',
        delayMs: 300,
      },
    });

    rerender({ value: 'second', delayMs: 300 });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
    vi.useRealTimers();
  });
});
