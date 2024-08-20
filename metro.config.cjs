const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
    resolver: {
        sourceExts: [...defaultConfig.resolver.sourceExts, 'tsx', 'ts', 'jsx', 'js'],
    },
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
        // If using Hermes, ensure this is configured
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};

module.exports = mergeConfig(defaultConfig, config);
