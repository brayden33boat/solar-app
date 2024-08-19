import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {SettingsState} from '../types';


const initialState: SettingsState = {
    batteryVoltage: '',
    batteryAhms: '',
    batteryType: '',
    shutOffTemp: '',
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setBatteryVoltage(state, action: PayloadAction<string>) {
            state.batteryVoltage = action.payload;
        },
        setBatteryAhms(state, action: PayloadAction<string>) {
            state.batteryAhms = action.payload;
        },
        setBatteryType(state, action: PayloadAction<string>) {
            state.batteryType = action.payload;
        },
        setShutOffTemp(state, action: PayloadAction<string>) {
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
