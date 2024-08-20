import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useAppSelector, useAppDispatch } from '../hooks';
import { calculateBatteryPercentage } from '../utils';
import { SolarData } from '../types';
import { groupBy, meanBy } from 'lodash';
import { fetchSolarData } from '../features/solarDataSlice';
import { fetchSensorData } from '../features/sensorSlice';

type SolarDataPageProps = {
    navigation: any;
};

const DashboardPage: React.FC<SolarDataPageProps> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const sensorData = useAppSelector((state) => state.sensor.data);
    const { batteryVoltage: batteryBankVoltage, batteryType } = useAppSelector((state) => state.settings);
    const solarData = useAppSelector((state) => state.solarData.data as SolarData[]);
    const solarDataStatus = useAppSelector((state) => state.solarData.status);
    const sensorDataStatus = useAppSelector((state) => state.sensor.status);

    useEffect(() => {
        if (solarDataStatus === 'idle') {
            dispatch(fetchSolarData());
        }
    }, [solarDataStatus, dispatch]);

    useEffect(() => {
        if (sensorDataStatus === 'idle') {
            dispatch(fetchSensorData());
        }
    }, [sensorDataStatus, dispatch]);

    if (solarDataStatus !== 'succeeded' || sensorDataStatus !== 'succeeded') {
        return <Text style={styles.errorText}>Loading data...</Text>;
    }

    if (!sensorData || !solarData.length) {
        return <Text style={styles.errorText}>No data available.</Text>;
    }

    const batteryPercentage = Math.round(calculateBatteryPercentage(sensorData.batteryVoltage, batteryBankVoltage, batteryType));

    // Filter the data to only include the last 12 hours
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

    const recentData = solarData.filter(data => new Date(data.timestamp) >= twelveHoursAgo);

    // Group and downsample the data by hour
    const groupedData = groupBy(recentData, (data) => {
        const date = new Date(data.timestamp);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
    });

    const downsampledData = Object.keys(groupedData).map((hour) => {
        const dataForHour = groupedData[hour];
        const avgBatteryVoltage = meanBy(dataForHour, 'batteryVoltage');
        return {
            timestamp: new Date(hour),
            batteryVoltage: avgBatteryVoltage !== undefined ? avgBatteryVoltage : 0,
        };
    }).sort((a, b) => a.timestamp - b.timestamp);  // Sort the data by timestamp

    // Ensure that all data points are valid numbers
    const filteredData = downsampledData.filter(data => !isNaN(data.batteryVoltage));

    // Prepare the data for the line chart
    const chartData = {
        labels: filteredData.map(data => data.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        datasets: [
            {
                data: filteredData.map(data => data.batteryVoltage),
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Optional: color of the line
                strokeWidth: 2, // Optional: thickness of the line
            },
        ],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <View style={styles.row}>
                <View style={styles.item}>
                    <Text style={styles.label}>Battery Voltage</Text>
                    <Text style={styles.value}>{sensorData.batteryVoltage} V</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>Total Charging Power</Text>
                    <Text style={styles.value}>{sensorData.totalChargingPower} W</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>Battery Percentage</Text>
                    <Text style={styles.value}>{batteryPercentage}%</Text>
                </View>
            </View>
            <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 40} // from react-native
                height={220}
                yAxisLabel=""
                yAxisSuffix="V"
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2, // Optional: defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726',
                    },
                    propsForLabels: {
                        rotation: 30, // Rotate labels by 30 degrees
                    },
                }}
                bezier // Optional: Smooth curve effect
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        margin: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10,
    },
    item: {
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        flex: 1,
        marginHorizontal: 5,
        height: 100,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    value: {
        fontSize: 18,
        color: '#000',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default DashboardPage;
