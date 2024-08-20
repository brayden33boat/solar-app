import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SensorData, SolarDataScreenNavigationProp } from '../types';

type SolarDataPageProps = {
  navigation: SolarDataScreenNavigationProp;
};

const Dashboard: React.FC<SolarDataPageProps> = ({ navigation }) => {
    return (
        <View>
            <Text>Dashboard</Text>
        </View>
    );

};

export default Dashboard;
