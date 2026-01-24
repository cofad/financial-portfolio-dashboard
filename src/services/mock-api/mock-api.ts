import { convertToTimeString, isDateString, type TimeString } from '@/utils/date';
import axios from 'axios';
import log from 'loglevel';
import { z } from 'zod';

export const assetTypeSchema = z.enum(['Stock', 'ETF', 'Crypto']);

const searchResponseSchema = z.object({
  count: z.number(),
  matches: z.array(
    z.object({
      description: z.string(),
      price: z.number(),
      name: z.string(),
      type: assetTypeSchema,
    }),
  ),
});

const quoteResponseSchema = z.object({
  currentPrice: z.number(),
  previousClosePrice: z.number(),
});

const historyResponseSchema = z.object({
  description: z.string(),
  name: z.string(),
  type: assetTypeSchema,
  history: z.array(
    z.object({
      date: z.string().refine(isDateString),
      price: z.number(),
    }),
  ),
});

export interface Quote {
  symbol: string;
  currentPrice: number;
  previousClosePrice: number;
}

export interface History {
  date: TimeString;
  symbol: string;
  price: number;
}

export type SearchResponse = z.infer<typeof searchResponseSchema>;
export type SearchResult = SearchResponse['matches'][0];
export type AssetType = z.infer<typeof assetTypeSchema>;

const MOCK_API_URL = 'https://financial-portfolio-dashboard-server.fly.dev/';

const mockApiClient = axios.create({
  baseURL: MOCK_API_URL,
});

export const fetchSearchResults = async (query: string): Promise<SearchResult[]> => {
  const response = await mockApiClient.get<unknown>('/search', {
    params: {
      q: query,
    },
  });

  const parsed = searchResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    log.error(parsed.error);
    throw parsed.error;
  }

  return parsed.data.matches;
};

export const fetchQuote = async (symbol: string): Promise<Quote> => {
  const response = await mockApiClient.get<unknown>('/quote', {
    params: {
      name: symbol,
    },
  });

  const parsed = quoteResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    log.error(parsed.error);
    throw parsed.error;
  }

  return { symbol, ...parsed.data };
};

export const fetchQuotes = async (symbols: string[]): Promise<Quote[]> => {
  const quotes: Quote[] = [];

  await Promise.all(
    symbols.map(async (symbol) => {
      const quote = await fetchQuote(symbol);
      quotes.push(quote);
    }),
  );

  return quotes;
};

export const fetchHistory = async (symbol: string): Promise<History[]> => {
  const response = await mockApiClient.get<unknown>('/history', {
    params: {
      name: symbol,
    },
  });

  const parsed = historyResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    log.error(parsed.error);
    throw parsed.error;
  }

  const parsedData = parsed.data;

  return parsedData.history.map((h) => {
    return {
      symbol: symbol,
      date: convertToTimeString(new Date(h.date + 'T12:00-0500')),
      price: h.price,
    };
  });
};
