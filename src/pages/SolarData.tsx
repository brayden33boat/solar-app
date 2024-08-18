// src/pages/SolarData.tsx

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSensorData } from '../features/sensorSlice';
import { SensorData, SolarDataScreenNavigationProp } from '../types';

type SolarDataPageProps = {
  navigation: SolarDataScreenNavigationProp;
};

const SolarDataPage: React.FC<SolarDataPageProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const sensorData = useAppSelector((state) => state.sensor.data);
  const status = useAppSelector((state) => state.sensor.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSensorData());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load sensor data.</Text>
        <Button title="Retry" onPress={() => dispatch(fetchSensorData())} />
      </View>
    );
  }

  if (!sensorData) {
    return <Text style={styles.errorText}>No data available.</Text>;
  }

//   return (
//     <>
//         <Text>{JSON.stringify(sensorData)}</Text>
//     </>
//   );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data</Text>
      <Text>Battery Voltage: {sensorData.batteryVoltage} V</Text>
      <Text>Battery Current: {sensorData.batteryCurrent} A</Text>
      <Text>Solar Panel 1 Voltage: {sensorData.solarPanel1Voltage} V</Text>
      <Text>Solar Panel 1 Current: {sensorData.solarPanel1Current} A</Text>
      <Text>Solar Panel 1 Power: {sensorData.solarPanel1Power} W</Text>
      <Text>Total Power of Solar Panels: {sensorData.totalPowerOfSolarPanels} W</Text>
      <Text>Total Charging Power: {sensorData.totalChargingPower} W</Text>
      <Text>Solar Panel 2 Voltage: {sensorData.solarPanel2Voltage ?? 'N/A'} V</Text>
      <Text>Solar Panel 2 Current: {sensorData.solarPanel2Current ?? 'N/A'} A</Text>
      <Text>Solar Panel 2 Power: {sensorData.solarPanel2Power ?? 'N/A'} W</Text>

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SolarDataPage;
