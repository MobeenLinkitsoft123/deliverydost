import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import colors from '../../styles/colors';
import { store } from '../../Store/store';
import { UpdateAppVersion, ADD_NOTIFICATION_LOG } from '../../Store/Action/AppFunctions';
import NavigationServices from '../../utils/NavigationServices';

const checkNotificationPermissionStatus = async (setToken?: (val: string) => void) => {
    try {
        let authStatus = await messaging().hasPermission();
        let isEnabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (!isEnabled) {
            const requestStatus = await messaging().requestPermission();
            let isEnabledTwice = requestStatus === messaging.AuthorizationStatus.AUTHORIZED || requestStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (!isEnabledTwice) {
                console.warn('Notification permission denied.');
                return false;
            }
            console.log('Notification permission granted after request.');
        }
        if (setToken) {
            await getFcmToken(setToken);
        }
        return true;
    } catch (error) {
        console.error('Error checking notification permission:', error);
        return false;
    }
};

const NotificationPermissionStatus = async () => {
    let hasPermission = false;

    if (Platform.OS === 'android' && Platform.Version < 34) {
        hasPermission = true; // No need to ask permission below Android 34
    } else {
        // Check for FCM notification permission
        let authStatus = await messaging().hasPermission();
        hasPermission =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!hasPermission) {
            // Request permission if not granted
            const requestStatus = await messaging().requestPermission();
            hasPermission =
                requestStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                requestStatus === messaging.AuthorizationStatus.PROVISIONAL;
        }
    }

    return hasPermission;
};


const getFcmToken = async (setToken?: (val: string) => void) => {
    try {
        const newFcmToken = await messaging().getToken();
        if (newFcmToken) {
            setToken?.(newFcmToken);
            // console.log('FCM Token obtained:', newFcmToken);
            return newFcmToken;
        } else {
            console.warn('FCM Token is null.');
        }
        return null;
    } catch (error) {
        console.error('FCM Token Generating Error:', error);
        return null;
    }
};

const passTokenToBackend = async (token?: string, isRefresh?: boolean) => {
    try {
        const { TokenId, UserDetail, LoginUser } = store.getState()?.AuthReducer as { TokenId: string[], UserDetail: any, LoginUser: boolean };
        if (UserDetail?.Id && TokenId && LoginUser) {
            // console.log('Updating App Version with:');
            await UpdateAppVersion(UserDetail?.Id, TokenId);
        } else {
            console.warn('User is not logged in or missing required details.');
        }
    } catch (error) {
        console.error('Error in passTokenToBackend:', error);
    }
};

const ProcessNotification = (remoteMessage: any) => {

    if (['Bidding Acceptance Process Complete'].includes(remoteMessage?.data?.Message || remoteMessage?.data?.message)) {
        EventRegister.emit('BidTimeOut', remoteMessage)
    }

    if (['bidAccepted'].includes(remoteMessage?.data?.type)) {
        EventRegister.emit('BibAcceptedOnWaitScreen', remoteMessage)
    }

    if (
        ['Hurry up! you only have 60 seconds',
            "You're all set — the job is confirmed.",
            'Your scheduled order bid has been accepted.',
            'Your scheduled order is started.',
            'Act now: Just 60 seconds to bid.',
            'Hurry! You have 120 seconds to accept this order.'
        ].includes(remoteMessage?.data?.message) ||
        ['New Order! Place your Bid', 'New Order! Accept Now'].includes(remoteMessage?.data?.title) ||
        ['neworder'].includes(remoteMessage?.data?.type)
    ) {
        EventRegister.emit('NewBidsOrderAccepted', remoteMessage);
    }

    if (['Please pick your order from vendor'].includes(remoteMessage?.data?.message)) {
        EventRegister.emit('OrderStatusUpdate', remoteMessage);
    }

    if (['scheduling'].includes(remoteMessage?.data?.type)) {
        EventRegister.emit('ScheduleStatus', remoteMessage);
    }

    if (['ordercancel'].includes(remoteMessage?.data?.type)) {
        EventRegister.emit('OrderCancel', remoteMessage);
    }

    if (['Your order has been cancelled.'].includes(remoteMessage?.data?.message)) {
        EventRegister.emit('OrderStatusUpdate', remoteMessage);
    }

    if (
        ['Criminal Background Document',
            'License',
            'License ',
            'Document Rejected',
            'license Image',
            'insurance Image',
            'Insurance'
        ].includes(remoteMessage?.data?.title) ||
        ['Document Rejected'].includes(remoteMessage?.data?.message)
    ) {
        EventRegister.emit('DocumentsVerification', remoteMessage);
    }

    if (
        ['Driver Approved', 'Rider Approved',
            'Congratulations',
            'Your account has been unblocked by the admin',
            'Your account has been blocked by the admin, please contact admin'
        ].includes(remoteMessage?.data?.message) ||
        ['Congratulations!'].includes(remoteMessage?.data?.title)
    ) {
        EventRegister.emit('UpdatedProfile', remoteMessage);
    }

    if (['bidrejt'].includes(remoteMessage?.data?.type)) {
        EventRegister.emit('ONBIDREJECTED', remoteMessage);
    }

    if (['userOrderCancel'].includes(remoteMessage?.data?.type)) {
        EventRegister.emit('OnBidRejectedByUser', JSON.stringify(remoteMessage?.data));
    }


};

async function ViewNotification(title?: string, body?: string, data = {}, sound?: string, channelId?: string) {
    await notifee.requestPermission();

    const channel = await notifee.createChannel({
        id: Platform.OS == 'ios' ? 'DMS0804' : channelId ? channelId : "DMS0804",
        name: Platform.OS == 'ios' ? 'DMS0804' : channelId ? channelId : 'DMS0804',
        importance: AndroidImportance.HIGH,
        sound: sound || 'default',
        lights: true,
        lightColor: colors.theme,
        vibrationPattern: [1000, 2000]
    });

    await notifee.displayNotification({
        title,
        body,
        data,
        android: {
            channelId: channel,
            importance: AndroidImportance.HIGH,
            sound: sound || 'default',
            color: colors.theme,
            vibrationPattern: [1000, 2000],
            pressAction: { id: 'default' },
            style: { type: AndroidStyle.BIGTEXT, text: body || 'Default notification text' },
            lights: [colors.theme, 300, 600],
            lightUpScreen: true,
            showTimestamp: true,
        },
        ios: {
            sound: sound || 'default',
        },
    });
}

const onMessageHandler = async (remoteMessage: any) => {

    if (remoteMessage) {
        const title = remoteMessage?.data?.title || remoteMessage?.notification?.title;
        const body = remoteMessage?.data?.message || remoteMessage?.notification?.body;
        const sound = remoteMessage?.data?.sound || remoteMessage?.notification?.sound || remoteMessage?.notification?.android?.sound;
        const channelId = remoteMessage?.data?.channelId || remoteMessage?.notification?.channelId || remoteMessage?.notification?.android?.channelId;

        if (title && body) {
            await ViewNotification(title, body, remoteMessage?.data, sound, channelId);
        }
        ProcessNotification(remoteMessage);
    }
};

const deleteTokenFCM = async () => {
    try {
        await messaging().deleteToken();
        // console.log('Token Deleted Successfully.');
    } catch (error) {
        console.error('Error deleting FCM token:', error);
    }
}

const onClickNotification = (remoteMessage: any) => {
    try {
        const screenName = remoteMessage?.data?.screenName || remoteMessage?.data?.data?.screenName;
        ADD_NOTIFICATION_LOG(remoteMessage);
        const currentRoute = NavigationServices?.getCurrentRoute();
        if (screenName?.trim()?.length > 0 && screenName && screenName !== 'undefined' && screenName !== 'null' && screenName !== null && screenName !== undefined) {
            if (currentRoute === screenName) {
            } else {
                NavigationServices.navigate(screenName);
            }
        } else {
            console.log('NOTIFICATION_MOVED====>', currentRoute, 4);
        }
    } catch (error) {
        console.log('error====>', error);
    }
};


export {
    checkNotificationPermissionStatus,
    passTokenToBackend,
    getFcmToken,
    onMessageHandler,
    ViewNotification,
    ProcessNotification,
    NotificationPermissionStatus,
    deleteTokenFCM,
    onClickNotification
};