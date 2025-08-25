import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Image, ScrollView, RefreshControl, AppState, StyleSheet, Platform, Linking, ImageBackground, } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import ScalingDrawer from "react-native-scaling-drawer";
import { useNavigation } from "@react-navigation/native";
import Ripple from "react-native-material-ripple";
import { EventRegister } from "react-native-event-listeners";
import moment from "moment";
import BackgroundService from 'react-native-background-actions';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { APP_VERSION } from '@env'

import { whole } from "../../../assets/styling/stylesheet";
import colors from "../../../styles/colors";
import LeftMenu from "./LeftMenu";
import homestyles from "./styles";
import imagePath from "../../../constants/imagePath";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import { GetLocationAndAddress, GetLocationAndAddressWithOutPermission } from "../../../Store/Action/HelperActions";
import { UserOnlineStatusHandler, GetUpdateUserProfile, UpdateRiderLocation, CheckAnyOrderProgressScheduleMartOrder, UserUpdatingFCMToken } from "../../../Store/Action/DashboardActions";
import ModalPattern1 from "../../../Components/Modals/Modals/ModalPattern1";
import ModalPattern2 from "../../../Components/Modals/Modals/ModalPattern2";
import { height, moderateScale, verticalScale, width } from "../../../styles/responsiveSize";
import { convertToISOFormat2, IS_USER_ALLOW_NOTIFICATION_PERMISSION } from "../../../Store/Action/AppFunctions";
import AnimatedModal from "../../../Components/AnimtedModal/AnimatedModal";
import { BgLocationServices, stopBgLocation } from "../../../utils/BgLocationService";
import { GetBgLocationForANDROID, GetBgLocationForIOS } from "../../../Store/Action/RestaurantFunctions";
import { BackgorundTaskFunction, returnUserDetailData, } from "../../../utils/helperFunctions";
import ModalPattern3 from "../../../Components/Modals/Modals/ModalPattern3";
import { setNewUpdate, shownNewModal } from "../../../Store/Reducers/AppReducer/AppReducer";
import { CheckAnyPendingOrdersMain, checkOrderForMarts, GetBidAmount, GetNewBidsMain, GetNewBidsMainWithoutLocationPermission } from "../../../Store/Action/BidsActionsMain";
import { CheckOrderProgressFinalMain } from "../../../Store/Action/BidsActionsMain";
import { GET_TOTAL_PAYABLE } from "../../../Store/Action/EarningActions";
import { StaticMethods } from "../../../utils/StaticMethods";
import messaging from '@react-native-firebase/messaging';
import { onClickNotification, ProcessNotification } from "../../../services/NotificationServices/notificationHelper";

let defaultScalingDrawerConfig = {
  scalingFactor: 0.6,
  minimizeFactor: 0.6,
  swipeOffset: 20,
};

function HomeScreen() {

  let timerHandler = null;

  const OpenDrawer = useRef();
  const BidScrollView = useRef();
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const AppFirstLogin = useSelector((state) => state);
  const { TokenId, UserDetail, LoginUser } = useSelector((state) => state?.AuthReducer);
  const { newUpdate } = useSelector((state) => state?.AppReducer);
  const { RideStatus } = useSelector((state) => state?.BidReducer);
  // const { OnlineStatus } = useSelector((state) => state?.AuthReducer?.UserDetail);

  // console.log('RideStatusMart', RideStatusMart)

  const [BiddingAmount, SetBiddingAmount] = useState();
  const [radius, setRadius] = useState(0);
  const [TutorialModal, setTutorialModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [modalMsg, setmodalmsg] = useState("");
  const [errorModal, seterrorModal] = useState(false);
  const [RideStatusSchedule, setRideStatusSchedule] = useState({});
  const [locationPermissionModal, setlocationPermissionModal] = useState(false);
  const [UpdateProfileNoti, setUpdateProfileNoti] = useState(true);
  const [OnChnageAppState, setOnChnageAppState] = useState(true)
  const [PayoutData, setPayoutData] = useState()

  const userDetailDecrypted = returnUserDetailData(UserDetail);

  const ceck = async () => {
    const initialNotification = await messaging().getInitialNotification();
    ProcessNotification(initialNotification)
    onClickNotification(initialNotification);

  }

  useEffect(() => {
    ceck()
  }, [])


  const GetRadius = async () => GetBidAmount(SetBiddingAmount, setRadius)

  const OnSucces = (country, state, city, loading, latitude, longitude, address, address2) => {
    UpdateRiderLocation(country, state, city, loading, userDetailDecrypted, dispatch, TokenId, latitude, longitude, seterrorModal, setmodalmsg, address, address2);
  };

  const UpdateGetLocation = () => {
    GetLocationAndAddress(() => { }, setLoading, OnSucces);
  };

  const getBids = () => {
    GetNewBidsMain(userDetailDecrypted, TokenId, true, BiddingAmount, undefined, dispatch);
  }

  const RefreshHomeFun = async () => {
    const loading = () => { };
    await GetLocationAndAddress(() => { }, loading, OnSucces);
    await GetLocationAndAddressWithOutPermission(() => { }, loading, OnSucces);
    await GetUpdateUserProfile(setLoading2, userDetailDecrypted, dispatch, TokenId);
    await CheckOrderProgressFinalMain(userDetailDecrypted, navigation, () => { }, setLoading2, TokenId, "any", seterrorModal, setmodalmsg, false, dispatch);
    await GET_TOTAL_PAYABLE(TokenId, UserDetail, setPayoutData, setLoading, convertToISOFormat2(moment().format("YYYY-MM-DD 00:00:00")), convertToISOFormat2(moment().format("YYYY-MM-DD 23:59:00")))
    // await checkOrderForMarts(UserDetail, navigation, setLoading, TokenId, seterrorModal, setmodalmsg, dispatch, true, false)
    // await CheckAnyOrderProgressScheduleMartOrder(userDetailDecrypted, navigation, TokenId, setRideStatusSchedule)
    setTimeout(() => {
      getBids()
    }, 700);
    await GetRadius();
  }

  const RiderCheckOrders = () => {
    CheckAnyPendingOrdersMain(userDetailDecrypted, TokenId, dispatch)
    // checkOrderForMarts(UserDetail, navigation, setLoading, TokenId, seterrorModal, setmodalmsg, dispatch, false, false)
    // CheckAnyOrderProgressScheduleMartOrder(userDetailDecrypted, navigation, TokenId, setRideStatusSchedule)
  };

  const checkModalWorking = (result) => {
    const user = result?.Id ? result : userDetailDecrypted
    if (user?.verificationStatus == 0 && user?.isDisabled == 0) {
      if (APP_VERSION == "ALPHA A-42") dispatch(shownNewModal(userDetailDecrypted?.Id));
    }
  }

  useEffect(() => {
    if (loading == false && AppFirstLogin?.AppReducer?.FirstLogin == true) {
      setTutorialModal(true);
    }
    // checkModalWorking();
  }, [loading]);


  useEffect(() => {
    const loading = () => { };
    GetLocationAndAddress(() => { }, loading, OnSucces);
    GetLocationAndAddressWithOutPermission(() => { }, loading, OnSucces);

    if (isFocus == true) {
      UpdateGetLocation();
      const FalseFunction = () => { }
      RiderCheckOrders()
      GET_TOTAL_PAYABLE(TokenId, UserDetail, setPayoutData, setLoading, convertToISOFormat2(moment().format("YYYY-MM-DD 00:00:00")), convertToISOFormat2(moment().format("YYYY-MM-DD 23:59:00")))
      // CheckAnyOrderProgressScheduleMartOrder(userDetailDecrypted, navigation, TokenId, setRideStatusSchedule, FalseFunction, FalseFunction, FalseFunction, true)
      GetRadius();
    }
    seterrorModal(false)
  }, [isFocus]);

  useEffect(() => {
    setUpdateProfileNoti(true)
    GetUpdateUserProfile(setLoading2, userDetailDecrypted, dispatch, TokenId);
  }, [UpdateProfileNoti])

  useEffect(() => {
    const UpdatedProfileData = EventRegister.addEventListener(
      "UpdatedProfile",
      (data) => {
        setUpdateProfileNoti(false)
        setOnChnageAppState(true)
        const loading = () => { };
        GetUpdateUserProfile(setLoading2, userDetailDecrypted, dispatch, TokenId, checkModalWorking);
        GetLocationAndAddressWithOutPermission(() => { }, loading, OnSucces);
        GetNewBidsMainWithoutLocationPermission(userDetailDecrypted, TokenId, false, BiddingAmount, () => { }, dispatch);
        GetRadius();
        RiderCheckOrders();
      }
    );
    const ScheduleStatusUpdate = EventRegister.addEventListener("ScheduleStatus", (data) => GetUpdateUserProfile(setLoading, userDetailDecrypted, dispatch, TokenId));
    const HomeRefereshOnOrderAssign1 = EventRegister.addEventListener("HomeRefereshOnOrderAssign", (data) => RefreshHomeFun());
    const GetUpdatedStatus = EventRegister.addEventListener("NewBidsOrderAccepted", (data) => RefreshHomeFun());
    return () => {
      EventRegister?.removeEventListener(UpdatedProfileData);
      EventRegister?.removeEventListener(ScheduleStatusUpdate);
      EventRegister?.removeEventListener(HomeRefereshOnOrderAssign1);
      EventRegister?.removeEventListener(GetUpdatedStatus);
    };
  }, []);

  useEffect(() => {

    if (OnChnageAppState == 'active') {
      RefreshHomeFun()
      UserUpdatingFCMToken(setLoading, userDetailDecrypted, TokenId, seterrorModal, setmodalmsg)
      setOnChnageAppState(true)
      GetNewBidsMainWithoutLocationPermission(userDetailDecrypted, TokenId, false, BiddingAmount, () => { }, dispatch);
      GetRadius();
      RiderCheckOrders();
    }
  }, [OnChnageAppState])



  useEffect(() => {
    const handleChange = AppState.addEventListener("change", (changedState) => {
      setOnChnageAppState(changedState)
    });
    return () => handleChange.remove();
  }, []);

  useEffect(() => {
    GET_TOTAL_PAYABLE(TokenId, UserDetail, setPayoutData, setLoading, convertToISOFormat2(moment().format("YYYY-MM-DD 00:00:00")), convertToISOFormat2(moment().format("YYYY-MM-DD 23:59:00")))
    GetLocationAndAddress(() => { }, loading, OnSucces);
    GetLocationAndAddressWithOutPermission(() => { }, loading, OnSucces);
    CheckOrderProgressFinalMain(userDetailDecrypted, navigation, () => { }, setLoading2, TokenId, "any", seterrorModal, setmodalmsg, false, dispatch);
    // checkOrderForMarts(UserDetail, navigation, setLoading, TokenId, seterrorModal, setmodalmsg, dispatch, true, false)
    GetRadius();
    requestLocationPermission()
    setTimeout(() => {
      IS_USER_ALLOW_NOTIFICATION_PERMISSION();
    }, 2000);

  }, []);

  //Background action to update rider location.
  const getLocation = async (cords) => {
    if (timerHandler == null) {
      timerHandler = new Date()
      GetBgLocationForIOS(cords, setLoading, OnSucces, userDetailDecrypted)
    }
    else {
      let a = timerHandler;
      if (new Date(a.setMinutes(a.getMinutes() + 5)) < new Date()) {
        GetBgLocationForIOS(cords, setLoading, OnSucces, userDetailDecrypted)
        timerHandler = new Date()
      }
      else {
        timerHandler = new Date(a.setMinutes(a.getMinutes() - 5));
      }
    }
  }

  const requestLocationPermission = async () => {
    let permission;

    if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    } else if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    }

    const status = await check(permission);

    if (status === RESULTS.DENIED) {
      const requestStatus = await request(permission);

      if (requestStatus === RESULTS.GRANTED) {
      } else {
      }
    } else {
    }
  };

  const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

  const veryIntensiveTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        GetBgLocationForANDROID(setLoading, OnSucces, userDetailDecrypted)
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Example',
    taskTitle: 'Foodosti Driver got your location in background',
    taskDesc: 'Foodosti Driver can always access your location. Tap to change.',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#e54e5b',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 300000,
    },
  };

  const startBgLocationIOS = async () => {
    await BgLocationServices(getLocation);
  }

  const stopBgLocationIOS = () => {
    stopBgLocation()
  }

  const startBackgroundTask = async () => {

    const func = async () => {
      await BackgroundService?.start(veryIntensiveTask, options)
    }

    BackgorundTaskFunction(func)
  }

  const stopBackgroundTask = async () => {
    if (Platform.OS === 'android') {
      await BackgroundService?.stop();
    }
  };

  useEffect(() => {
    if (userDetailDecrypted?.OnlineStatus == 1) {
      setTimeout(() => {
        BackgorundTaskFunction(Platform.OS === 'android' ? startBackgroundTask : startBgLocationIOS, setlocationPermissionModal)
      }, 9000);
    } else if (userDetailDecrypted?.OnlineStatus != 1) {
      stopBackgroundTask()
      stopBgLocationIOS()
    }

    const loading = () => { };
    GetLocationAndAddress(() => { }, loading, OnSucces);

  }, [userDetailDecrypted?.OnlineStatus])

  const askForLocation = async () => {
    setlocationPermissionModal(false);

    if (Platform.OS === 'ios') {
      const alwaysPermission = PERMISSIONS.IOS.LOCATION_ALWAYS;
      const alwaysStatus = await request(alwaysPermission);

      if (alwaysStatus === RESULTS.GRANTED) {
        startBgLocationIOS()
        console.log('The background location (Always) permission is granted');
      } else {
        console.log('The background location (Always) permission is not granted');
        Linking.openSettings();
      }
    } else if (Platform.OS === 'android') {
      const bgPermission = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
      const bgStatus = await request(bgPermission);

      if (bgStatus === RESULTS.GRANTED) {
        startBackgroundTask()
        console.log('The background location (Always) permission is granted');
      } else {
        console.log('The background location (Always) permission is not granted');
        Linking.openSettings();
      }
    }
  }

  const checkLocationPermission = async () => {
    const result = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

    switch (result) {
      case RESULTS.UNAVAILABLE:
        break;
      case RESULTS.DENIED:
        // Permission has not been requested yet
        const requestResult = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if (requestResult === RESULTS.GRANTED) {
          startBgLocationIOS()
        } else {
        }
        break;
      case RESULTS.GRANTED:
        startBgLocationIOS()
        break;
      case RESULTS.BLOCKED:
        break;
    }
  };

  useEffect(() => {
    if (Platform.OS == 'ios' && isFocus) {
      checkLocationPermission()
    }
  }, [isFocus])
  //Background action to update rider location



  return (
    <>
      <View style={styles.container}>

        <ScalingDrawer
          ref={OpenDrawer}
          style={styles.container1}
          content={
            <LeftMenu
              CloseDrawer={() => OpenDrawer.current.close()}
              UserDetail={userDetailDecrypted}
              radius={radius}
              setmodalmsg={setmodalmsg}
              seterrorModal={seterrorModal}
            />
          }
          {...defaultScalingDrawerConfig}
          onClose={() => { }}
          onOpen={() => { }}
        >
          <View style={styles.container}>
            <View style={[whole.Actionbartrans]}>
              <TouchableOpacity onPress={() => OpenDrawer.current.open()} style={whole.actionbarleft}>
                <Image source={imagePath.MenuIcon} style={homestyles.menuicon} />
              </TouchableOpacity>

              <View style={[whole.actionbarcenter, styles.logoImg]}>
                <Image style={homestyles.icon} resizeMode="contain" source={imagePath.AppLogoIcon} />
              </View>

              <View style={whole.actionbarright}>
                {userDetailDecrypted?.isDisabled == 0 ? (<Ripple
                  rippleColor={colors.theme}
                  style={homestyles.onlinecontainer}
                  onPress={async () => {
                    await UserOnlineStatusHandler(
                      setLoading,
                      userDetailDecrypted,
                      dispatch,
                      TokenId,
                      UpdateGetLocation,
                      getBids,
                      seterrorModal,
                      setmodalmsg
                    );
                    await UserUpdatingFCMToken(
                      setLoading,
                      userDetailDecrypted,
                      TokenId,
                      seterrorModal,
                      setmodalmsg,
                    )
                  }
                  }
                >
                  <Image
                    source={userDetailDecrypted?.OnlineStatus == 1 ? imagePath.OnlineIcon : imagePath.offlineIcon}
                    style={[homestyles.onlineicon, { tintColor: userDetailDecrypted?.OnlineStatus == 1 ? colors.green1 : colors.theme }]}
                    resizeMode={"contain"}
                  />

                  <Text style={[whole.smltext, ResponsiveFonts.textualStyles.smallBold, { margin: 0, color: userDetailDecrypted?.OnlineStatus == 1 ? "#89D342" : "#e54e5b" }]}>
                    {userDetailDecrypted?.OnlineStatus == 1 ? " Online" : "  Offline"}
                  </Text>
                </Ripple>) : (
                  <Text style={[whole.smltext, ResponsiveFonts.textualStyles.mediumNormal, styles.blocktext]}>{"Blocked"}</Text>
                )}
              </View>
            </View>
            <View style={styles.container2}>
              <ScrollView
                ref={BidScrollView}
                refreshControl={
                  <RefreshControl
                    refreshing={loading2}
                    onRefresh={async () => {
                      RefreshHomeFun()
                    }}
                  />
                } style={styles.container1}>

                <TouchableOpacity onPress={() => navigation.navigate('EarningPayout')} style={styles.paymentCard}>
                  <ImageBackground source={imagePath.MartIcon7} style={styles.paymentCard1} resizeMode="stretch">
                    <View style={styles.mainView}>
                      <View>
                        <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.largeBold]}>Today's Earnings</Text>
                        <Text style={[styles.paymentamount, ResponsiveFonts.textualStyles.xlargebold]}>
                          $ {StaticMethods.getTwoDecimalPlacesString(PayoutData?.todaysEarnings || 0)}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={styles.totalbox}>
                            <Text style={[styles.paymentDetails1, ResponsiveFonts.textualStyles.smallBold]}>Total Earnings</Text>
                            <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.medium]}>$ {StaticMethods.getTwoDecimalPlacesString(PayoutData?.totalEarnings || 0)}</Text>
                          </View>
                          <View style={styles.totaltip}>
                            <Text style={[styles.paymentDetails1, ResponsiveFonts.textualStyles.smallBold]}>Total Tips</Text>
                            <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.medium]}>$ {StaticMethods.getTwoDecimalPlacesString(PayoutData?.TotalTips || 0)}</Text>
                          </View>
                        </View>
                        <View style={styles.infoView}>
                          <Image source={imagePath.InfoIcon} style={styles.infoIconImg} resizeMode="contain" />
                          <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.micro]}>Total earnings include both the job and tip amounts.</Text>
                        </View>
                      </View>
                      <View style={styles.spacing}>
                        <Image source={imagePath.currencyImage} style={styles.PayOutIcons} resizeMode="contain" />
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>

                <Ripple
                  rippleColor={colors.theme}
                  onPress={() => {
                    CheckOrderProgressFinalMain(
                      userDetailDecrypted,
                      navigation,
                      () => { },
                      setLoading,
                      TokenId,
                      "restaurant",
                      seterrorModal,
                      setmodalmsg,
                      false,
                      dispatch
                    )
                  }}
                  style={[homestyles.whiteroundcard, styles.card1Heading, { marginBottom: 20 }]}>
                  <View style={homestyles.row}>
                    <Text style={[whole.cardH2, ResponsiveFonts.textualStyles.large]}>
                      Restaurants or Home Chef Jobs
                    </Text>
                  </View>

                  <View style={[homestyles.row2, styles.card1View]}>
                    <ImageBackground source={imagePath.Orderbgblue} resizeMode="contain"
                      style={[styles.card1ImgBg, { marginRight: 20 }]}>
                      <View style={styles.card1ImgView}>
                        <Text style={[whole.normltxt, ResponsiveFonts.textualStyles.medium, styles.card1Accept]}>
                          Active Jobs
                        </Text>
                      </View>
                      <View style={styles.card1Num}>
                        <View style={[whole.redborderview1,]}>
                          <Text style={[whole.normltxt, styles.card1Number, ResponsiveFonts.textualStyles.xxxlarge]}>
                            {RideStatus?.OrdersCount || 0}
                          </Text>
                        </View>
                        <Image
                          source={imagePath.Ordermap}
                          resizeMode="contain"
                          style={[homestyles.itemimage1]}
                        ></Image>
                      </View>
                    </ImageBackground>
                    <ImageBackground source={imagePath.Orderbgpurple} resizeMode="contain" style={styles.card1ImgBg}>
                      <View style={styles.card1ImgView}>
                        <Text style={[whole.normltxt, ResponsiveFonts.textualStyles.medium, styles.card1Accept]}>
                          Waiting for job acceptance
                        </Text>
                      </View>
                      <View style={styles.card1Num}>
                        <View style={[whole.redborderview1,]}>
                          <Text style={[whole.normltxt, styles.card1Number1, ResponsiveFonts.textualStyles.xxxlarge]}>
                            {RideStatus?.BidsCount || 0}
                          </Text>
                        </View>
                        <Image
                          source={imagePath.Orderbid}
                          resizeMode="cover"
                          style={homestyles.itemimage1}
                        ></Image>
                      </View>
                    </ImageBackground>
                  </View>

                  <View style={homestyles.row}>
                    <Text style={[whole.cardH2, ResponsiveFonts.textualStyles.large]}>
                      Mart Jobs
                    </Text>
                  </View>

                  <View style={[homestyles.row2, styles.card1View1]}>
                    <ImageBackground source={imagePath.MartIcon4} resizeMode="contain"
                      style={[styles.card1ImgBg1]}>
                      <View style={[styles.card1ImgView1, { paddingLeft: 15 }]}>
                        <Text style={[whole.normltxt, ResponsiveFonts.textualStyles.medium, styles.card1Accept]}>
                          Active Jobs
                        </Text>
                        <Text style={[whole.normltxt, ResponsiveFonts.textualStyles.xxxlarge,]}>
                          {RideStatus?.MartOrderCount || 0}
                        </Text>
                      </View>
                    </ImageBackground>
                  </View>
                </Ripple>

              </ScrollView>
            </View>

          </View>


          {errorModal && (
            <AnimatedModal visible={errorModal} onClose={() => { seterrorModal(false) }} >
              <ModalPattern1
                setValue={seterrorModal}
                heading={modalMsg}
                btnTittle={"Okay"}
                OnPress={() => {
                  getBids()
                  setmodalmsg("");
                  seterrorModal(false);
                }}
              />
            </AnimatedModal>
          )}


          {!TutorialModal && locationPermissionModal && !newUpdate && (
            <View style={{ width: width, height: height, position: 'absolute', zIndex: 8888888 }}>
              <AnimatedModal visible={locationPermissionModal} onClose={() => { setlocationPermissionModal(false) }} >
                <ModalPattern1
                  setValue={setlocationPermissionModal}
                  heading={'Background Location Access'}
                  msg={'We need to access your location in the background to update your location while delivering order. Please allow "Always" permission.'}
                  noOp={() => { setlocationPermissionModal(false) }}
                  btnTittle={"Allow"}
                  noOpTitle={'Close'}
                  OnPress={async () => {
                    askForLocation()
                  }}
                />
              </AnimatedModal>
            </View>
          )}

          {(newUpdate && TutorialModal == false) && (
            <AnimatedModal visible={newUpdate} onClose={() => dispatch(setNewUpdate())} >
              <ModalPattern3 setValue={() => dispatch(setNewUpdate())} />
            </AnimatedModal>
          )}


          {TutorialModal && (
            <AnimatedModal visible={TutorialModal} onClose={() => { setTutorialModal(false); }} >
              <ModalPattern2 setValue={setTutorialModal} />
            </AnimatedModal>
          )}

        </ScalingDrawer >
      </View >
    </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container1: {
    flex: 1
  },
  modalStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff"
  },
  blocktext: {
    margin: 0,
    color: "#e54e5b"
  },
  container2: {
    flex: 1,
    backgroundColor: "white",
    marginTop: verticalScale(30),
  },
  ripple: {
    marginTop: verticalScale(20),
    margin: 0
  },
  BidSheetCloseButtonView: {
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  BidSheetCloseButtonText: {
    padding: 10,
    backgroundColor: "white",
    color: colors.theme
  },

  logoImg: { marginTop: verticalScale(25) },
  card1Heading: { marginTop: verticalScale(5), margin: 0, },
  card1Heading1: { marginTop: verticalScale(10), margin: 0, marginBottom: verticalScale(30) },
  card1View: {
    width: '100%', justifyContent: 'space-around',
  },
  card1View1: {
    width: '100%',
  },
  card1ImgBg: { width: moderateScale(150), height: verticalScale(150), justifyContent: 'space-around', paddingVertical: verticalScale(25), },
  card1ImgBg1: { width: '100%', height: verticalScale(150), justifyContent: 'space-around', paddingVertical: verticalScale(25), },
  card1ImgView: { flexDirection: 'row', paddingTop: verticalScale(5), paddingLeft: moderateScale(8) },
  card1ImgView1: { paddingTop: verticalScale(5), paddingLeft: moderateScale(8) },
  card1Accept: { paddingBottom: verticalScale(5), },
  arrowImg: { width: moderateScale(15), height: verticalScale(15), tintColor: 'red', },
  card1Num: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: verticalScale(20) },
  card1Number: { textAlign: "center", color: '#000' },
  card1Number1: { color: '#000' },
  card2: { marginTop: verticalScale(20), margin: 0 },
  card2NoOngoin: { textAlign: "center", lineHeight: 30, padding: moderateScale(10) },
  card2Check: { color: "#fff", fontWeight: "bold" },
  bgLocationModal: { width: width, height: height, position: 'absolute', zIndex: 8888888 },
  paymentCard: {
    width: '90%',
    alignSelf: "center",
    height: verticalScale(200),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 5,
  },
  paymentCard1: {
    width: '100%',
    height: '100%',
  },
  PayOutIcons: {
    height: verticalScale(25),
    width: verticalScale(25),
  },
  image: {
    height: verticalScale(15),
    width: verticalScale(15),
  },
  paymentamount: {
    color: colors.theme,
    marginBottom: 15
  },
  paymentDetails: {
    color: colors.black,
  },
  paymentDetails1: {
    color: colors.blackOpacity40,
  },
  mainView: {
    paddingLeft: moderateScale(20),
    marginTop: verticalScale(25),
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '90%'
  },
  totalbox: {
    width: moderateScale(110),
    height: verticalScale(70),
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.blackOpacity15,
    borderWidth: 2,
    borderRadius: 15,
    marginRight: 10
  },
  totaltip: {
    width: moderateScale(90),
    height: verticalScale(70),
    backgroundColor: '#f3f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.blackOpacity15,
    borderWidth: 2,
    borderRadius: 15
  },
  spacing: { marginRight: moderateScale(-20) },
  infoView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  infoIconImg: {
    width: moderateScale(13),
    height: verticalScale(13),
    marginRight: moderateScale(2)
  }
});
