import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { SolarData, SolarDataState } from '../types';

const initialState: SolarDataState = {
  data: [],
  status: 'idle',
  error: null,
};

// Async thunk for fetching solar data
export const fetchSolarData = createAsyncThunk('solarData/fetchSolarData', async () => {
  const response = await axios.get('http://192.168.12.62:3000/solar-data-week');
  
  // Validate, filter, and map the data to convert "battery_voltage" to "batteryVoltage"
  const validData = response.data
    .filter((data: any) => {
      const isValidVoltage = typeof data.battery_voltage === 'number' && Number.isFinite(data.battery_voltage);
      const isValidTimestamp = !isNaN(new Date(data.timestamp).getTime());
      return isValidVoltage && isValidTimestamp;
    })
    .map((data: any) => ({
      ...data,
      batteryVoltage: parseFloat(data.battery_voltage.toFixed(2)), // Round to 2 decimal places
      timestamp: new Date(data.timestamp).toISOString(), // Ensure the timestamp is in ISO format
    }));

  // Log the processed data
  console.log("Processed Solar Data:", validData);

  return validData;
});

const solarDataSlice = createSlice({
  name: 'solarData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolarData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSolarData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Further validate and clean the data in case any NaN or Infinity slipped through
        state.data = action.payload.map((data: SolarData) => ({
          ...data,
          batteryVoltage: Number.isFinite(data.batteryVoltage) ? data.batteryVoltage : 0,
          timestamp: isNaN(new Date(data.timestamp).getTime()) ? new Date().toISOString() : data.timestamp,
        }));

        // Log the final state data to check for any anomalies
        console.log("Final Solar Data in State:", state.data);
      })
      .addCase(fetchSolarData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default solarDataSlice.reducer;
