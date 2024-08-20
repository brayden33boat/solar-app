// src/store.ts

import { configureStore } from '@reduxjs/toolkit';
import sensorReducer from './features/sensorSlice';
import solarDataReducer from './features/solarDataSlice';
import settingsReducer from './features/settingsSlice';
import weeklyChargePowerReducer from './features/weeklyChargingPowerSlice';

export const store = configureStore({
  reducer: {
    sensor: sensorReducer,
    solarData: solarDataReducer,
    settings: settingsReducer,
    weeklyChargePower: weeklyChargePowerReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
