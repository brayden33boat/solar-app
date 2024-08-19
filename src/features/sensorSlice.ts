import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { SensorState, SensorData } from '../types';
import { io } from 'socket.io-client';

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
    loadVoltage: data["load_voltage"], // New field
    loadCurrent: data["load_current"], // New field
    loadPower: data["load_power"], // New field
    batterySOC: data["battery_soc"], // New field
    gridAPhaseVoltage: data["grid_a_phase_voltage"], // New field
    gridAPhaseCurrent: data["grid_a_phase_current"], // New field
    gridFrequency: data["grid_frequency"], // New field
    inverterPhaseAVoltage: data["inverter_phase_a_voltage"], // New field
    inverterPhaseACurrent: data["inverter_phase_a_current"], // New field
    inverterFrequency: data["inverter_frequency"], // New field
    pvChargingCurrent: data["pv_charging_current"], // New field
    batteryChargeStatus: data["battery_charge_status"],
    inverterSwitchStatus: data["inverter_switch_status"],
    errors: data["errors"] || [], // Handle errors array
});


// Async thunk for fetching sensor data
export const fetchSensorData = createAsyncThunk('sensor/fetchSensorData', async () => {
    const response = await axios.get('http://192.168.12.62:3000/solar-data');
    const mappedData = mapSensorData(response.data);
    console.log("mappedData", mappedData);
    return mappedData;
});

const sensorSlice = createSlice({
    name: 'sensor',
    initialState,
    reducers: {
        updateSensorData: (state, action: PayloadAction<SensorData>) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSensorData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSensorData.fulfilled, (state, action: PayloadAction<SensorData>) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchSensorData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const { updateSensorData } = sensorSlice.actions;

export default sensorSlice.reducer;

// Setting up Socket.IO client and dispatching updates to the store
export const setupSocketIO = (dispatch: any) => {
    try {
        const socket = io('ws://192.168.12.62:3000', {
            path: '/ws',
            transports: ['websocket', 'polling'],
        });        

        socket.on('connect', () => {
            console.log('Socket.IO connected');
        });

        socket.on('connect_error', (error:any) => {
            console.error('Connection error occurred at:', new Date().toISOString());
            console.error('Connection error message:', error.message);

            // Log additional details from the error object
            if (error.type) {
                console.error('Error type:', error.type);
            }

            if (error.description) {
                console.error('Error description:', error.description);
            }

            // Log the entire error object for full details
            console.error('Full error object:', error);

            // You can also log the current connection state if needed
            console.error('Current connection state:', socket.connected ? 'Connected' : 'Disconnected');
        });


        socket.on('reconnect_attempt', (attemptNumber) => {
            console.warn(`Reconnection attempt #${attemptNumber}`);
        });

        socket.on('reconnect_failed', () => {
            console.error('Reconnection to Socket.IO server failed.');
        });

        socket.on('solarDataUpdate', (data: any) => {
            console.log("Data Emitted [solarDataUpdate]:", data);
            try {
                const mappedData = mapSensorData(data);
                dispatch(updateSensorData(mappedData));
            } catch (error: any) {
                console.error('Error processing solar data update:', error.message);
            }
        });

        socket.on('disconnect', (reason) => {
            console.warn(`Socket.IO disconnected: ${reason}`);
            if (reason === 'io server disconnect') {
                console.warn('Server disconnected the socket. Attempting to reconnect...');
                socket.connect(); // Attempt to reconnect automatically
            } else {
                console.warn('Client-side disconnect.');
            }
        });

    } catch (error: any) {
        console.error('Failed to set up Socket.IO:', error.message);
    }
};
