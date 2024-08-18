// src/types.ts

import { StackNavigationProp } from '@react-navigation/stack';

// Navigation Types

export type RootStackParamList = {
    Home: undefined;
    SolarData: undefined;
    SolarGraph: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Home'
>;

export type SolarDataScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'SolarData'
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
