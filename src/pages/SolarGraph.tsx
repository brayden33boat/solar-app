import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSolarData } from '../features/solarDataSlice';
import { SolarData } from '../types';  // Import SolarData from types.ts
import { LineChart } from 'react-native-chart-kit';

const SolarGraphPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const solarData = useAppSelector((state) => state.solarData.data as SolarData[]);
    const status = useAppSelector((state) => state.solarData.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchSolarData());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (status === 'failed') {
        return <Text style={styles.errorText}>Failed to load solar data.</Text>;
    }

    // Function to downsample the data
    const downsampleData = (data: SolarData[], factor: number) => {
        return data.filter((_, index) => index % factor === 0);
    };

    // Adjust the factor to control how much you want to downsample
    const downsampledData = downsampleData(solarData, 5);
    const labels = downsampledData.map((data: SolarData) => new Date(data.timestamp).toLocaleDateString());
    const batteryVoltages = downsampledData.map((data: SolarData) => data.batteryVoltage);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weekly Solar Data</Text>
            <LineChart
                data={{
                    labels: labels,
                    datasets: [
                        {
                            data: batteryVoltages,
                            strokeWidth: 2,
                        },
                    ],
                }}
                width={Dimensions.get('window').width - 40}
                height={220}
                yAxisLabel=""
                yAxisSuffix="V"
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2,
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
                }}
                bezier={false}
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

export default SolarGraphPage;
