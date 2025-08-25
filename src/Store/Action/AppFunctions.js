import { Platform, PermissionsAndroid, Keyboard } from "react-native";
import { APP_VERSION } from "@env"
import messaging from '@react-native-firebase/messaging';
import { PERMISSIONS, check } from 'react-native-permissions';
import moment from "moment";
// import { getBatteryLevel, getBrand, getDeviceId, getDeviceType, getModel, getSystemName, getSystemVersion, getTotalMemory, getUsedMemory, isLocationEnabled, isEmulator } from "react-native-device-info";

import { GET_METHOD, POST_METHOD_AUTH, POST_METHOD_AUTH2, PUT_METHOD_AUTH } from "../../utils/ApiCallingMachnisem";
import { showNotificationModal } from "../Reducers/AppReducer/AppReducer";
import { store } from "../store";
import { UserDetail } from "../Reducers/AuthReducer/AuthReducer";
import { NotificationPermissionStatus } from "../../services/NotificationServices/notificationHelper";

const SumbitanIssues = (
  setLoading,
  UserDetail,
  issue,
  Setissue,
  TokenId,
  setmodalmsg,
  seterrorModal
) => {
  try {
    if (issue?.length > 0 && issue?.length != undefined && issue?.trim()?.length > 0) {
      setLoading(true);

      const raw = {
        userid: UserDetail?.Id,
        usertype: 3,
        feedbackmsg: issue,
        datetime: getISOFormattedDateWithGMT(),
      };

      POST_METHOD_AUTH2(`api/ReportError`, TokenId, raw)
        .then((responseJson) => {
          if (responseJson?.status == 0) {
            // const Result = responseJson && JSON.parse(responseJson)
            Keyboard.dismiss()
            setLoading(false);
            Setissue("");
            setmodalmsg(
              "Success. We have received your request.Our help desk team will respond as quickly as possible."
            );
            seterrorModal(true);
          } else {
            setLoading(false);
            setmodalmsg(
              'Something went wrong please try again',
            );
            seterrorModal(true);
          }
          setLoading(false);
        })
        .catch((error) => {
          setmodalmsg(
            "Something went wrong, please try again."
          );
          seterrorModal(true);
          setLoading(false);
          console.log("SumbitanIssues", error);
        });
    } else {
      setLoading(false);
      setmodalmsg("Kindly write something to report an issue");
      seterrorModal(true);
      //   Alert.alert("Warning", "write something to report an issue");
    }
  } catch (error) {
    setLoading(false);
    setmodalmsg("Something went wrong");
    seterrorModal(true);
    // Alert.alert("Warning", "Something went wrong");
  }
};

const GetSupport = (
  setPhone,
  setLoading
) => {
  setLoading(true)
  GET_METHOD(
    `/api/Support`
  )
    .then(async result => {
      // console.log(result);
      setPhone(result)
      // setEmail(result?.email)
      setLoading && setLoading(false)
    })
    .catch(e => {
      console.log(e);
      setLoading(false);
    });
};

const UpdateAppVersion = async (UserId, TokenId) => {
  const fcmToken = await messaging().getToken();
  // console.log('fcmToken==>', fcmToken);
  PUT_METHOD_AUTH(`/api/v2/DMSRiderAcc?rId=${UserId}&version=${APP_VERSION}&fcmToken=${fcmToken}`, TokenId)
    .then(async (result) => {
    })
    .catch((error) => {
      console.log('UpdateAppVersion', error)

    });
};

const IS_USER_ALLOW_NOTIFICATION_PERMISSION = async () => {
  try {
    const { UserDetail } = store?.getState()?.AuthReducer;
    const StoreDispatch = store?.dispatch;
    if (UserDetail?.Id) {
      if (Platform.OS == 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (!authStatus) {
          StoreDispatch(showNotificationModal(true))
        }
      } else {
        try {
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
          const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
          if (result == 'denied') {
            StoreDispatch(showNotificationModal(true))
          }
        } catch (error) {
          console.log('error===>', error);
        }

      }
    }
  } catch (error) {
    console.log('error', error);
  }
}

const UPDATE_NOTIFICATION_STATUS = (url, onSuccess, setIsBusy, seterrorModal, setmodalmsg, TokenId, UserDetails, dispatch, type, value) => {
  try {
    setIsBusy(true);
    PUT_METHOD_AUTH(url, TokenId)
      .then((responseJson) => {
        setIsBusy(false);
        const Result = responseJson;
        if (Result?.status == 1) {
          onSuccess && onSuccess()
          if (type == 1) {
            dispatch(UserDetail({ ...UserDetails, isSubscribed: value }));
          } else {
            dispatch(UserDetail({ ...UserDetails, isMsgSubscribed: value }));
          }
          setmodalmsg("Successfully updated");
          seterrorModal(true);
        } else {
          setmodalmsg(Result?.message || "Something went wrong");
          seterrorModal(true);
        }
      })
      .catch((error) => {
        setIsBusy(false);
        console.log("SumbitanIssues", error);
        setmodalmsg("Something went wrong");
        seterrorModal(true);
      });
  } catch (error) {
    setIsBusy(false);
    setmodalmsg("Something went wrong");
    seterrorModal(true);
  }
};

const getISOFormattedDateWithGMT = (newDate) => {
  const date = newDate ? newDate : new Date();
  return date.toISOString();
};

const convertToISOFormat = (dateString) => {
  try {
    if (!dateString) {
      return null;
    }
    let parsedDate = moment.utc(dateString);
    if (parsedDate.isValid()) {
      const localDate = parsedDate.local();
      return localDate.toISOString();
    } else {
      console.warn(`Invalid date format: ${dateString}`);
      return dateString;
    }
  } catch (error) {
    console.log('convertToISOFormat==>', error);
  }
};

const convertToISOFormat2 = (dateString) => {
  try {
    if (!dateString) {
      return null;
    }
    let parsedDate = moment(dateString, "YYYY-MM-DD HH:mm:ss").utc(); // Ensure it stays in UTC
    if (parsedDate.isValid()) {
      return parsedDate.toISOString(); // Keep it in UTC
    } else {
      console.warn(`Invalid date format: ${dateString}`);
      return dateString;
    }
  } catch (error) {
    console.log('convertToISOFormat==>', error);
  }
};


const dateFormatter = (dateString) => {
  try {
    if (dateString) {

      const mainDate = convertToISOFormat(dateString);
      const date1 = (mainDate?.split(' ')[0]);
      return moment(date1).format("MM/DD/YYYY, h:mm A");
    } else {
      return 'Invalid Date'
    }
  } catch (error) {
    console.log('dateFormatter', error);
  }
}

const dateFormatterOnlyDate = (dateString) => {
  try {
    const mainDate = convertToISOFormat(dateString);
    const date1 = (mainDate?.split(' ')[0]);
    return moment(date1).format("MM/DD/YYYY");
  } catch (error) {
    console.log('dateFormatter', error);
  }
}

const UpdateDeviceDetail = async (USERID, TokenId) => {
  // try {
  //   const formatDeviceData = async () => {
  //     const [isLocation, isEmulators, totalMemory, usedMemory, batteryLevel, notification] = await Promise.all([
  //       isLocationEnabled(),
  //       isEmulator(),
  //       getTotalMemory(),
  //       getUsedMemory(),
  //       getBatteryLevel(),
  //       NotificationPermissionStatus()
  //     ]);

  //     return {
  //       deviceId: String(getDeviceId() ?? "n/a"),
  //       mobileBrand: String(getBrand() ?? "n/a"),
  //       mobileModel: String(getModel() ?? "n/a"),
  //       mobileOs: String(getSystemName() ?? "n/a"),
  //       osVersion: String(getSystemVersion() ?? "n/a"),
  //       mobileType: String(getDeviceType() ?? "n/a"),
  //       isLocation: String(isLocation ?? "n/a"),
  //       isEmulator: String(isEmulators ?? "n/a"),
  //       totalRam: String(totalMemory ? Math.round(totalMemory / (1024 * 1024)) : "n/a"),
  //       usedRam: String(usedMemory ? Math.round(usedMemory / (1024 * 1024)) : "n/a"),
  //       batteryLevel: String(batteryLevel !== null ? Math.round(batteryLevel * 100) : "n/a"),
  //       notificationPermission: notification ? 0 : 1,
  //     };
  //   };

  //   const data = await formatDeviceData();
  //   console.log("Device INFO:", data);

  //   if (USERID) {
  //     await POST_METHOD_AUTH(`api/UserAcc/DeviceInfo?userId=${USERID}`, TokenId, data);
  //   }
  // } catch (error) {
  //   console.error("Error updating device details:", error);
  // }
};

const ADD_NOTIFICATION_LOG = (remoteMessage) => {
  try {
    const { UserDetail } = store?.getState()?.AuthReducer;
    const message = remoteMessage?.notification?.body || remoteMessage?.notification?.message || remoteMessage?.data?.body || remoteMessage?.data?.message;
    const messagingid = remoteMessage?.messageId || remoteMessage?.data?.messageId || remoteMessage?.id;
    const URL = `api/LogInsertion?userId=${UserDetail?.Id}&message=${message}&userType=${3}&messagingid=${messagingid}`;

    PUT_METHOD_AUTH(URL)
      .then(async (res) => {
        // console.log('ADD_NOTIFICATION_LOG', res)
      })
      .catch((e) => {
        console.log("ADD_NOTIFICATION_LOG", e);
      });
  } catch (error) {
    console.log("ADD_NOTIFICATION_LOG", error);
  }
}

export {
  SumbitanIssues,
  GetSupport,
  UpdateAppVersion,
  IS_USER_ALLOW_NOTIFICATION_PERMISSION,
  UPDATE_NOTIFICATION_STATUS,
  getISOFormattedDateWithGMT,
  dateFormatter,
  convertToISOFormat,
  dateFormatterOnlyDate,
  UpdateDeviceDetail,
  ADD_NOTIFICATION_LOG,
  convertToISOFormat2
};
