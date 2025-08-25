
import BackgroundGeolocation, { Subscription } from "react-native-background-geolocation";

const BgLocationServices = (getLocation) => {
    const onLocation: Subscription = BackgroundGeolocation.onLocation((userLocation) => {
        getLocation && getLocation(userLocation?.coords)
    });
    BackgroundGeolocation.ready({
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        autoSync: true,
        autoSyncThreshold: 2,
        batchSync: true,
        distanceFilter: 50,
        stopTimeout: 60,
        debug: false,
        isMoving: true,
        logLevel: BackgroundGeolocation['LOG_LEVEL_VERBOSE'],
        stopOnTerminate: false,
        preventSuspend: false,
        startOnBoot: true,
        method: 'POST',
        batchSync: true,
        autoSync: true,
        autoSyncThreshold: 20,
        headers: { Authorization: '' },
        enableTimestampMeta: true,
        enabledHeadless: true,
        locationAuthorizationRequest: 'Always',
        backgroundPermissionRationale: {
            title: "Allow to access to this device's location in the background?",
            message:
                'Required location',
            positiveAction: 'Change to "{backgroundPermissionOptionLabel}"',
            negativeAction: 'Cancel',
        },
        notification: {
            title: "Foodosti is using background location.",
            text: "background tracking engaged"
        },
        reset: false,
        disableLocationAuthorizationAlert: false,
        enableHeadless: true,
        foregroundService: true,
        showsBackgroundLocationIndicator: true,
        disableStopDetection: true,
        disableMotionActivityUpdates: true,
        heartbeatInterval: 60
    }).then(async (state) => {
        // console.log("- BackgroundGeolocation is configured and ready: ", state.enabled, UserEnableLocation);
        if (state?.enabled == false) {
            startBgLocation()
        }
    });
}

const startBgLocation = async () => {
    // const trackingStatus = await requestTrackingPermission();
    // if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    BackgroundGeolocation.start();
    //     dispatch && dispatch(isBgLocationEnable(true))
    //     return 0
    // }
    // if (trackingStatus == 'denied' || 'restricted') {
    //     Alert.alert('Info', 'Please allow app tracking transparency open setting > Privacy and security > Tracking', [
    //         { text: 'OK', onPress: () => console.log('OK Pressed') },
    //     ]);
    // }

}

const stopBgLocation = () => {
    BackgroundGeolocation.stop();
}


export {
    BgLocationServices,
    startBgLocation,
    stopBgLocation,
}
