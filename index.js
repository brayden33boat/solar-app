import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './src/store';  // Assuming store.js is in the same directory level
import { name as appName } from './app.json';
import { setupSocketIO } from './src/features/sensorSlice';

// Set up the Socket.IO listener
setupSocketIO(store.dispatch);

const Main = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Main);
