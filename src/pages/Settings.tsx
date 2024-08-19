import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    setBatteryVoltage,
    setBatteryAhms,
    setBatteryType,
    setShutOffTemp,
} from '../features/settingsSlice';
import { RootState } from '../store';

const batteryTypes = ['Lithium', 'AGM'];

const Settings: React.FC = () => {
    const dispatch = useDispatch();
    const { batteryVoltage, batteryAhms, batteryType, shutOffTemp } = useSelector(
        (state: RootState) => state.settings
    );

    const [localBatteryVoltage, setLocalBatteryVoltage] = useState(batteryVoltage);
    const [localBatteryAhms, setLocalBatteryAhms] = useState(batteryAhms);
    const [localBatteryType, setLocalBatteryType] = useState(batteryType);
    const [localShutOffTemp, setLocalShutOffTemp] = useState(shutOffTemp);
    const [modalVisible, setModalVisible] = useState(false);

    // Auto-save whenever local state changes
    useEffect(() => {
        dispatch(setBatteryVoltage(localBatteryVoltage));
    }, [localBatteryVoltage]);

    useEffect(() => {
        dispatch(setBatteryAhms(localBatteryAhms));
    }, [localBatteryAhms]);

    useEffect(() => {
        dispatch(setBatteryType(localBatteryType));
    }, [localBatteryType]);

    useEffect(() => {
        dispatch(setShutOffTemp(localShutOffTemp));
    }, [localShutOffTemp]);

    const renderItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={styles.option}
            onPress={() => {
                setLocalBatteryType(item);
                setModalVisible(false);
            }}
        >
            <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Battery Voltage</Text>
            <TextInput
                style={styles.input}
                value={localBatteryVoltage}
                onChangeText={setLocalBatteryVoltage}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Battery Ahms</Text>
            <TextInput
                style={styles.input}
                value={localBatteryAhms}
                onChangeText={setLocalBatteryAhms}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Battery Type</Text>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setModalVisible(true)}
            >
                <Text>{localBatteryType || 'Select Battery Type'}</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={batteryTypes}
                            renderItem={renderItem}
                            keyExtractor={(item) => item}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={{ textAlign: 'center', marginTop: 10 }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Text style={styles.label}>Shut Off Temperature</Text>
            <TextInput
                style={styles.input}
                value={localShutOffTemp}
                onChangeText={setLocalShutOffTemp}
                keyboardType="numeric"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 4,
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    option: {
        paddingVertical: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    optionText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Settings;
