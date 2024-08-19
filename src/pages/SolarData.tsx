import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSensorData } from '../features/sensorSlice';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { SensorData, SolarDataScreenNavigationProp } from '../types';

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
  const progress = batteryPercentage / 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data</Text>

      <View style={styles.gaugeContainer}>
        <Svg height="200" width="200" viewBox="0 0 100 100">
          <SvgCircle
            cx="50"
            cy="50"
            r={radius}
            stroke="blue"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={(1 - progress) * circumference}
          />
        </Svg>
        <Text style={styles.gaugeText}>{batteryPercentage.toFixed(2)}%</Text>
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

  if (batteryType === "Lithium") { // Lithium
    maxVoltage = batteryBankVoltage * (28.8 / 24);
    minVoltage = batteryBankVoltage * (21.0 / 24);
  } else if (batteryType === "AGM") { // AGM
    maxVoltage = batteryBankVoltage * (25.6 / 24);
    minVoltage = batteryBankVoltage * (21.0 / 24);
  } else {
    console.log('Unknown battery type:', batteryType);
    return 0;
  }

  console.log('Voltage:', voltage);
  console.log('Min Voltage:', minVoltage);
  console.log('Max Voltage:', maxVoltage);

  const percentage = ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100;
  console.log('Calculated Percentage:', percentage);

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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Ensure the Text is positioned relative to the Svg
  },
  gaugeText: {
    position: 'absolute',
    top: '55%',
    left: '55%',
    transform: [{ translateX: -50 }, { translateY: -50 }], // Center the text
    textAlign: 'center',
    fontSize: 20, // Adjust the font size as needed
    fontWeight: 'bold', // Optional: Makes the text bold
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SolarDataPage;
