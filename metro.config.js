import { getDefaultConfig, mergeConfig } from '@react-native/metro-config';

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(new URL('.', import.meta.url).pathname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'tsx', 'ts', 'jsx', 'js'], // Ensure TS and TSX files are recognized
  },
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
};

export default mergeConfig(defaultConfig, config);
