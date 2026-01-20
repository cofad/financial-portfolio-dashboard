import { normalizeSymbol } from '@utils/symbol';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Holding {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  assetType: string;
}

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
