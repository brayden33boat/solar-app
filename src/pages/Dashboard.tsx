import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SensorData, SolarData, SolarDataScreenNavigationProp } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { calculateBatteryPercentage } from '../utils';
import {styles} from '../styles';

type SolarDataPageProps = {
    navigation: SolarDataScreenNavigationProp;
};

const DashboardPage: React.FC<SolarDataPageProps> = ({ navigation }) => {
    const sensorData = useAppSelector((state) => state.sensor.data);
    const status = useAppSelector((state) => state.sensor.status);
    const { batteryVoltage: batteryBankVoltage, batteryType } = useAppSelector((state) => state.settings);
    const solarData = useAppSelector((state) => state.solarData.data as SolarData[]);


    if (!sensorData) {
        return <Text style={styles.errorText}>No data available.</Text>;
    }

    const batteryPercentage = calculateBatteryPercentage(sensorData.batteryVoltage, batteryBankVoltage, batteryType);

    return (
        <View>
            <Text>Dashboard</Text>
        </View>
    );

};

export default DashboardPage;
