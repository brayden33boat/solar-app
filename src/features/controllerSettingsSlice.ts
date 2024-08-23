import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CompanySettingsState } from '../types';

const initialState: CompanySettingsState = {
    batteryChargerStatus: true,
    inverterSwitchStatus: true,
    chargeLimitVoltage: 14.4
};

const apiEndpoint = 'http://192.168.12.62:3000/solar-set-var/';

const companySettingsSlice = createSlice({
    name: 'companySettings',
    initialState,
    reducers: {
        setBatteryChargerStatus(state, action: PayloadAction<boolean>) {
            state.batteryChargerStatus = action.payload;
            console.log("setBatteryChargerStatus", action.payload);

            // Make API call using axios
            axios.post(apiEndpoint, { value: action.payload ? 1 : 0 })
                .then(response => {
                    console.log('API response:', response.data);
                })
                .catch(error => {
                    console.error('API error:', error);
                });
        },
        setInverterSwitchStatus(state, action: PayloadAction<boolean>) {
            state.inverterSwitchStatus = action.payload;
            console.log("setInverterSwitchStatus", action.payload);

            // Make API call using axios
            axios.post(apiEndpoint + "inverter_switch", { value: action.payload ? 1 : 0 })
                .then(response => {
                    console.log('API response:', response.data);
                })
                .catch(error => {
                    console.error('API error:', error);
                });
        },
        setChargeLimitVoltage(state, action: PayloadAction<number>) {
            state.chargeLimitVoltage = action.payload;
            
            const newVoltage:number = Number(action.payload)*10;

            console.log("setChargeLimitVoltage", newVoltage);

            if (newVoltage>300){
                throw new Error("Voltage too high, i'm to scared")
            }

            // Make API call using axios
            axios.post(apiEndpoint + "charge_limit_voltage", { value: newVoltage })
                .then(response => {
                    console.log('API response:', response.data);
                })
                .catch(error => {
                    console.error('API error:', error);
                });
        },
    },
});

export const {
    setChargeLimitVoltage,
    setBatteryChargerStatus,
    setInverterSwitchStatus,
} = companySettingsSlice.actions;

export default companySettingsSlice.reducer;
