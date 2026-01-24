import axios from 'axios';
import { z } from 'zod';
import { env } from '@services/env/env';
import { subDays } from 'date-fns';
import { convertToDateString } from '@/utils/date';
import type { DateString } from '@/types/date-string';

const timeSeriesDailyResponseSchema = z.object({
  adjusted: z.boolean(),
  next_url: z.string(),
  queryCount: z.number(),
  request_id: z.string(),
  results: z.array(
    z.object({
      c: z.number(),
      h: z.number(),
      l: z.number(),
      n: z.number(),
      o: z.number(),
      t: z.number(),
      v: z.number(),
      vw: z.number(),
    }),
  ),
});

export interface OHLCV {
  date: DateString;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const alphaVantageClient = axios.create({
  baseURL: 'https://api.massive.com/v2/',
});

export const fetchTimeSeriesDaily = async (symbol: string): Promise<OHLCV[]> => {
  const now = new Date();
  const from = convertToDateString(now);
  const to = convertToDateString(subDays(now, 100));

  const path = `/aggs/ticker/${symbol}/range/1/day/${to}/${from}`;

  const response = await alphaVantageClient.get<unknown>(path, {
    params: {
      apikey: env.VITE_MASSIVE_API_KEY,
      adjusted: true,
      sort: 'asc',
      limit: 120,
    },
  });

  const parsed = timeSeriesDailyResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new Error('Invalid Alpha Vantage time series response');
  }

  return parsed.data.results.map((ohlcvResponse, index) => {
    return {
      date: convertToDateString(subDays(now, index)),
      symbol,
      open: ohlcvResponse.o,
      high: ohlcvResponse.h,
      low: ohlcvResponse.l,
      close: ohlcvResponse.c,
      volume: ohlcvResponse.v,
    };
  });
};
