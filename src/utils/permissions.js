import { PermissionsAndroid, Platform, Alert, Linking } from "react-native";
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  requestNotifications,
  requestMultiple,
} from "react-native-permissions";
import { SetisMediaPermissionAllowed } from "../Store/Reducers/AuthReducer/AuthReducer";

const requestPermission = async (arg) => {
  await requestMultiple(arg).then((result) => {

  });
};

export const CameraPermission = async (OnConfirm) => {
  if (Platform.OS == "ios") {
    const iosCameraPermission = await request(PERMISSIONS.IOS.CAMERA);
    if (iosCameraPermission === RESULTS.GRANTED) {
    }
    if (iosCameraPermission === RESULTS.GRANTED) {
      OnConfirm && OnConfirm();
    } else {
      Alert.alert("Permission", "Please allow camera and media permission", [
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel",
        },
        { text: "Settings", onPress: () => Linking.openSettings() },
      ]);
    }
  }

  if (Platform.OS == "android") {
    await requestPermission([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.CAMERA,
    ]);
  }
};

export const IosNotificationPermission = () => {
  requestNotifications(["alert", "sound"]).then(({ status, settings }) => {
  });
};

export const locationPermission = () =>
  newPromise(async (resolve, reject) => {
    if (Platform.OS === "ios") {
      try {
        const permissionStatus = await Geolocation.requestAuthorization(
          "whenInUse"
        );
        if (permissionStatus === "granted") {
          return resolve("granted");
        }
        reject("Permission not granted");
      } catch (error) {
        return reject(error);
      }
    }
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
      .then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return resolve("granted");
        }
        return reject("Location Permission denied");
      })
      .catch((error) => {
        console.log("Ask Location permission error: ", error);
        return reject(error);
      });
  });


export const confirmMediaPermission = (OnConfirm, dispatch, isAllow) => {
  if (isAllow != true) {
    Alert.alert('"Foodosti Driver" Would Like to Access the Photo Library', "Please grant Foodosti Driver app permission to access the photo library", [
      {
        text: "Don't Allow",
        onPress: () => { },
      },
      {
        text: "OK", onPress: () => {
          dispatch(SetisMediaPermissionAllowed(true))
          OnConfirm && OnConfirm()
        }
      },
    ]);
  }
}
