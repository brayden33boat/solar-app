// src/types.ts

import { StackNavigationProp } from '@react-navigation/stack';

// Navigation Types

export type RootStackParamList = {
    Home: undefined;
    SolarData: undefined;
    SolarGraph: undefined;
    Settings: undefined;
    Dashboard: undefined;
    ControllerSettings: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Home'
>;

export type ControllerSettingsScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'ControllerSettings'
>;

export type SolarDataScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SolarData'
>;

export type DashboardScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Dashboard'
>;

export type SolarGraphScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SolarGraph'
>;

// Sensor Data Types

export interface SensorData {
    batteryVoltage: number;
    batteryCurrent: number;
    solarPanel1Voltage: number;
    solarPanel1Current: number;
    solarPanel1Power: number;
    totalPowerOfSolarPanels: number;
    totalChargingPower: number;
    solarPanel2Voltage: number | null;
    solarPanel2Current: number | null;
    solarPanel2Power: number | null;
    controllerBatteryTemperature: number | null;
    chargingUpperLimitTemperature: number | null;
    chargingLowerLimitTemperature: number | null;
    heatSinkATemperature: number | null;
    heatSinkBTemperature: number | null;
    heatSinkCTemperature: number | null;
    ambientTemperature: number | null;
    overDischargeVoltage: number | null;
    dischargeLimitingVoltage: number | null;
    stopChargingCurrent: number | null;
    stopChargingCapacitySOC: number | null;
    immediateEqualizationChargeCommand: number | null;
    loadVoltage: number | null;
    loadCurrent: number | null;
    loadPower: number | null;
    batterySOC: number | null;
    gridAPhaseVoltage: number | null;
    gridAPhaseCurrent: number | null;
    gridFrequency: number | null;
    inverterPhaseAVoltage: number | null;
    inverterPhaseACurrent: number | null;
    inverterFrequency: number | null;
    pvChargingCurrent: number | null;
    chargeLimitVoltage: number | null;
    errors: string[];  // Assuming errors are returned as an array of strings
    [key: string]: any;  // Allows for additional properties that might be returned
}

export interface SensorState {
    data: SensorData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Solar Data Types

export interface SolarData {
    batteryVoltage: number;
    timestamp: string;
}

export interface SolarDataState {
    data: SolarData[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface SettingsState {
    batteryVoltage: number;
    batteryAhms: number;
    batteryType: string;
    shutOffTemp: number;
}

export interface TotalChargingPowerData {
    totalChargingPower: number;
    timestamp: string;
}

export interface TotalChargingPowerState {
    data: TotalChargingPowerData[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface CompanySettingsState {
    batteryChargerStatus: boolean;
    inverterSwitchStatus: boolean;
    chargeLimitVoltage: number;
}

