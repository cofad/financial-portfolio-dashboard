import type { UseSuspenseQueryOptions } from '@tanstack/react-query';

import { fetchQuotes, type Quote } from '@services/mock-api/mock-api';

export type QuotesQueryKey = readonly ['quotes', string];

export function buildQuotesQueryKey(holdingSymbols: string[]): QuotesQueryKey {
  return ['quotes', holdingSymbols.join(',')] as const;
}

export function buildQuotesQueryOptions(
  holdingSymbols: string[],
): UseSuspenseQueryOptions<Quote[], Error, Quote[], QuotesQueryKey> {
  return {
    queryKey: buildQuotesQueryKey(holdingSymbols),
    queryFn: () => fetchQuotes(holdingSymbols),
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  };
}
