import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Switch } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSensorData } from '../features/sensorSlice';
import { SensorData, ControllerSettingsScreenNavigationProp } from '../types';
import { setBatteryChargerStatus, setInverterSwitchStatus} from '../features/companySettingsSlice';

type ControllerSettingsPageProps = {
    navigation: ControllerSettingsScreenNavigationProp;
};

const ControllerSettingsPage: React.FC<ControllerSettingsPageProps> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const sensorData: SensorData | null = useAppSelector((state) => state.sensor.data);
    const status = useAppSelector((state) => state.sensor.status);

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

    const handleSettingChange = (key: keyof typeof sensorData, value: string | number | boolean) => {
        // dispatch(updateSettings({ key, value }));

        console.log("key", key, value);
        
        switch (key){
            case 'batteryChargerStatus':
                console.log("Should dispatch")
                dispatch(setBatteryChargerStatus(!!value));
                console.log("Done dispatch")
                break;
            case 'inverterSwitchStatus':
                dispatch(setInverterSwitchStatus(!!value));
                break;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Controller Settings</Text>

            <ScrollView contentContainerStyle={styles.scrollView}>
                {/* {Object.keys(sensorData).map((key) => (
                    <View key={key} style={styles.settingRow}>
                        <Text style={styles.settingLabel}>
                            {key.replace(/([A-Z])/g, ' $1')}:
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={String(sensorData[key])}
                            onChangeText={(value) => handleSettingChange(key as keyof typeof sensorData, value)}
                        />
                    </View>
                ))} */}
                {/* Toggle for Battery Charger */}
                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Battery Charger:</Text>
                    <Switch
                        value={!!sensorData.batteryChargeStatus}
                        onValueChange={(value) => handleSettingChange('batteryChargerStatus', value)}
                    />
                </View>

                {/* Toggle for Inverter Switch */}
                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Inverter Switch:</Text>
                    <Switch
                        value={!!sensorData.inverterSwitchStatus}
                        onValueChange={(value) => handleSettingChange('inverterSwitchStatus', value)}
                    />
                </View>
            </ScrollView>

            <Button mode="contained" onPress={() => navigation.goBack()}>
                Save & Go Back
            </Button>
        </View>
    );
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
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    settingLabel: {
        flex: 1,
        fontSize: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        borderRadius: 4,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default ControllerSettingsPage;
