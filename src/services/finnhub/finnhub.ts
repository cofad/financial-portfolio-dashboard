import axios from 'axios';
import { number, z } from 'zod';

const symbolLookupResultSchema = z.object({
  description: z.string().optional(),
  displaySymbol: z.string().optional(),
  symbol: z.string().optional(),
  type: z.string().optional(),
});

const symbolLookupResponseSchema = z.object({
  count: z.number().optional(),
  result: z.array(symbolLookupResultSchema).optional(),
});

const quoteResponseSchema = z.object({
  c: z.number(),
  d: z.number(),
  dp: z.number(),
  h: z.number(),
  l: z.number(),
  o: z.number(),
  pc: z.number(),
});

export interface Quote {
  symbol: string;
  currentPrice: number;
}

export type SymbolLookupResult = z.infer<typeof symbolLookupResultSchema>;
export type SymbolLookupResponse = z.infer<typeof symbolLookupResponseSchema>;
export type QuoteResponse = z.infer<typeof quoteResponseSchema>;

const FINNHUB_PROXY = 'https://financial-portfolio-dashboard-server.fly.dev/api/v1';

const finnhubClient = axios.create({
  baseURL: FINNHUB_PROXY,
});

export const symbolLookup = async (query: string): Promise<SymbolLookupResponse> => {
  const response = await finnhubClient.get<unknown>('/search', {
    params: {
      q: query,
    },
  });

  const parsed = symbolLookupResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new Error('Invalid finnhub symbol lookup response');
  }

  return parsed.data;
};

export const getQuote = async (symbol: string): Promise<QuoteResponse> => {
  const response = await finnhubClient.get<unknown>('/quote', {
    params: {
      symbol,
    },
  });

  const parsed = quoteResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new Error('Invalid finnhub quote response');
  }

  return parsed.data;
};

export const getQuotes = async (symbols: string[]): Promise<Quote[]> => {
  const quotes: Quote[] = [];

  await Promise.all(
    symbols.map(async (symbol) => {
      const quote = await getQuote(symbol);
      quotes.push({ symbol, currentPrice: quote.c });
    }),
  );

  return quotes;
};
