// src/features/sensorSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { SensorState, SensorData } from '../types';

const initialState: SensorState = {
    data: null,
    status: 'idle',
    error: null,
};

const mapSensorData = (data: any): SensorData => ({
    batteryVoltage: data["battery_voltage"],
    batteryCurrent: data["battery_current"],
    solarPanel1Voltage: data["solar_panel_1_voltage"],
    solarPanel1Current: data["solar_panel_1_current"],
    solarPanel1Power: data["solar_panel_1_power"],
    totalPowerOfSolarPanels: data["total_power_of_solar_panels"],
    totalChargingPower: data["total_charging_power"],
    solarPanel2Voltage: data["solar_panel_2_voltage"],
    solarPanel2Current: data["solar_panel_2_current"],
    solarPanel2Power: data["solar_panel_2_power"],
    controllerBatteryTemperature: data["controller_battery_temperature"],
    chargingUpperLimitTemperature: data["charging_upper_limit_temperature"],
    chargingLowerLimitTemperature: data["charging_lower_limit_temperature"],
    heatSinkATemperature: data["heat_sink_a_temperature"],
    heatSinkBTemperature: data["heat_sink_b_temperature"],
    heatSinkCTemperature: data["heat_sink_c_temperature"],
    ambientTemperature: data["ambient_temperature"],
    overDischargeVoltage: data["over_discharge_voltage"],
    dischargeLimitingVoltage: data["discharge_limiting_voltage"],
    stopChargingCurrent: data["stop_charging_current"],
    stopChargingCapacitySOC: data["stop_charging_capacity"],
    immediateEqualizationChargeCommand: data["immediate_equalization_charge_command"],
    errors: data["errors"] || [], // Handle errors array
});



// Async thunk for fetching sensor data
export const fetchSensorData = createAsyncThunk('sensor/fetchSensorData', async () => {
    const response = await axios.get('http://192.168.12.62:3000/solar-data');
    const mappedData = mapSensorData(response.data);
    return mappedData;
});

const sensorSlice = createSlice({
    name: 'sensor',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSensorData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSensorData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload; // Store the entire object directly
            })
            .addCase(fetchSensorData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default sensorSlice.reducer;
