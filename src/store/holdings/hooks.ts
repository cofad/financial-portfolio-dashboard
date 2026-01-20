import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { HoldingsState, HoldingsDispatch } from './store';

export const useHoldingsDispatch: () => HoldingsDispatch = useDispatch;
export const useHoldingsSelector: TypedUseSelectorHook<HoldingsState> = useSelector;
