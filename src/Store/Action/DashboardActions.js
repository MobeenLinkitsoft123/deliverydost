import { UserDetail } from "../Reducers/AuthReducer/AuthReducer";
import { GET_METHOD_AUTH, POST_METHOD_AUTH, POST_METHOD_AUTH2, PUT_METHOD_AUTH } from "../../utils/ApiCallingMachnisem";
import messaging from '@react-native-firebase/messaging';

import { setRideStatus } from "../Reducers/AppReducer/BidReducer";

const UserOnlineStatusHandler = async (
  setLoading,
  UserDetail,
  dispatch,
  TokenId,
  UpdateGetLocation,
  NewBids,
  seterrorModal,
  setmodalmsg,
  isOfffline,
  onLogout
) => {
  setLoading(true);
  PUT_METHOD_AUTH(`api/DMSRiderAcc/${UserDetail?.Id}?status=${isOfffline == 'ForceOffline' ? 0 : UserDetail?.OnlineStatus == 1 ? 0 : 1}`, TokenId)
    .then(async (res) => {
      UpdateGetLocation && UpdateGetLocation();

      if (res.status == 0) {
        await !onLogout && GetUpdateUserProfile(setLoading, UserDetail, dispatch, TokenId);
        if (UserDetail?.OnlineStatus) {
        } else {
          NewBids && NewBids(true);
        }

      } else {
        setLoading(false);
        if (res.status == 1) {
          // Alert.alert("you can not go online until you are approved by admin");
          setmodalmsg("You cannot go online until you are approved by admin");
          seterrorModal(true);
        }
        if (res.status == 2) {
          //  Alert.alert("You are in the middle of a bid you cannot go offline.");
          setmodalmsg("You are in the middle of a job you cannot go offline.");
          seterrorModal(true);
        }
      }
    })
    .catch((er) => {
      setLoading(false);
      console.log("UserOnlineStatusHandler", er);
      setmodalmsg("Something went wrong try again");
      seterrorModal(true);
      // Alert.alert("Something went wrong try again");
    });
};

const UserUpdatingFCMToken = async (
  setLoading,
  UserDetail,
  TokenId,
  seterrorModal,
  setmodalmsg,
) => {
  setLoading(true);
  const fcmToken = await messaging().getToken();

  PUT_METHOD_AUTH(`api/DMSRiderAcc?rId=${UserDetail?.Id}&fToken=${fcmToken}`, TokenId)
    .then((res) => {
      setLoading(false);
    })
    .catch((er) => {
      setLoading(false);
      console.log("UserOnlineStatusHandler", er);
      setmodalmsg("Something went wrong try again");
      seterrorModal(true);
    });
};

const GetUpdateUserProfile = async (
  setLoading,
  UserData,
  dispatch,
  TokenId,
  checkModalWorking
) => {
  GET_METHOD_AUTH(`api/DMSRiderAcc?riderIdd=${UserData.Id}`, TokenId)
    .then((result) => {
      // dispatch(TokenId(result?.token));
      dispatch(UserDetail(result));
      setLoading && setLoading(false);
      checkModalWorking && checkModalWorking(result)
    })
    .catch((error) => {
      setLoading && setLoading(false);
      console.log("GetUpdateUserProfile", error);
    });
};

const convertSpecialCharacters = (inputString) => {
  return encodeURIComponent(inputString);
}


const UpdateRiderLocation = async (
  country,
  state,
  city,
  loading,
  UserDetail,
  dispatch,
  TokenId,
  latitude,
  longitude,
  seterrorModal,
  setmodalmsg,
  address,
  address2
) => {

  // const Address = convertSpecialCharacters(address);
  // const Address2 = convertSpecialCharacters(address2);

  const body = {
    userid: UserDetail?.Id,
    country: country,
    state: state,
    city: city,
    latitude: latitude,
    longitude: longitude,
    address: address,
    address2: address2 !== undefined ? address2 : ''
  };
  // console.log('UpdateRiderLocation body',body,TokenId);
  POST_METHOD_AUTH2(
    `api/DMSRiderDetailAcc/V2LocationUpdate`,TokenId, body)
    .then((res) => {
      // console.log('UpdateRiderLocation res',res);
      if (res.status == 0) {
        GetUpdateUserProfile(loading, UserDetail, dispatch, TokenId);
      } else {
        loading(false);
        setmodalmsg("Fail to update location");
        seterrorModal(true);
        // Alert.alert("Warning", "Fail to update location");
      }
    })
    .catch((error) => {
      loading(false);
      setmodalmsg("Fail to update location");
      seterrorModal(true);
      //   Alert.alert("Warning", "Fail to update location");
      console.log("UpdateRiderLocation", error);
    });
};

const CheckAnyOrderProgressScheduleMartOrder = (UserDetail, navigation, TokenId, setRideStatusSchedule, setLoading, seterrorModal, setmodalmsg, Isfalse) => {
  setLoading && setLoading(true)
  GET_METHOD_AUTH(`api/DMSOrderV2?Rdrd=${UserDetail.Id}`, TokenId)
    .then(async (res) => {
      setLoading && setLoading(false)
      if (res?.Status != 0) {
        if (res.currentStatus != 17 && res.currentStatus != null && Isfalse != true && res.currentStatus != 21) {
          navigation.navigate("MartOrders", {
            OrderId: res.orderid,
          });
        }
      }

      if (res.Status == 0) {


        if (UserDetail?.isDisabled == 0) {
          setmodalmsg(res?.message == "Set yourself online to accept orders." ? res?.message : `No current order of mart`);
          seterrorModal(true);
        }
        if (UserDetail?.isDisabled == 1) {
          setmodalmsg(`You are blocked from admin`);
          seterrorModal(true);
        }


        // setmodalmsg && res?.message == 'Set yourself online to place bids.' ? setmodalmsg(res?.message) : setmodalmsg(`No current order of mart`);
        // seterrorModal && seterrorModal(true);
      }
      if (res?.scheduleType != 0) setRideStatusSchedule(res);

    })
    .catch((Err) => {
      console.log("CheckAnyOrderProgressScheduleMartOrder Err===> ", Err.response);
    });

}

export {
  UserOnlineStatusHandler,
  GetUpdateUserProfile,
  UpdateRiderLocation,
  CheckAnyOrderProgressScheduleMartOrder,
  UserUpdatingFCMToken
};
