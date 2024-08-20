import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { TotalChargingPowerData, TotalChargingPowerState } from '../types';

const initialState: TotalChargingPowerState = {
  data: [],
  status: 'idle',
  error: null,
};

// Async thunk for fetching total charging power data
export const fetchTotalChargingPower = createAsyncThunk('totalChargingPower/fetchTotalChargingPower', async () => {
  const response = await axios.get('http://192.168.12.62:3000/solar-data-week/total_charging_power');
  
  // Validate, filter, and map the data to match the new type
  const validData = response.data
    .filter((data: any) => {
      const isValidPower = typeof data.total_charging_power === 'number' && Number.isFinite(data.total_charging_power);
      const isValidTimestamp = !isNaN(new Date(data.timestamp).getTime());
      return isValidPower && isValidTimestamp;
    })
    .map((data: any) => ({
      totalChargingPower: parseFloat(data.total_charging_power.toFixed(2)), // Round to 2 decimal places
      timestamp: new Date(data.timestamp).toISOString(), // Ensure the timestamp is in ISO format
    }));

  // Log the processed data
  console.log("Processed Total Charging Power Data:", validData);

  return validData;
});

const totalChargingPowerSlice = createSlice({
  name: 'totalChargingPower',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalChargingPower.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTotalChargingPower.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Further validate and clean the data in case any NaN or Infinity slipped through
        state.data = action.payload.map((data: TotalChargingPowerData) => ({
          totalChargingPower: Number.isFinite(data.totalChargingPower) ? data.totalChargingPower : 0,
          timestamp: isNaN(new Date(data.timestamp).getTime()) ? new Date().toISOString() : data.timestamp,
        }));

        // Log the final state data to check for any anomalies
        console.log("Final Total Charging Power Data in State:", state.data);
      })
      .addCase(fetchTotalChargingPower.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default totalChargingPowerSlice.reducer;
