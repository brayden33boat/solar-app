// src/hooks.ts

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use these hooks throughout your app instead of plain `useDispatch` and `useSelector`
// This ensures that the correct types are inferred from the store

// Custom hook to use the dispatch function with the correct type
export const useAppDispatch: () => AppDispatch = useDispatch;

// Custom hook to use the selector function with the correct type
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
