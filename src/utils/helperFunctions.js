import axios from 'axios';
import moment from 'moment';
import { Linking, Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { GOOGLE_API } from '@env'
import { Image } from 'react-native-compressor';
import { decryptVale } from './Crypto';

function OpenGoogleMpas(curLoc, orderDetails, OrderStatus) {

    // const scheme = Platform.select({
    //     ios: "maps:0,0?q=",
    //     android: "geo:0,0?q=",
    // });

    const latitude = orderDetails?.CurrentStatus == 20 || orderDetails?.CurrentStatus == 8 || orderDetails?.CurrentStatus == 9 ?
        orderDetails?.locationOfUsers?.latitude : orderDetails?.locationOfMart?.lat;
    const longitude = orderDetails?.CurrentStatus == 20 || orderDetails?.CurrentStatus == 8 || orderDetails?.CurrentStatus == 9 ?
        orderDetails?.locationOfUsers?.longitude : orderDetails?.locationOfMart?.long;


    // const latLng = `${latitude},${longitude}`;
    // const label = "Foodosti";

    // const url = Platform.select({
    //     ios: `${scheme}${label}@${latLng}`,
    //     android: `${scheme}${latLng}(${label})`,
    // });
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
}


function OpenGoogleMapsRestaurant(curLoc, orderDetails, OrderStatus) {

    const scheme = Platform.select({
        ios: "maps:0,0?q=",
        android: "geo:0,0?q=",
    });

    const latitude = OrderStatus == "wdispatch" || OrderStatus == 'startride' || OrderStatus == "startride-start" ? orderDetails?.locationOfRestaurant?.lat : orderDetails?.locationOfUsers?.latitude;
    const longitude = OrderStatus == "wdispatch" || OrderStatus == 'startride' || OrderStatus == "startride-start" ? orderDetails?.locationOfRestaurant?.long : orderDetails?.locationOfUsers?.longitude;

    const latLng = `${latitude},${longitude}`;
    const label = "FOODDOSTI";

    // const url2 = Platform.select({
    //     ios: `${scheme}${label}@${latLng}`,
    //     android: `${scheme}${latLng}(${label})`,
    // });
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    Linking.openURL(url);
    // const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    // const urlIOS = `http://maps.apple.com/?ll=${latitude},${longitude}`;

    // try {
    //     Linking.canOpenURL(url2)

    //         .then(supported => {
    //             console.log('supported', supported)
    //             if (!supported) {
    //                 // Linking.openURL(url2);
    //                 console.log('supported', supported)
    //             } else {
    //                 return Linking.openURL(url);
    //             }
    //         })
    //         .catch(err => console.error('An error occurred', err));

    // } catch (error) {
    //     console.error('An error occurred', error)
    // }
}


const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                const cords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                resolve(cords);
            },
            error => {
                reject(error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 20000 },
        )
    })
const getLibLocation = () =>
    new Promise((resolve, reject) => {
        Geolocation.watchPosition(
            position => {
                const cords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                resolve(cords);
            },
            error => {
                reject(error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 20000, distanceFilter: 1 },
        )
    })


const locationPermission = (setLoading) => new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
        try {
            const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
            if (permissionStatus === 'granted') {
                return resolve("granted");
            } else {
                if (setLoading) {
                    Alert.alert('Info', 'You need to allow the location permission', [
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'cancel',
                        },
                        { text: 'Go to settings', onPress: () => Linking.openSettings() },
                    ]);
                }
            }
            setLoading && setLoading(false)
            reject('Permission not granted');
        } catch (error) {
            setLoading && setLoading(false)
            return reject(error);
        }
    } else {

        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ).then((granted) => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                resolve("granted");
            } else {
                if (setLoading) {
                    Alert.alert('Info', 'You need to allow the location permission', [
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'cancel',
                        },
                        { text: 'Go to settings', onPress: () => Linking.openSettings() },
                    ]);
                }
            }
            setLoading && setLoading(false)
            return reject('Location Permission denied');
        }).catch((error) => {
            console.log('Ask Location permission error: ', error);
            setLoading && setLoading(false)
            return reject(error);
        });
    }
});

const EmailValidates = email => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email?.match(regexEmail)) {
        return true;
    } else {
        return false;
    }
};

function validatePassword(password) {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numericRegex = /[0-9]/;
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\|\-'`"/=]).+$/;
    if (
        !uppercaseRegex.test(password) ||
        !numericRegex.test(password) ||
        !regex.test(password) ||
        !lowercaseRegex.test(password)
    ) {
        return false;
    } else {
        return true;
    }
}

const DateFormatHome = (orderTime) => {
    var date = new Date(orderTime);
    var currentUTCTime = date.getTime();
    var timeZoneOffsetInMinutes = new Date().getTimezoneOffset();
    var timeZoneOffsetInMilliseconds = timeZoneOffsetInMinutes * 60000;
    var convertedTime = currentUTCTime + timeZoneOffsetInMilliseconds;
    var convertedDate = new Date(convertedTime);
    var formattedDate = convertedDate.toISOString();
}

const PasswordValidation = (password) => {
    const uppercaseRegex = /[A-Z]/;
    const numericRegex = /[0-9]/;
    const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
    if (!uppercaseRegex.test(password) || !numericRegex.test(password) || !specialCharacterRegex.test(password)) {
        return false;
    } else {
        return true
    }
}

const CONVERT_DATE_TIME = (datea) => {
    moment.locale("en");
    let DATE = moment(datea).utc().format("MMM-DD-YYYY");
    let TIME = moment(datea).format("hh:mm a");

    return DATE + " " + TIME;
};


const BackgorundTaskFunction = async (fun, fun2) => {
    let permission;

    if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
    } else if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.LOCATION_ALWAYS;

    }

    const status = await check(permission);

    switch (status) {
        case RESULTS.GRANTED:
            await fun && fun()
            return true;

        case RESULTS.DENIED:
            fun2 && fun2(true)
            return false;

        case RESULTS.BLOCKED:
            fun2 && fun2(true)
            return false;

        case RESULTS.UNAVAILABLE:
            fun2 && fun2(true)
            return false;

        default:
            console.log('Background location permission is in an unknown state:', status);
            return false;
    }
}

const getDistance = async (origin, destination) => {
    const userLatLng = `${origin?.latitude},${origin?.longitude}`
    const chefLatLng = `${destination?.latitude},${destination?.longitude}`
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${(userLatLng)}&destination=${(chefLatLng)}&key=${GOOGLE_API}`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.status === 'OK') {
            const distance = data.routes[0].legs[0].distance.text;
            const duration = data.routes[0].legs[0].duration.text;
            let finalDistance = distance

            if (finalDistance.toLowerCase().includes("km")) {
                finalDistance = finalDistance.replace(/km/g, "");
                finalDistance = ((Number(finalDistance) * 0.621371).toFixed(2)) + " miles";
            }
            if (finalDistance.toLowerCase().includes("mi") && !(finalDistance.toLowerCase().includes("miles"))) {
                finalDistance = finalDistance.replace(/mi/g, "");
                finalDistance = ((Number(finalDistance)).toFixed(2)) + " miles";
            }
            if (finalDistance.toLowerCase().includes("m") && !(finalDistance.toLowerCase().includes("miles"))) {
                finalDistance = finalDistance.replace(/m/g, "");
                finalDistance = ((Number(finalDistance) * 0.000621371).toFixed(2)) + " miles";
            }
            if (finalDistance.toLowerCase().includes("ft")) {
                finalDistance = finalDistance.replace(/ft/g, "");
                finalDistance = ((Number(finalDistance) / 5280).toFixed(2)) + " miles";
            }
            if (finalDistance.toLowerCase().includes("in")) {
                finalDistance = finalDistance.replace(/in/g, "");
                finalDistance = ((Number(finalDistance) / 63360).toFixed(2)) + " miles";
            }
            if (finalDistance.toLowerCase().includes("yd")) {
                finalDistance = finalDistance.replace(/yd/g, "");
                finalDistance = ((Number(finalDistance) / 1760).toFixed(2)) + " miles";
            }
            return { finalDistance, duration }
        } else {
            console.error('Error:==========', data.error_message);
        }
    } catch (error) {
        console.error('Error:---------', error.message)
    }
};


const compressImg = async (imgPath) => {
    try {
        const result = await Image.compress(imgPath, {
            progressDivider: 10,
            downloadProgress: (progress) => {
                console.log('downloadProgress: ', progress);
            },
        });
        return result;
    } catch (error) {
        return imgPath;
    }
}

const returnUserDetailData = (UserDetailData) => {
    return UserDetailData
}

const payoutStatus = (statusCode) => {
    const statusMap = {
        0: { status: "Requested", color: "#3498db" },
        1: { status: "Pending", color: "#f1c40f" },
        2: { status: "Failure", color: "#e74c3c" },
        3: { status: "Success", color: "#2ecc71" },
        4: { status: "Unclaimed", color: "#95a5a6" },
        5: { status: "On Hold", color: "#e67e22" },
        6: { status: "Returned", color: "#9b59b6" },
        7: { status: "Blocked", color: "#34495e" },
        8: { status: "Refunded", color: "#1abc9c" },
        9: { status: "Reversed", color: "#d35400" },
    };
    return statusMap[statusCode] || { status: "Unknown", color: "#7f8c8d" };
}

export {
    getCurrentLocation,
    locationPermission,
    OpenGoogleMpas,
    EmailValidates,
    OpenGoogleMapsRestaurant,
    validatePassword,
    DateFormatHome,
    PasswordValidation,
    getLibLocation,
    CONVERT_DATE_TIME,
    BackgorundTaskFunction,
    getDistance,
    compressImg,
    returnUserDetailData,
    payoutStatus
};
