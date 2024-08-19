import { getDefaultConfig, mergeConfig } from '@react-native/metro-config';

const defaultConfig = getDefaultConfig(new URL('.', import.meta.url).pathname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'tsx', 'ts', 'jsx', 'js'], // Add extensions
  },
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
};

export default mergeConfig(defaultConfig, config);
