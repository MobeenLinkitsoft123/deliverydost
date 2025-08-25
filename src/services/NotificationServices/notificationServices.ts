import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

import { passTokenToBackend, onMessageHandler, getFcmToken, checkNotificationPermissionStatus, ProcessNotification, onClickNotification } from './notificationHelper';

export const setNotificationsHandler = async () => {
    try {
        const hasPermission = await checkNotificationPermissionStatus();
        if (!hasPermission) {
            console.warn('Notification permission not granted.');
        }

        try {
            await messaging().requestPermission();
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }

        try {
            const token = await getFcmToken();
            if (token) {
                // console.log('FCM Token:', token);
                await passTokenToBackend(token);
            } else {
                console.warn('FCM Token is null.');
            }
        } catch (error) {
            console.error('Error fetching FCM token:', error);
        }

        const tokenRefreshUnsubscribe = messaging().onTokenRefresh(async (newToken) => {
            // console.log('FCM Token refreshed:', newToken);
            await passTokenToBackend(newToken, true);
        });

        const messageUnsubscribeOpenedApp = messaging().onNotificationOpenedApp(async (remoteMessage) => {
            if (remoteMessage) {
                ProcessNotification(remoteMessage)
                onClickNotification(remoteMessage);
            }
        });

        const messageUnsubscribe = messaging().onMessage(async (remoteMessage) => {
            onMessageHandler(remoteMessage);
        });

        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
            setTimeout(() => {
                ProcessNotification(initialNotification)
                onClickNotification(initialNotification);
            }, 5000);
        }

        const handleNotificationInteraction = async (event: any) => {
            try {
                if (event.type === EventType.PRESS) {
                    setTimeout(() => {
                        onClickNotification(event?.detail?.notification);
                    }, 500);
                } else if (Platform.OS === 'ios') {
                    // ON_NOTIFICATION_RECIVED(event?.detail?.notification?.data);
                }
            } catch (error) {
                console.error('Error handling notification interaction:', error);
            }
        };

        notifee.onForegroundEvent(handleNotificationInteraction);
        notifee.onBackgroundEvent(handleNotificationInteraction);

        return () => {
            tokenRefreshUnsubscribe();
            messageUnsubscribeOpenedApp();
            messageUnsubscribe();
        };
    } catch (error) {
        console.error('Error in setNotificationsHandler:', error);
    }
};
