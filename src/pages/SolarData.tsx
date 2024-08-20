import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSensorData } from '../features/sensorSlice';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { SensorData, SolarDataScreenNavigationProp } from '../types';
import { calculateBatteryPercentage } from '../utils';

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
    return <ActivityIndicator animating size="large" />;
  }

  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load sensor data.</Text>
        <Button mode="contained" onPress={() => dispatch(fetchSensorData())}>
          Retry
        </Button>
      </View>
    );
  }

  if (!sensorData) {
    return <Text style={styles.errorText}>No data available.</Text>;
  }

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

      <ScrollView contentContainerStyle={styles.scrollView}>
        {renderSensorData(sensorData)}
      </ScrollView>

      <Button mode="contained" onPress={() => navigation.goBack()}>
        Go Back
      </Button>
    </View>
  );
};

const renderSensorData = (sensorData: SensorData) => {
  const keys = Object.keys(sensorData) as Array<keyof SensorData>;
  return keys.map((key) => (
    <Text key={key as string}>
      {(key as string).replace(/([A-Z])/g, ' $1')}: {sensorData[key] ?? 'N/A'}
    </Text>
  ));
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  gaugeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  gaugeText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SolarDataPage;
