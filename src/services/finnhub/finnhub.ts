import axios from 'axios';
import { z } from 'zod';

const symbolLookupResultSchema = z.object({
  description: z.string(),
  displaySymbol: z.string(),
  symbol: z.string(),
  type: z.enum(['Common Stock', 'ETP', 'Unknown']).catch('Unknown'),
});

const symbolLookupResponseSchema = z.object({
  count: z.number().optional(),
  result: z.array(symbolLookupResultSchema).optional(),
});

// https://finnhub.io/docs/api/quote
const quoteResponseSchema = z.object({
  c: z.number(), // current price
  d: z.number(), // change
  dp: z.number(), // dp percent change
  h: z.number(), // high price of the day
  l: z.number(), // low price of the day
  o: z.number(), // open price of the day
  pc: z.number(), // previous close price
});

export interface Quote {
  symbol: string;
  currentPrice: number;
  previousClosePrice: number;
}

export type SymbolLookupResult = z.infer<typeof symbolLookupResultSchema>;
export type SymbolLookupResponse = z.infer<typeof symbolLookupResponseSchema>;
export type QuoteResponse = z.infer<typeof quoteResponseSchema>;

export type AssetType = SymbolLookupResult['type'];

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
      quotes.push({ symbol, currentPrice: quote.c, previousClosePrice: quote.pc });
    }),
  );

  return quotes;
};
