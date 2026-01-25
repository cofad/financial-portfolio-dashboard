import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { addHolding, removeHolding, type Holding } from './slice';
import { selectHoldingSymbols, selectHoldings, store } from './store';
import { convertToTimeString } from '@utils/date';

function createHolding(symbol: string): Holding {
  return {
    symbol,
    quantity: 5,
    purchasePrice: 250,
    purchaseDate: convertToTimeString(new Date('2024-03-01T10:00:00+00:00')),
    assetType: 'Stock',
  };
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  store.dispatch(removeHolding('MSFT'));
  store.dispatch(removeHolding('NVDA'));
});

describe('holdings store selectors', () => {
  it('selects holdings from the store state', () => {
    const holding = createHolding('msft');

    store.dispatch(addHolding(holding));

    const state = store.getState();
    const holdings = selectHoldings(state);

    expect(holdings).toHaveLength(1);
    expect(holdings[0]).toEqual({
      symbol: 'MSFT',
      quantity: 5,
      purchasePrice: 250,
      purchaseDate: '2024-03-01T10:00:00+00:00',
      assetType: 'Stock',
    });
  });

  it('selects holding symbols from the store state', () => {
    const holding = createHolding('nvda');

    store.dispatch(addHolding(holding));

    const state = store.getState();
    const symbols = selectHoldingSymbols(state);

    expect(symbols).toEqual(['NVDA']);
  });
});
