import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Holding {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  assetType: string;
}

interface PortfolioState {
  holdings: Holding[];
}

const initialState: PortfolioState = {
  holdings: [],
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addHolding: (state, action: PayloadAction<Holding>) => {
      const normalizedSymbol = action.payload.symbol.trim().toUpperCase();
      const exists = state.holdings.some((holding) => holding.symbol.trim().toUpperCase() === normalizedSymbol);

      if (exists) {
        return;
      }

      state.holdings.push({
        ...action.payload,
        symbol: normalizedSymbol,
      });
    },
    removeHolding: (state, action: PayloadAction<string>) => {
      const normalizedSymbol = action.payload.trim().toUpperCase();
      state.holdings = state.holdings.filter(
        (holding) => holding.symbol.trim().toUpperCase() !== normalizedSymbol,
      );
    },
  },
});

export const { addHolding, removeHolding } = portfolioSlice.actions;
export default portfolioSlice.reducer;
