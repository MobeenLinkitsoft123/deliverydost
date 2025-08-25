module.exports = {
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  assets: ["./assets/fonts/"], // stays the same
  plugins: [
    ["module:react-native-dotenv"]
  ],
  dependencies: {
    'react-native-background-geolocation': {
      platforms: {
        android: null,
      },
    },
    'react-native-background-fetch': {
      platforms: {
        android: null,
      },
    },
  },
};