module.exports = {
  presets: [
    'module:@react-native/babel-preset', // React Native preset
    '@babel/preset-typescript',          // TypeScript support
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // Adjust the root directory if your project structure differs
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          "@components": "./src/components",
          "@assets": "./src/assets",
          // Add more aliases as needed
        },
      },
    ],
  ],
};
