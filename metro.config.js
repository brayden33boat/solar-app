const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'tsx', 'ts', 'jsx', 'js'], // Add extensions
  },
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  entryFile: 'index.tsx', // Ensure index.tsx is recognized as the entry file
};

module.exports = mergeConfig(defaultConfig, config);
