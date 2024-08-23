import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanySettingsState } from '../types';

const initialState: CompanySettingsState = {
    batteryChargerStatus: true,
    inverterSwitchStatus: true,
};

const companySettingsSlice = createSlice({
    name: 'companySettings',
    initialState,
    reducers: {
        setBatteryChargerStatus(state, action: PayloadAction<boolean>) {
            state.batteryChargerStatus = action.payload;
            console.log("setBatteryChargerStatus", action.payload);
        },
        setInverterSwitchStatus(state, action: PayloadAction<boolean>) {
            state.inverterSwitchStatus = action.payload;
            console.log("setInverterSwitchStatus", action.payload);
        },
    },
});

export const {
    setBatteryChargerStatus,
    setInverterSwitchStatus,
} = companySettingsSlice.actions;

export default companySettingsSlice.reducer;
