import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSensorData } from '../features/sensorSlice';
import { SensorData, SolarDataScreenNavigationProp } from '../types';
import { Circle } from 'react-native-svg-circular-progress';

type SolarDataPageProps = {
  navigation: SolarDataScreenNavigationProp;
};

const SolarDataPage: React.FC<SolarDataPageProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const sensorData = useAppSelector((state) => state.sensor.data);
  const status = useAppSelector((state) => state.sensor.status);

  const { batteryVoltage: batteryBankVoltage, batteryType } = useAppSelector((state) => state.settings);
  const maxVoltage = batteryType === '1' ? 28.8 : 25.6; // Example max voltages for Lithium and AGM batteries

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

  // Calculate battery percentage
  const batteryPercentage = calculateBatteryPercentage(sensorData.batteryVoltage, batteryBankVoltage, batteryType);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data</Text>
      <View style={styles.gaugeContainer}>
        <Circle
          size={200}
          progress={batteryPercentage / 100}
          strokeWidth={15}
          color="#00e0ff"
          backgroundColor="#3d5875"
        >
          {() => (
            <Text style={styles.gaugeText}>{batteryPercentage.toFixed(2)}%</Text>
          )}
        </Circle>
      </View>

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

const calculateBatteryPercentage = (voltage: number, batteryBankVoltage: number, batteryType: string) => {
  let minVoltage, maxVoltage;

  if (batteryType === "1") { // Lithium
    maxVoltage = batteryBankVoltage * (28.8 / 24);
    minVoltage = batteryBankVoltage * (21.0 / 24);
  } else if (batteryType === "2") { // AGM
    maxVoltage = batteryBankVoltage * (25.6 / 24);
    minVoltage = batteryBankVoltage * (21.0 / 24);
  } else {
    return 0;
  }

  const percentage = ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100;
  return Math.max(0, Math.min(100, percentage));
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
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gaugeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SolarDataPage;
