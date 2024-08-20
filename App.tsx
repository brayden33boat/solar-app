// src/App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, View, Text } from 'react-native';
import SolarDataPage from './src/pages/SolarData';
import SolarGraphPage from './src/pages/SolarGraph';
import { HomeScreenNavigationProp } from './src/types';
import Settings from './src/pages/Settings';
import DashboardPage from './src/pages/Dashboard';

const Stack = createStackNavigator();

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Welcome to the Solar App</Text>
    <Button
      title="Go to Solar Data"
      onPress={() => navigation.navigate('SolarData')}
    />
    <Button
      title="Go to Solar Graph"
      onPress={() => navigation.navigate('SolarGraph')}
    />
    <Button
      title="Go to Dashboard"
      onPress={() => navigation.navigate('Dashboard')}
    />
    <Button
      title="Go to Settings"
      onPress={() => navigation.navigate('Settings')}
    />
  </View>
);

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SolarData" component={SolarDataPage} />
        <Stack.Screen name="SolarGraph" component={SolarGraphPage} />
        <Stack.Screen name="Dashboard" component={DashboardPage} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
