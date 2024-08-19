import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {SettingsState} from '../types';


const initialState: SettingsState = {
    batteryVoltage: 12,
    batteryAhms: 100,
    batteryType: '',
    shutOffTemp: 0,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setBatteryVoltage(state, action: PayloadAction<number>) {
            state.batteryVoltage = action.payload;
        },
        setBatteryAhms(state, action: PayloadAction<number>) {
            state.batteryAhms = action.payload;
        },
        setBatteryType(state, action: PayloadAction<string>) {
            state.batteryType = action.payload;
        },
        setShutOffTemp(state, action: PayloadAction<number>) {
            state.shutOffTemp = action.payload;
        },
    },
});

export const {
    setBatteryVoltage,
    setBatteryAhms,
    setBatteryType,
    setShutOffTemp,
} = settingsSlice.actions;

export default settingsSlice.reducer;
