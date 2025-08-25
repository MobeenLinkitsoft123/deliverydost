import React, { useState, useEffect, useRef } from "react";
import { View, Image, Dimensions, AppState, Platform, PermissionsAndroid, Alert, Linking, TouchableOpacity, Text, ScrollView, } from "react-native";

import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import LottieView from "lottie-react-native";
import MapViewDirections from "react-native-maps-directions";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { EventRegister } from "react-native-event-listeners";
import { useIsFocused } from "@react-navigation/native";
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { GOOGLE_API } from "@env"

import { whole } from "../../../../assets/styling/stylesheet";
import MapStyles from "./MapStyles";
import MapHeader from "../../../../Components/MapHeader/MapHeader";
import OrdersTrails from "./OrdersTrails";
import MapModals from "../../../../Components/Modals/Modals/MapModals";

import { locationPermission } from "../../../../utils/helperFunctions";
import { GetCurrentOrderDetails, MartOrderNextStep, UpDateRiderCordinates, FinishRide, StartRideFirst, UpdaeAcknowledgeStatus, GetCurrentOrderDetailsBackground } from "../../../../Store/Action/RestaurantFunctions";
import ModalPattern1 from "../../../../Components/Modals/Modals/ModalPattern1";
import CompleteOrderDetailModal from '../../../../Components/Modals/Modals/CompleteOrderDetailModal'
import CameraView from "../../../../Components/CameraView/CameraView";

import imagePath from "../../../../constants/imagePath";
import AnimatedModal from "../../../../Components/AnimtedModal/AnimatedModal";
import { height, width } from "../../../../styles/responsiveSize";
import OrderTrailsStyles from "./OrderTrailsStyles";
import WaitingBidView from "./WaitingBidView";
import OrderStep from "./OrderStep";
import AckModalView from "./AckModalView";

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function MartOrder() {

  const mapRef = useRef();
  const routeData = useRoute();
  const UserMark = useRef();
  const RiderMark = useRef();
  const navigation = useNavigation();
  const isFocus = useIsFocused()
  const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);

  const [OrderStatus, SetOrderStatus] = useState("startride-start");
  const [orderDetails, setorderDetails] = useState({});
  const [activeTab, setActiveTab] = useState(routeData?.params?.OrderId);
  const [bidViewData, setBidViewData] = useState();
  const [allOrders, setAllOrders] = useState([]);

  const [ScreenMode, SetScreenMode] = useState(false);
  const [loading, SetLoading] = useState(true);

  const [loading2, setLoading2] = useState(false);
  const [durationData, setdurationData] = useState("");
  const [orderDeliverModal, setorderDeliverModal] = useState(false)
  const [orderCancelByAdmin, setorderCancelByAdmin] = useState(false);
  const [cameraModal, setCameraModal] = useState(false);
  const [showImageFullPath, setShowImageFullPath] = useState()
  const [RiderNote, setRiderNote] = useState('')

  const [acknowledgeModalView, setAcknowledgeModalView] = useState(false);
  const [acknowledgeModalData, setAcknowledgeModalData] = useState(false);

  const [modalMsg, setmodalmsg] = useState("");
  const [errorModal, seterrorModal] = useState(false);
  const [mapModalshow, setmapModal] = useState(false)
  const [isMapMoving, setIsMapMoving] = useState(true);
  const [OrderModal, setOrderModal] = useState(false);
  const [changeState, SetChangeState] = useState(false)
  const [Orderupdate, setOrderupdate] = useState(false)

  const [state, setState] = useState({
    curLoc: {
      latitude: 24.954062410986143,
      longitude: 67.20588879624022,
    },
    destinationCords: {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 30.7046,
      longitude: 77.1025,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    time: 0,
    distance: 0,
    heading: 0,
  });



  useEffect(() => {
    setmapModal(false)
  }, [isFocus]);

  useEffect(() => {
    const OrderCancelByAdmin = EventRegister.addEventListener("OrderCancel", (data) => {

      const showModal = () => {
        seterrorModal(true)
        setmodalmsg("Your order has been cancelled by admin.")
      }
      GetCurrentOrderDetails(
        () => { },
        UserDetail,
        TokenId,
        setorderDetails,
        SetOrderStatus,
        curLoc,
        setdurationData,
        setmodalmsg,
        seterrorModal,
        setorderCancelByAdmin,
        setRiderNote,
        navigation,
        setAllOrders,
        activeTab,
        setActiveTab,
        () => { },
        () => { },
        () => { },
        setBidViewData,
        bidViewData,
        showModal
      );
    });
    const GetUpdatedStatus = EventRegister.addEventListener("ONBIDREJECTED", (data) => {
      GetCurrentOrderDetails(
        () => { },
        UserDetail,
        TokenId,
        setorderDetails,
        SetOrderStatus,
        curLoc,
        setdurationData,
        setmodalmsg,
        seterrorModal,
        setorderCancelByAdmin,
        setRiderNote,
        navigation,
        setAllOrders,
        activeTab,
        setActiveTab,
        () => { },
        () => { },
        () => { },
        setBidViewData
      );
    });
    const NewBidsOrderAccept = EventRegister.addEventListener("NewBidsOrderAccepted", (data) => {
      setOrderupdate(true)
      GetCurrentOrderDetailsBackground(
        setLoading2,
        UserDetail,
        TokenId,
        setorderDetails,
        SetOrderStatus,
        setdurationData,
        setmodalmsg,
        seterrorModal,
        setorderCancelByAdmin,
        setRiderNote,
        navigation,
        setAllOrders,
        activeTab,
        setActiveTab,
        setAcknowledgeModalView,
        setBidViewData,
        bidViewData
      );
    });
    return () => {
      EventRegister?.removeEventListener(OrderCancelByAdmin);
      EventRegister?.removeEventListener(GetUpdatedStatus);
      EventRegister?.removeEventListener(NewBidsOrderAccept);

    };
  }, []);


  useEffect(() => {
    const orderBidUpdated = EventRegister.addEventListener("orderBidUpdated", (data) => {
      GetCurrentOrderDetails(
        () => { },
        UserDetail,
        TokenId,
        setorderDetails,
        SetOrderStatus,
        curLoc,
        setdurationData,
        setmodalmsg,
        seterrorModal,
        setorderCancelByAdmin,
        setRiderNote,
        navigation,
        setAllOrders,
        activeTab,
        () => { },
        () => { },
        () => { },
        () => { },
        setBidViewData
      );
    });

    const RefereshOnOrderAssign = EventRegister.addEventListener("HomeRefereshOnOrderAssign", (data) => {
      GetCurrentOrderDetails(
        SetLoading,
        UserDetail,
        TokenId,
        setorderDetails,
        SetOrderStatus,
        curLoc,
        setdurationData,
        setmodalmsg,
        seterrorModal,
        setorderCancelByAdmin,
        setRiderNote,
        navigation,
        setAllOrders,
        activeTab,
        setActiveTab,
        () => { },
        () => { },
        () => { },
        setBidViewData
      );
    });

    return () => {
      EventRegister?.removeEventListener(orderBidUpdated);
      EventRegister?.removeEventListener(RefereshOnOrderAssign);
    };
  }, []);

  const CameraSelect = (cameraObj, setLoading) => {
    setCameraModal(false)
    const newCam = {
      uri: cameraObj?.uri,
      fileName: cameraObj?.name,
      path: cameraObj?.uri,
      type: "IMAGE/JPG"
    }
    setShowImageFullPath(newCam);
    setLoading && setLoading(false)
  }

  const {
    curLoc,
    time,
    distance,
    destinationCords,
    isLoading,
    coordinate,
    heading,
  } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const changedState = () => {
    if (isMapMoving == true) {
      setIsMapMoving(false)
    } else {
      setIsMapMoving(true)
    }
  }
  const mapMoving = (lat, lng) => {
    if (isMapMoving == true) {
      AnimateDriverLocation(lat, lng)
    }
  }
  const AnimateDriverLocation = async (lat, lng) => {
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      // const { latitude, longitude, heading } = await getCurrentLocation();

      if (Platform.OS === "android") {
        mapRef?.current?.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0041,
          },
          500
        );
      } else {
        mapRef?.current?.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
          },
          1000
        );
      }
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS == 'ios') {
      const iosCamera = await request(PERMISSIONS.IOS.CAMERA);
      if (iosCamera === RESULTS.GRANTED) {
        setCameraModal(true)
      } else {
        Alert.alert("Camera Permission", "Please grant Foodosti Driver app permission to access your device's camera", [
          {
            text: "Cancel",
            onPress: () => { },
            style: "cancel",
          },
          { text: "Settings", onPress: () => Linking.openSettings() },
        ]);
      }

    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: "Please grant Foodosti Driver app permission to access your device's camera",
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setCameraModal(true)
        } else {
          Alert.alert("Camera Permission", "Please grant Foodosti Driver app permission to access your device's camera", [
            {
              text: "Cancel",
              onPress: () => { },
              style: "cancel",
            },
            { text: "Settings", onPress: () => Linking.openSettings() },
          ]);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    SetLoading(true);
    GetCurrentOrderDetails(
      SetLoading,
      UserDetail,
      TokenId,
      setorderDetails,
      SetOrderStatus,
      curLoc,
      setdurationData,
      setmodalmsg,
      seterrorModal,
      setorderCancelByAdmin,
      setRiderNote,
      navigation,
      setAllOrders,
      activeTab,
      () => { },
      () => { },
      () => { },
      () => { },
      setBidViewData
    );

  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (location) => {
        updateState({
          heading: location.coords.heading,
          curLoc: { latitude: location.coords.latitude, longitude: location.coords.longitude },
          coordinate: new AnimatedRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }),
        });
        mapMoving(location.coords.latitude, location.coords.longitude)
        UpDateRiderCordinates(UserDetail, TokenId, location.coords.latitude, location.coords.longitude);
      },
      (error) => {
        SetLoading(false);
        console.error(error)
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 200, // Set your distance filter here in meters
      }
    );

    return () => {
      // Clear the watchPosition when the component unmounts
      Geolocation.clearWatch(watchId);
    };
  }, [isMapMoving])

  const fetchTime = (d, t) => {
    updateState({
      distance: d,
      time: t,
    });
  };

  const OnSuccess = (OID, setAcknowledgeModalView, setAcknowledgeModalData, setLodaer) => {
    GetCurrentOrderDetails(
      setLoading2,
      UserDetail,
      TokenId,
      setorderDetails,
      SetOrderStatus,
      curLoc,
      setdurationData,
      setmodalmsg,
      seterrorModal,
      setorderCancelByAdmin,
      setRiderNote,
      navigation,
      setAllOrders,
      OID ? OID : activeTab,
      () => { },
      setAcknowledgeModalView,
      setAcknowledgeModalData,
      setLodaer,
      setBidViewData
    );
  };

  const HandleNextStep = () => {
    MartOrderNextStep(
      setLoading2,
      OrderStatus,
      OnSuccess,
      orderDetails,
      durationData,
      curLoc,
      setdurationData,
      SetOrderStatus,
      navigation,
      TokenId,
      setmodalmsg,
      seterrorModal,
      setorderDeliverModal
    );
  };

  const FinishRide1 = () => {
    FinishRide(
      setLoading2,
      OrderStatus,
      OnSuccess,
      orderDetails,
      durationData,
      curLoc,
      setdurationData,
      SetOrderStatus,
      UserDetail,
      TokenId,
      setmodalmsg,
      seterrorModal,
    );
  };

  useEffect(() => {
    if (changeState == true) {
      SetChangeState(false)
      GetCurrentOrderDetailsBackground(
        setLoading2,
        UserDetail,
        TokenId,
        setorderDetails,
        SetOrderStatus,
        setdurationData,
        setmodalmsg,
        seterrorModal,
        setorderCancelByAdmin,
        setRiderNote,
        navigation,
        setAllOrders,
        activeTab,
        setActiveTab,
        setAcknowledgeModalView,
        setBidViewData,
        bidViewData
      );
    }

  }, [changeState]);

  useEffect(() => {
    const handleChange = AppState.addEventListener("change", (changedState) => {
      if (changedState == "active") {
        SetChangeState(true)
      }
    });

    return () => handleChange.remove();
  }, []);


  useEffect(() => {
    if (Orderupdate == true) {
      setOrderupdate(false)
      GetCurrentOrderDetailsBackground(
        setLoading2,
        UserDetail,
        TokenId,
        setorderDetails,
        SetOrderStatus,
        setdurationData,
        setmodalmsg,
        seterrorModal,
        setorderCancelByAdmin,
        setRiderNote,
        navigation,
        setAllOrders,
        activeTab,
        setActiveTab,
        setAcknowledgeModalView,
        setBidViewData,
        bidViewData
      );
    }
  }, [Orderupdate])


  useEffect(() => {
    const GetUpdatedStatus = EventRegister.addEventListener(
      "OrderStatusUpdate",
      (data) => {
        setOrderupdate(true)
      }
    );
    return () => {
      EventRegister?.removeEventListener(GetUpdatedStatus);
    };
  }, []);

  const latitude = OrderStatus == "wdispatch" || OrderStatus == 'startride' || OrderStatus == "startride-start" ? orderDetails?.locationOfRestaurant?.lat : orderDetails?.locationOfUsers?.latitude;
  const longitude = OrderStatus == "wdispatch" || OrderStatus == 'startride' || OrderStatus == "startride-start" ? orderDetails?.locationOfRestaurant?.long : orderDetails?.locationOfUsers?.longitude;

  const animateLocation = () => {
    try {
      if (Platform.OS === 'android') {
        mapRef.current.animateToRegion({
          latitude: curLoc?.latitude,
          longitude: curLoc?.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }, 500)
      } else {

        mapRef.current.animateToRegion({
          latitude: curLoc?.latitude,
          longitude: curLoc?.longitude
        }, 1000)
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    const unacknowledgedOrder = allOrders.find(order => order.isAcknowledged === 0);
    if (unacknowledgedOrder) {
      setAcknowledgeModalData(unacknowledgedOrder);
      setAcknowledgeModalView(true);
    }
  }, [allOrders, acknowledgeModalView]);

  const handleAcknowledge = (navigateToJob, setLoading, setOrderDetail) => {
    UpdaeAcknowledgeStatus(acknowledgeModalData.OrderID, setAcknowledgeModalView, setAcknowledgeModalData,
      TokenId, setmodalmsg, seterrorModal, setAllOrders, setActiveTab, activeTab, setBidViewData,
      navigateToJob, setLoading, setOrderDetail)
  };

  const selectTabFunction = async (val) => {
    setActiveTab(val?.OrderId || val?.OrderID);
    val?.BidStatus == 0 ? () => { } : await OnSuccess(val?.OrderId || val?.OrderID);
    setBidViewData(val?.OrderId ? val : null)
    setShowImageFullPath()
  }

  // useEffect(() => {
  //   const GetUpdatedStatus = EventRegister.addEventListener("BibAcceptedOnWaitScreen", async (data) => {
  //     await setActiveTab(allOrders[0]?.OrderID)
  //     GetCurrentOrderDetailsOnFinish(
  //       setLoading2,
  //       UserDetail,
  //       TokenId,
  //       setorderDetails,
  //       SetOrderStatus,
  //       setdurationData,
  //       setmodalmsg,
  //       seterrorModal,
  //       setorderCancelByAdmin,
  //       setRiderNote,
  //       navigation,
  //       setAllOrders,
  //       activeTab,
  //       setActiveTab,
  //     );
  //   });
  //   return () => {
  //     EventRegister?.removeEventListener(GetUpdatedStatus);
  //   };
  // }, []);


  // console.log("bidViewData------------------------------------", bidViewData)
  return (
    <>
      <View style={MapStyles.container}>

        {loading == true ? (
          <View style={MapStyles.lodercontainer}>
            <LottieView
              source={imagePath.LocationLoading}
              loop={true}
              autoPlay={true}
              style={MapStyles.mt20w100}
              speed={1}
            />
          </View>
        ) : (
          <>
            {!cameraModal && (
              <>
                <MapHeader animateLocation={animateLocation} />

                <View style={OrderTrailsStyles.container1}>
                  <View style={OrderTrailsStyles.tabContainer}>
                    <ScrollView horizontal={true}>
                      {allOrders?.map((val, ind) => {
                        return (
                          <TouchableOpacity
                            style={[OrderTrailsStyles.tab, (activeTab == val?.OrderID || activeTab == val?.OrderId) && OrderTrailsStyles.activeTab]}
                            onPress={() => selectTabFunction(val)} >
                            <View style={OrderTrailsStyles.tabContent}>
                              {val?.OrderId && (<Image source={imagePath.Orderwaiting} resizeMode="contain" style={OrderTrailsStyles.BtnImg} />)}
                              <Text style={[OrderTrailsStyles.tabText, (activeTab == val?.OrderID || activeTab == val?.OrderId) && OrderTrailsStyles.activeTabText]}>ID#{val?.OrderID || val?.OrderId}</Text>
                            </View>
                          </TouchableOpacity>

                        )
                      })}
                    </ScrollView>
                  </View>
                  {!bidViewData?.OrderId && OrderStatus && <OrderStep OrderStatus={OrderStatus} />}
                </View>

                {bidViewData?.OrderId ?
                  <WaitingBidView bidViewData={bidViewData} coordinate={JSON.stringify(coordinate)} />
                  :
                  <OrdersTrails
                    OrderStatus={OrderStatus}
                    SetOrderStatus={SetOrderStatus}
                    ScreenMode={ScreenMode}
                    SetScreenMode={SetScreenMode}
                    HandleNextStep={() => HandleNextStep()}
                    FinishRide1={() => FinishRide1()}
                    orderDetails={orderDetails}
                    curLoc={curLoc}
                    setmapModal={setmapModal}
                    changedState={changedState}
                    animateLocation={animateLocation}
                    setOrderModal={setOrderModal}
                    setCameraModal={setCameraModal}
                    cameraModal={cameraModal}
                    CameraSelect={CameraSelect}
                    showImageFullPath={showImageFullPath}
                    setShowImageFullPath={setShowImageFullPath}
                    setLoader={setLoading2}
                    loader={loading2}
                    errorModal={seterrorModal}
                    modalMsg={setmodalmsg}
                    StartRideFirst={() => StartRideFirst(setLoading2, OnSuccess, orderDetails, TokenId)}
                    requestCameraPermission={requestCameraPermission}
                  />
                }

              </>
            )}


            {!(bidViewData?.OrderId) && (<MapView
              provider={MapView.PROVIDER_GOOGLE}
              style={!ScreenMode ? whole.map : [whole.map, { zIndex: 999 }]}
              ref={mapRef}
              initialRegion={{
                ...curLoc,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              showsUserLocation={false}
              followUserLocation >
              {orderDetails?.locationOfRestaurant?.lat && (
                <Marker.Animated
                  ref={UserMark}
                  coordinate={{
                    latitude:
                      OrderStatus == "wdispatch" || OrderStatus == "startride" || OrderStatus == "startride-start"
                        ? orderDetails?.locationOfRestaurant?.lat
                        : orderDetails?.locationOfUsers?.latitude,
                    longitude:
                      OrderStatus == "wdispatch" || OrderStatus == "startride" || OrderStatus == "startride-start"
                        ? orderDetails?.locationOfRestaurant?.long
                        : orderDetails?.locationOfUsers?.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                  title={"Reach Here"}
                  identifier={"mk1"}
                >
                  <Image source={(OrderStatus == "wdispatch" || OrderStatus == "startride") ? imagePath.mapIcon2 : imagePath.mapIcon3}
                    style={MapStyles.w35h35}
                    resizeMode="contain"
                  />
                </Marker.Animated>
              )}

              <Marker.Animated
                ref={RiderMark}
                coordinate={{
                  ...curLoc,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
                title={`${UserDetail?.Firstname} you are here.`}>
                <Image source={imagePath.mapIcon1} style={MapStyles.w35h35} resizeMode="contain" />
              </Marker.Animated>

              {orderDetails?.locationOfRestaurant?.lat && (
                <MapViewDirections
                  origin={curLoc}
                  resetOnChange={false}
                  optimizeWaypoints={true}
                  splitWaypoints={true}
                  destination={{
                    latitude:
                      OrderStatus == "wdispatch" || OrderStatus == "startride" || OrderStatus == "startride-start"
                        ? orderDetails?.locationOfRestaurant?.lat
                        : orderDetails?.locationOfUsers?.latitude,
                    longitude:
                      OrderStatus == "wdispatch" || OrderStatus == "startride" || OrderStatus == "startride-start"
                        ? orderDetails?.locationOfRestaurant?.long
                        : orderDetails?.locationOfUsers?.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                  apikey={`${GOOGLE_API}`}
                  strokeWidth={3}
                  strokeColor="#d33d3f"
                  onStart={(params) => {
                  }}
                  onReady={(result) => {
                    fetchTime(result.distance, result.duration);
                  }}
                  onError={(errorMessage) => {
                    console.log("MapViewDirections", errorMessage);
                  }}
                />
              )}
            </MapView>)}

          </>
        )}


        {mapModalshow && <MapModals value={mapModalshow} setValue={setmapModal} latitude={latitude} longitude={longitude} />}

        {cameraModal && (
          <CameraView CameraSelect={CameraSelect} setCameraModal={setCameraModal} index={INDEX = 0} />
        )}

      </View >


      {OrderModal && (
        <View style={{ width: width, height: height, position: 'absolute', zIndex: 8888888 }}>
          <AnimatedModal visible={OrderModal} onClose={() => { setOrderModal(false) }} >
            <CompleteOrderDetailModal setValue={setOrderModal} RiderNote={RiderNote} orderDetails={orderDetails} />
          </AnimatedModal>
        </View>
      )
      }




      {
        loading2 == true && cameraModal == false && (
          <View style={{ width: width, height: height, position: 'absolute', zIndex: 8888888 }}>
            <AnimatedModal visible={loading2 == true && cameraModal == false} onClose={() => { setLoading2(false) }} >
              <LottieView
                source={imagePath.MapLoader}
                loop={true}
                autoPlay={true}
                style={MapStyles.mt20w100}
                speed={1}
              />
            </AnimatedModal>
          </View>
        )
      }

      {
        errorModal && (
          <View style={{ width: width, height: height, position: 'absolute', zIndex: 8888888 }}>
            <AnimatedModal visible={errorModal} onClose={() => { seterrorModal(false) }} >
              <ModalPattern1
                setValue={seterrorModal}
                heading={modalMsg}
                btnTittle={"Okay"}
                OnPress={() => {
                  setOrderModal(false)
                  modalMsg !== "Please upload proof image." && OnSuccess()
                  setmodalmsg("");
                  seterrorModal(false);
                  if (modalMsg === "Your order has been cancelled by admin." && allOrders?.length == 0) {
                    navigation.goBack()
                  }
                }}
              />
            </AnimatedModal>
          </View>
        )
      }


      {
        orderDeliverModal && (
          <View style={{ width: width, height: height, position: 'absolute', zIndex: 8888888 }}>
            <AnimatedModal visible={orderDeliverModal} onClose={() => { setorderDeliverModal(false) }} >
              <ModalPattern1
                setValue={setorderDeliverModal}
                heading={'Order completed successfully'}
                btnTittle={"Done"}
                OnPress={async () => {
                  await setorderDeliverModal(false);
                  allOrders?.length > 0 && await GetCurrentOrderDetailsBackground(
                    setLoading2,
                    UserDetail,
                    TokenId,
                    setorderDetails,
                    SetOrderStatus,
                    setdurationData,
                    setmodalmsg,
                    seterrorModal,
                    setorderCancelByAdmin,
                    setRiderNote,
                    navigation,
                    setAllOrders,
                    activeTab,
                    setActiveTab,
                    setAcknowledgeModalView,
                    setBidViewData,
                    bidViewData
                  );
                  allOrders?.length > 0 ? () => { } : navigation.goBack();
                  setShowImageFullPath()
                }}
              />
            </AnimatedModal>
          </View>
        )
      }

      {orderCancelByAdmin && (
        <View style={{ width: width, height: height, position: 'absolute', zIndex: 8888888 }}>
          <AnimatedModal visible={orderCancelByAdmin} onClose={() => { setorderCancelByAdmin(false) }} >
            <ModalPattern1
              setValue={setorderCancelByAdmin}
              heading={'Order canceled by admin'}
              btnTittle={"Okay"}
              OnPress={() => {
                setOrderModal(false)
                setorderCancelByAdmin(false);
                OnSuccess()
                if (allOrders?.length == 0) {
                  navigation.goBack();
                }
              }}
            />
          </AnimatedModal>
        </View>
      )
      }

      {acknowledgeModalView && (
        <View style={{ width: width, height: height, position: 'absolute', zIndex: 8888888 }}>
          <AnimatedModal visible={acknowledgeModalView} onClose={() => { setAcknowledgeModalView(false) }} >
            <AckModalView currentOrderData={acknowledgeModalData} coordinate={coordinate} TokenId={TokenId} UserDetail={UserDetail} handleAcknowledge={handleAcknowledge} />
          </AnimatedModal>
        </View>
      )
      }


    </>
  );
}

export default MartOrder;


