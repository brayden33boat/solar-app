import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useAppSelector, useAppDispatch } from '../hooks';
import { calculateBatteryPercentage } from '../utils';
import { SolarData, TotalChargingPowerData } from '../types';
import { groupBy, meanBy } from 'lodash';
import { fetchSolarData } from '../features/solarDataSlice';
import { fetchSensorData } from '../features/sensorSlice';
import { fetchTotalChargingPower } from '../features/weeklyChargingPowerSlice';

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
    const weeklyChargingPowerStatus = useAppSelector((state) => state.weeklyChargePower.status);
    const weeklyChargingPower = useAppSelector((state) => state.weeklyChargePower.data as TotalChargingPowerData[]);

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

    useEffect(() => {
        if (weeklyChargingPowerStatus === 'idle') {
            dispatch(fetchTotalChargingPower());
        }
    }, [weeklyChargingPowerStatus, dispatch]);

    if (solarDataStatus !== 'succeeded' || sensorDataStatus !== 'succeeded' || weeklyChargingPowerStatus !== 'succeeded') {
        return <Text style={styles.errorText}>Loading data...</Text>;
    }

    if (!sensorData || !solarData.length) {
        return <Text style={styles.errorText}>No data available.</Text>;
    }

    const batteryPercentage = Math.round(calculateBatteryPercentage(sensorData.batteryVoltage, batteryBankVoltage, batteryType));

    // Filter the solar data to only include the last 12 hours
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

    const recentSolarData = solarData.filter(data => new Date(data.timestamp) >= twelveHoursAgo);

    // Group and downsample the solar data by hour
    const groupedSolarData = groupBy(recentSolarData, (data) => {
        const date = new Date(data.timestamp);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
    });

    const downsampledSolarData = Object.keys(groupedSolarData).map((hour) => {
        const dataForHour = groupedSolarData[hour];
        const avgBatteryVoltage = meanBy(dataForHour, 'batteryVoltage');
        return {
            timestamp: new Date(hour),
            batteryVoltage: avgBatteryVoltage !== undefined ? avgBatteryVoltage : 0,
        };
    }).sort((a: any, b: any) => a.timestamp - b.timestamp);  // Sort the data by timestamp

    // Filter the weekly charging power data to only include the last 12 hours
    const recentWeeklyChargingPower = weeklyChargingPower.filter(data => new Date(data.timestamp) >= twelveHoursAgo);

    // Group and downsample the weekly charging power data by hour
    const groupedWeeklyChargingPower = groupBy(recentWeeklyChargingPower, (data) => {
        const date = new Date(data.timestamp);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
    });

    const downsampledWeeklyChargingPower = Object.keys(groupedWeeklyChargingPower).map((hour) => {
        const dataForHour = groupedWeeklyChargingPower[hour];
        const avgChargingPower = meanBy(dataForHour, 'totalChargingPower');
        return {
            timestamp: new Date(hour),
            totalChargingPower: avgChargingPower !== undefined ? avgChargingPower : 0,
        };
    }).sort((a: any, b: any) => a.timestamp - b.timestamp);  // Sort the data by timestamp

    // Prepare the solar data for the line chart
    const solarChartData = {
        labels: downsampledSolarData.map(data => data.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        datasets: [
            {
                data: downsampledSolarData.map(data => data.batteryVoltage),
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Optional: color of the line
                strokeWidth: 2, // Optional: thickness of the line
            },
        ],
    };

    // Prepare the weekly charging power data for the line chart
    const weeklyChargingPowerChartData = {
        labels: downsampledWeeklyChargingPower.map(data => data.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        datasets: [
            {
                data: downsampledWeeklyChargingPower.map(data => data.totalChargingPower),
                color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Optional: color of the line
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
                    <Text style={styles.value}>{batteryPercentage.toFixed(2)}%</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title2}>Voltage</Text>
                <LineChart
                    data={solarChartData}
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
                <Text style={styles.title2}>Charging Power</Text>
                <LineChart
                    data={weeklyChargingPowerChartData}
                    width={Dimensions.get('window').width - 40} // from react-native
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix="W"
                    chartConfig={{
                        backgroundColor: '#007ACC',
                        backgroundGradientFrom: '#00A1FF',
                        backgroundGradientTo: '#00CCFF',
                        decimalPlaces: 2, // Optional: defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#00CCFF',
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
            </ScrollView>
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
    title2: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 0,
        color: '#333',
        textAlign: 'left',
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
    scrollView: {
        paddingVertical: 10,
        paddingBottom: 40
    },
});

export default DashboardPage;
