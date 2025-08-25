import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { Text, TextInput } from "react-native";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/Store/store';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from './src/Screens/SplashScreen/SplashScreen';
import { setNotificationsHandler } from './src/services/NotificationServices/notificationServices';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('setBackgroundMessageHandler==>', remoteMessage)
});
setNotificationsHandler();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.maxFontSizeMultiplier = 1; // the maximum amount the font size will scale.
TextInput.defaultProps = Text.defaultProps || {};
TextInput.defaultProps.maxFontSizeMultiplier = 1;
const ReduxApp = () => (
    <Provider store={store}>
        <PersistGate loading={<SplashScreen />} persistor={persistor} onBeforeLift={() => { }}>
            <App />
        </PersistGate>
    </Provider>
);
AppRegistry.registerComponent(appName, () => ReduxApp);