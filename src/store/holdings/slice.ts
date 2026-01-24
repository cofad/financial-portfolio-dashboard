import { normalizeSymbol } from '@utils/symbol';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { assetTypeSchema } from '@/services/mock-api/mock-api';
import z from 'zod';
import { isTimeString } from '@/utils/date';

export const holdingSchema = z.object({
  symbol: z.string(),
  quantity: z.number(),
  purchasePrice: z.number(),
  purchaseDate: z.string().refine(isTimeString),
  assetType: assetTypeSchema,
});

export type Holding = z.infer<typeof holdingSchema>;

interface HoldingsState {
  holdings: Holding[];
}

const initialState: HoldingsState = {
  holdings: [],
};

const holdingsSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addHolding: (state, action: PayloadAction<Holding>) => {
      const normalizedSymbol = normalizeSymbol(action.payload.symbol);
      const exists = state.holdings.some((holding) => normalizeSymbol(holding.symbol) === normalizedSymbol);

      if (exists) {
        return;
      }

      state.holdings.push({
        ...action.payload,
        symbol: normalizedSymbol,
      });
    },
    removeHolding: (state, action: PayloadAction<string>) => {
      const normalizedSymbol = normalizeSymbol(action.payload);
      state.holdings = state.holdings.filter((holding) => normalizeSymbol(holding.symbol) !== normalizedSymbol);
    },
  },
});

export const { addHolding, removeHolding } = holdingsSlice.actions;
export default holdingsSlice.reducer;
