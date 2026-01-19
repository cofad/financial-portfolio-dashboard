import axios from 'axios';
import { z } from 'zod';
import { env } from '@services/env/env';

const metaDataSchema = z.object({
  '1. Information': z.string(),
  '2. Symbol': z.string(),
  '3. Last Refreshed': z.string(),
  '4. Output Size': z.string().optional(),
  '5. Time Zone': z.string().optional(),
});

const ohlcvSchema = z.object({
  '1. open': z.string(),
  '2. high': z.string(),
  '3. low': z.string(),
  '4. close': z.string(),
  '5. volume': z.string(),
});

interface OHLCV {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const timeSeriesDailyResponseSchema = z.object({
  'Meta Data': metaDataSchema,
  'Time Series (Daily)': z.record(z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/), ohlcvSchema),
});

const alphaVantageClient = axios.create({
  baseURL: 'https://www.alphavantage.co/query',
});

export const fetchTimeSeriesDaily = async (symbol: string): Promise<OHLCV[]> => {
  const response = await alphaVantageClient.get<unknown>('', {
    params: {
      function: 'TIME_SERIES_DAILY',
      symbol,
      apikey: env.VITE_ALPHA_VANTAGE_API_KEY,
    },
  });

  const parsed = timeSeriesDailyResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new Error('Invalid Alpha Vantage time series response');
  }
  return Object.entries(parsed.data['Time Series (Daily)']).map(([, ohlcvResponse]) => {
    return {
      open: parseFloat(ohlcvResponse['1. open']),
      high: parseFloat(ohlcvResponse['2. high']),
      low: parseFloat(ohlcvResponse['3. low']),
      close: parseFloat(ohlcvResponse['4. close']),
      volume: parseFloat(ohlcvResponse['5. volume']),
    };
  });
};
