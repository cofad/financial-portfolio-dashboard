import axios from 'axios';
import { z } from 'zod';
import { env } from '@/services/env/env';

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

export type SymbolLookupResult = z.infer<typeof symbolLookupResultSchema>;
export type SymbolLookupResponse = z.infer<typeof symbolLookupResponseSchema>;

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const CORS_ANYWHERE_BASE_URL = 'https://cors-anywhere.herokuapp.com/';

const finnhubClient = axios.create({
  baseURL: `${CORS_ANYWHERE_BASE_URL}${FINNHUB_BASE_URL}`,
});

export const symbolLookup = async (query: string): Promise<SymbolLookupResponse> => {
  const response = await finnhubClient.get<unknown>('/search', {
    params: {
      q: query,
      token: env.VITE_FINNHUB_API_KEY,
    },
  });

  const parsed = symbolLookupResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new Error('Invalid finnhub symbol lookup response');
  }

  return parsed.data;
};
