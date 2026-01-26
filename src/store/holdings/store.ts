import { configureStore, combineReducers, createSelector } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import holdingsReducer, { type Holding } from './slice';
import { createPersistStorage } from './persistStorage';

const storage = createPersistStorage();

const rootReducer = combineReducers({
  holdings: holdingsReducer,
});

const persistConfig = {
  key: 'holdings',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type HoldingsState = ReturnType<typeof store.getState>;
export type HoldingsDispatch = typeof store.dispatch;

export function selectHoldings(state: HoldingsState): Holding[] {
  return state.holdings.holdings;
}

export const selectHoldingSymbols = createSelector([selectHoldings], (holdings) =>
  holdings.map((holding) => holding.symbol),
);
