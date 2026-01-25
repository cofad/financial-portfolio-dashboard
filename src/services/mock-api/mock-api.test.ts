import { describe, expect, it, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { ZodError } from 'zod';

import { convertToTimeString } from '@utils/date';
import {
  fetchHistory,
  fetchQuote,
  fetchQuotes,
  fetchSearchResults,
  type History,
  type Quote,
  type SearchResult,
} from './mock-api';

const MOCK_API_URL = 'https://financial-portfolio-dashboard-server.fly.dev';

const { logErrorMock } = vi.hoisted(() => {
  return {
    logErrorMock: vi.fn(),
  };
});

vi.mock('loglevel', () => {
  return {
    default: {
      error: logErrorMock,
    },
  };
});

const server = setupServer(
  http.get(`${MOCK_API_URL}/search`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    const matches: SearchResult[] = query
      ? [
          {
            name: 'AAPL',
            description: 'Apple Inc.',
            price: 110,
            type: 'Stock',
          },
        ]
      : [];

    return HttpResponse.json(
      {
        count: matches.length,
        matches,
      },
      { status: 200 },
    );
  }),
  http.get(`${MOCK_API_URL}/quote`, function ({ request }) {
    const url = new URL(request.url);
    const symbol = url.searchParams.get('name');

    if (!symbol) {
      return new HttpResponse(null, { status: 400 });
    }

    return HttpResponse.json(
      {
        currentPrice: 110,
        previousClosePrice: 108,
      },
      { status: 200 },
    );
  }),
  http.get(`${MOCK_API_URL}/history`, function ({ request }) {
    const url = new URL(request.url);
    const symbol = url.searchParams.get('name');

    if (!symbol) {
      return new HttpResponse(null, { status: 400 });
    }

    return HttpResponse.json(
      {
        description: 'Apple Inc.',
        name: symbol,
        type: 'Stock',
        history: [
          { date: '2024-01-01', price: 100 },
          { date: '2024-01-02', price: 110 },
        ],
      },
      { status: 200 },
    );
  }),
);

beforeAll(function () {
  server.listen();
});

afterEach(function () {
  server.resetHandlers();
});

afterAll(function () {
  server.close();
});

describe('mock-api', () => {
  it('fetchSearchResults returns parsed matches', async () => {
    const results = await fetchSearchResults('aapl');

    expect(results).toEqual<SearchResult[]>([
      {
        name: 'AAPL',
        description: 'Apple Inc.',
        price: 110,
        type: 'Stock',
      },
    ]);
  });

  it('fetchQuote returns a quote with the requested symbol', async () => {
    const quote = await fetchQuote('AAPL');

    expect(quote).toEqual<Quote>({
      symbol: 'AAPL',
      currentPrice: 110,
      previousClosePrice: 108,
    });
  });

  it('fetchQuotes returns quotes for each symbol', async () => {
    const quotes = await fetchQuotes(['BTC', 'AAPL']);

    expect(quotes).toEqual<Quote[]>([
      { symbol: 'BTC', currentPrice: 110, previousClosePrice: 108 },
      { symbol: 'AAPL', currentPrice: 110, previousClosePrice: 108 },
    ]);
  });

  it('fetchHistory maps api history into TimeString records', async () => {
    const history = await fetchHistory('AAPL');

    const expected: History[] = [
      {
        symbol: 'AAPL',
        date: convertToTimeString(new Date('2024-01-01T12:00-0500')),
        price: 100,
      },
      {
        symbol: 'AAPL',
        date: convertToTimeString(new Date('2024-01-02T12:00-0500')),
        price: 110,
      },
    ];

    expect(history).toEqual(expected);
  });

  it('throws when quote response is invalid', async function () {
    server.use(
      http.get(`${MOCK_API_URL}/quote`, () => {
        return HttpResponse.json({ bad: 'data' }, { status: 200 });
      }),
    );

    await expect(fetchQuote('AAPL')).rejects.toBeInstanceOf(ZodError);
  });
});
