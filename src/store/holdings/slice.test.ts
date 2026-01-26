import { describe, expect, it } from 'vitest';

import reducer, { addHolding, removeHolding, type Holding } from './slice';
import { convertToTimeString } from '@utils/date';

function createHolding(overrides?: Partial<Holding>): Holding {
  return {
    symbol: 'AAPL',
    quantity: 10,
    purchasePrice: 123.45,
    purchaseDate: convertToTimeString('2024-02-28T12:00:00+00:00'),
    assetType: 'Stock',
    ...overrides,
  };
}

describe('holdings slice', () => {
  it('adds holdings with normalized symbols', () => {
    const initialState = reducer(undefined, { type: 'init' });
    const nextState = reducer(initialState, addHolding(createHolding({ symbol: ' aapl ' })));

    expect(nextState.holdings).toHaveLength(1);
    expect(nextState.holdings[0]).toEqual({
      symbol: 'AAPL',
      quantity: 10,
      purchasePrice: 123.45,
      purchaseDate: '2024-02-28T12:00:00+00:00',
      assetType: 'Stock',
    });
  });

  it('ignores duplicate symbols after normalization', () => {
    const initialState = reducer(undefined, { type: 'init' });
    const withHolding = reducer(initialState, addHolding(createHolding({ symbol: 'aapl' })));
    const duplicate = reducer(withHolding, addHolding(createHolding({ symbol: 'AAPL' })));

    expect(duplicate.holdings).toHaveLength(1);
  });

  it('removes holdings by normalized symbols', () => {
    const initialState = reducer(undefined, { type: 'init' });
    const withHolding = reducer(initialState, addHolding(createHolding({ symbol: ' aapl ' })));

    expect(withHolding.holdings).toHaveLength(1);

    const nextState = reducer(withHolding, removeHolding('AAPL'));

    expect(nextState.holdings).toHaveLength(0);
  });
});
