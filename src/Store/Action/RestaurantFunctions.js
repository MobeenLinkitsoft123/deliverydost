import { Alert } from "react-native";

import { GOOGLE_API, API_URL } from "@env"
import Geolocation from "react-native-geolocation-service";

import { GET_METHOD_AUTH, POST_METHOD, PUT_METHOD, PUT_METHOD_AUTH } from "../../utils/ApiCallingMachnisem";

import { getDistance } from "../../utils/helperFunctions";
import { getISOFormattedDateWithGMT } from "./AppFunctions";
import AllOrderStatus from "../../utils/AllOrderStatus";
import { encryptVal } from "../../utils/Crypto";

const GetCurrentOrderDetails = async (
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
  activeOrderId,
  setActiveTab,
  setAcknowledgeModalView,
  setAcknowledgeModalData,
  setLodaer,
  setBidViewData,
  bidViewData,
  showModal
) => {
  try {
    SetLoading(true);

    GET_METHOD_AUTH(`/api/V5DmsOrder?Ridrid=${UserDetail?.Id}`, TokenId)
      .then(async (result) => {
        if (result?.message == "No active deliveries currently. Stay online to receive new orders." && result?.Orders?.length == undefined && result?.Bids?.length == undefined) {
          navigation.goBack()
        }

        setorderDetails && setorderDetails(result?.Orders?.length > 0 ? { OrderId: result?.Orders[0]?.OrderID } : { OrderId: result?.Bids[0]?.OrderId })
        setBidViewData && setBidViewData(result?.Orders?.length > 0 ? null : result?.Bids[0])
        setAllOrders && setAllOrders([...result?.Orders, ...result?.Bids])
        setAcknowledgeModalView && setAcknowledgeModalView(false)
        setLodaer && setLodaer(false)
        // const currentStatus = result?.Orders[0]?.?.OrderStatus;
        const currentOrder = result?.Orders && result?.Orders?.filter((data) => data.OrderID == activeOrderId)

        if (currentOrder[0]?.Status == 0 && result?.message == 'No active deliveries currently. Stay online to receive new orders.') {
          try {
            navigation && navigation.goBack()
          } catch (error) {
          }
          SetLoading(false);
        } else {
          let Details = {
            Status: currentOrder[0]?.Status,
            CurrentStatus: currentOrder[0]?.OrderStatus,
            OrderId: currentOrder[0]?.OrderID,
            Type: currentOrder[0]?.Type,
            UserId: UserDetail.Id,
            Datetime: currentOrder[0]?.Datetime,
            tip: currentOrder[0]?.tip || 0,
          };
          SetLoading(false);
          setRiderNote && setRiderNote(currentOrder[0]?.riderNote)


          GET_METHOD_AUTH(`/api/Order?oidoid=${currentOrder[0]?.OrderID}`, TokenId).then(
            async (resultt) => {
              SetLoading(true);

              showModal && showModal()
              const OrderStatus = resultt?.status;
              const resturantAllAddress = `, ${resultt?.vendorCity}, ${resultt?.vendorState}, ${resultt?.vendorCountry}`

              if (result?.Orders?.length > 0) {
                Geolocation.getCurrentPosition(
                  (position) => {
                    GetOrderLocationAndPayment(
                      SetLoading,
                      UserDetail,
                      TokenId,
                      setorderDetails,
                      Details,
                      {
                        latitude: position?.coords?.latitude,
                        longitude: position?.coords?.longitude,
                      },
                      setdurationData,
                      OrderStatus,
                      setmodalmsg,
                      seterrorModal,
                      resturantAllAddress
                    );
                  },
                  (error) => {
                    // See error code charts below.
                    SetLoading(false);
                    console.log(error.code, error.message);
                  },
                  { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
              } else {
                SetLoading(false);
              }


              if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRideFirst && (OrderStatus == AllOrderStatus.ChefAutoAccept || OrderStatus == AllOrderStatus.ChefAccept)) {
                SetOrderStatus("startride-start");
              }

              if (currentOrder[0]?.OrderStatus == AllOrderStatus.Reached) {
                SetOrderStatus("startride");
              }
              if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRide && OrderStatus == AllOrderStatus.RiderReachedRest) {
                SetOrderStatus("wdispatch");
              }
              if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRide && OrderStatus == AllOrderStatus.OrderDispatchChef) {
                SetOrderStatus("odispateched");
              }
              if (currentOrder[0]?.OrderStatus == AllOrderStatus.OrderDispatch && OrderStatus == AllOrderStatus.RiderStartRideToCustomer) {
                SetOrderStatus("startdelivery");
              }
              if (currentOrder[0]?.OrderStatus == AllOrderStatus.FinishRide && OrderStatus == AllOrderStatus.RiderFinishRider) {
                SetOrderStatus("fnshride");
              }
              if (currentOrder[0]?.OrderStatus == AllOrderStatus.ChefAccept && OrderStatus == AllOrderStatus.RiderFinishRider) {
                SetOrderStatus("fnshride");
              }

              if (currentOrder[0]?.OrderStatus == AllOrderStatus.CancelledByAdmin1 || OrderStatus == AllOrderStatus.CancelledByAdmin) {
                SetOrderStatus("Order cancelled by admin");
                setTimeout(() => {
                  setorderCancelByAdmin && setorderCancelByAdmin(true)
                }, 700);
              }
            }
          );

        }
      })
      .catch((err) => {
        console.error(err);
        SetLoading(false);
      });
  } catch (error) {
    console.log('error====>', error);
    setmodalmsg(error.message);
    seterrorModal(true);
    // alert(error);
    SetLoading(false);
  }
};

const GetCurrentOrderDetailsBackground = async (
  SetLoading,
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
  bidViewData,
  makeLoaderFalse
) => {
  // try {
  //   SetLoading(true);
  //   GET_METHOD_AUTH(`/api/V4DmsOrder?Ridrid=${UserDetail?.Id}`, TokenId)
  //     .then(async (result) => {

  //       if (result?.message == "No active deliveries currently. Stay online to receive new orders." && result?.Orders?.length == undefined && result?.Bids?.length == undefined) {
  //         makeLoaderFalse && makeLoaderFalse()
  //         navigation.goBack()
  //         SetLoading(false);
  //       }

  //       const IsOrder = result?.Orders?.filter((data) => data.OrderID == activeTab)
  //       const IsBid = result?.Bids?.filter((data) => data.OrderId == activeTab);

  //       setAllOrders && setAllOrders([...result?.Orders, ...result?.Bids])
  //       setAcknowledgeModalView && setAcknowledgeModalView(false)

  //       var fetchOrderId = false

  //       if (IsBid[0]?.OrderId == activeTab) {
  //         if (IsBid[0]?.OrderId) {
  //           setorderDetails({ OrderID: IsBid[0]?.OrderId });
  //           setBidViewData(IsBid[0])
  //           makeLoaderFalse();
  //           return 0
  //         } else {
  //           if (result?.Bids[0]?.OrderId) {
  //             result?.Bids?.length > 0 && setorderDetails({ OrderID: result?.Bids[0]?.OrderId })
  //             setBidViewData(result?.Orders?.length > 0 ? null : result?.Bids[0])
  //             makeLoaderFalse();
  //             return 0
  //           } else {
  //             setBidViewData(null)
  //             if (IsOrder[0]?.OrderID) {
  //               setorderDetails({ OrderID: IsOrder[0]?.OrderID })
  //               fetchOrderId = IsOrder[0]?.OrderID
  //             } else {
  //               result?.Orders?.length > 0 && setorderDetails({ OrderID: result?.Orders[0]?.OrderID })
  //               fetchOrderId = result?.Orders[0]?.OrderID
  //             }
  //           }
  //         }
  //       } else {
  //         if (IsOrder[0]?.OrderID) {
  //           setorderDetails({ OrderID: IsOrder[0]?.OrderID })
  //           fetchOrderId = IsOrder[0]?.OrderID
  //         } else {
  //           if (result?.Orders?.length > 0) {
  //             setorderDetails({ OrderID: result?.Orders[0]?.OrderID })
  //             fetchOrderId = result?.Orders[0]?.OrderID
  //           } else if (result?.Bids[0]?.OrderId) {
  //             result?.Bids?.length > 0 && setorderDetails({ OrderID: result?.Bids[0]?.OrderId })
  //             setBidViewData(result?.Orders?.length > 0 ? null : result?.Bids[0])
  //             makeLoaderFalse();
  //             return 0
  //           }
  //         }
  //       }


  //       // const currentStatus = result?.Orders[0]?.?.OrderStatus;
  //       const currentOrder = result?.Orders && result?.Orders?.filter((data) => data.OrderID == (fetchOrderId ? fetchOrderId : activeTab));


  //       if (currentOrder[0]?.Status == 0 && result?.message == 'No active deliveries currently. Stay online to receive new orders.') {
  //         try {
  //           makeLoaderFalse && makeLoaderFalse()
  //           SetLoading(false);
  //           navigation && navigation.goBack();
  //         } catch (error) {
  //           makeLoaderFalse && makeLoaderFalse()
  //           SetLoading(false);
  //         }
  //         makeLoaderFalse && makeLoaderFalse()
  //         SetLoading(false);
  //       } else {
  //         let Details = {
  //           Status: currentOrder[0]?.Status,
  //           CurrentStatus: currentOrder[0]?.OrderStatus,
  //           OrderId: currentOrder[0]?.OrderID,
  //           Type: currentOrder[0]?.Type,
  //           UserId: UserDetail.Id,
  //           Datetime: currentOrder[0]?.Datetime,
  //           tip: currentOrder[0]?.tip || 0,
  //         };

  //         setRiderNote && setRiderNote(currentOrder[0]?.riderNote)

  //         GET_METHOD_AUTH(`/api/Order?oidoid=${currentOrder[0]?.OrderID}`, TokenId).then(
  //           async (resultt) => {

  //             const OrderStatus = resultt?.status;
  //             const resturantAllAddress = `, ${resultt?.vendorCity}, ${resultt?.vendorState}, ${resultt?.vendorCountry}`

  //             if (result?.Orders?.length > 0) {
  //               Geolocation.getCurrentPosition(
  //                 (position) => {
  //                   GetOrderLocationAndPayment(
  //                     SetLoading,
  //                     UserDetail,
  //                     TokenId,
  //                     setorderDetails,
  //                     Details,
  //                     {
  //                       latitude: position?.coords?.latitude,
  //                       longitude: position?.coords?.longitude,
  //                     },
  //                     setdurationData,
  //                     OrderStatus,
  //                     setmodalmsg,
  //                     seterrorModal,
  //                     resturantAllAddress,
  //                     makeLoaderFalse
  //                   );
  //                 },
  //                 (error) => {
  //                   // See error code charts below.
  //                   console.log(error.code, error.message);
  //                 },
  //                 { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //               );
  //             } else {
  //               SetLoading(false);
  //             }


  //             if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRideFirst && (OrderStatus == AllOrderStatus.ChefAutoAccept || OrderStatus == AllOrderStatus.ChefAccept || OrderStatus == AllOrderStatus.chefInitial)) {
  //               SetOrderStatus("startride-start");
  //             }

  //             if (currentOrder[0]?.OrderStatus == AllOrderStatus.Reached) {
  //               SetOrderStatus("startride");
  //             }
  //             if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRide && OrderStatus == AllOrderStatus.RiderReachedRest && OrderStatus != AllOrderStatus.chefInitial) {
  //               SetOrderStatus("wdispatch");
  //             }
  //             if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRide && OrderStatus == AllOrderStatus.OrderDispatchChef) {
  //               SetOrderStatus("odispateched");
  //             }
  //             if (currentOrder[0]?.OrderStatus == AllOrderStatus.OrderDispatch && OrderStatus == AllOrderStatus.RiderStartRideToCustomer) {
  //               SetOrderStatus("startdelivery");
  //             }
  //             if (currentOrder[0]?.OrderStatus == AllOrderStatus.FinishRide && OrderStatus == AllOrderStatus.RiderFinishRider) {
  //               SetOrderStatus("fnshride");
  //             }
  //             if (currentOrder[0]?.OrderStatus == AllOrderStatus.ChefAccept && OrderStatus == AllOrderStatus.RiderFinishRider) {
  //               SetOrderStatus("fnshride");
  //             }

  //             if (currentOrder[0]?.OrderStatus == AllOrderStatus.CancelledByAdmin1 || OrderStatus == AllOrderStatus.CancelledByAdmin) {
  //               SetOrderStatus("Order cancelled by admin");
  //               setTimeout(() => {
  //                 setorderCancelByAdmin && setorderCancelByAdmin(true)
  //               }, 700);
  //             }
  //           }
  //         );

  //       }
  //     })
  //     .catch((err) => {
  //       console.log('err', err);
  //       console.error(err);
  //       SetLoading(false);
  //     });
  // } catch (error) {
  //   console.log('error', error);
  //   setmodalmsg(error.message);
  //   seterrorModal(true);
  //   // alert(error);
  //   SetLoading(false);
  // }

  try {
    SetLoading(true);
    GET_METHOD_AUTH(`/api/V5DmsOrder?Ridrid=${UserDetail?.Id}`, TokenId)
      .then(async (result) => {
        if (result?.message == "No active deliveries currently. Stay online to receive new orders." && result?.Orders?.length == undefined) {
          makeLoaderFalse && makeLoaderFalse()
          navigation.goBack()
          SetLoading(false);
        } else {
          const IsOrder = result?.Orders?.filter((data) => data.OrderID == activeTab)
          const IsBid = result?.Bids?.filter((data) => data.OrderId == activeTab);

          setAllOrders && setAllOrders([...result?.Orders, ...result?.Bids])
          setAcknowledgeModalView && setAcknowledgeModalView(false)


          if (IsBid[0]?.OrderId == activeTab) {
            if (IsBid[0]?.OrderId) {
              setorderDetails({ OrderID: IsBid[0]?.OrderId });
              setBidViewData(IsBid[0])
              makeLoaderFalse();
              return 0
            } else {
              if (result?.Bids[0]?.OrderId) {
                result?.Bids?.length > 0 && setorderDetails({ OrderID: result?.Bids[0]?.OrderId })
                setBidViewData(result?.Orders?.length > 0 ? null : result?.Bids[0])
                makeLoaderFalse();
                return 0
              } else {
                setBidViewData(null)
                if (IsOrder[0]?.OrderID) {
                  setorderDetails({ OrderID: IsOrder[0]?.OrderID })
                  fetchOrderId = IsOrder[0]?.OrderID
                } else {
                  result?.Orders?.length > 0 && setorderDetails({ OrderID: result?.Orders[0]?.OrderID })
                  fetchOrderId = result?.Orders[0]?.OrderID
                }
              }
            }
          } else {
            if (IsOrder[0]?.OrderID) {
              setorderDetails({ OrderID: IsOrder[0]?.OrderID })
              fetchOrderId = IsOrder[0]?.OrderID
            } else {
              if (result?.Orders?.length > 0) {
                setorderDetails({ OrderID: result?.Orders[0]?.OrderID })
                fetchOrderId = result?.Orders[0]?.OrderID
              } else if (result?.Bids[0]?.OrderId) {
                result?.Bids?.length > 0 && setorderDetails({ OrderID: result?.Bids[0]?.OrderId })
                setBidViewData(result?.Orders?.length > 0 ? null : result?.Bids[0])
                makeLoaderFalse();
                return 0
              }
            }
          }

          var fetchOrderId = false

          if (IsOrder[0]?.OrderID) {
            setorderDetails({ OrderID: IsOrder[0]?.OrderID })
            fetchOrderId = IsOrder[0]?.OrderID
          } else {
            if (result?.Orders?.length > 0) {
              setorderDetails({ OrderID: result?.Orders[0]?.OrderID })
              fetchOrderId = result?.Orders[0]?.OrderID
            }
          }


          // const currentStatus = result?.Orders[0]?.?.OrderStatus;
          const currentOrder = result?.Orders && result?.Orders?.filter((data) => data.OrderID == (fetchOrderId ? fetchOrderId : activeTab));


          if (currentOrder[0]?.Status == 0 && result?.message == 'No active deliveries currently. Stay online to receive new orders.') {
            try {
              makeLoaderFalse && makeLoaderFalse()
              SetLoading(false);
              navigation && navigation.goBack();
            } catch (error) {
              makeLoaderFalse && makeLoaderFalse()
              SetLoading(false);
            }
            makeLoaderFalse && makeLoaderFalse()
            SetLoading(false);
          } else {
            let Details = {
              Status: currentOrder[0]?.Status,
              CurrentStatus: currentOrder[0]?.OrderStatus,
              OrderId: currentOrder[0]?.OrderID,
              Type: currentOrder[0]?.Type,
              UserId: UserDetail.Id,
              Datetime: currentOrder[0]?.Datetime,
              tip: currentOrder[0]?.tip || 0,
              martOrderId: currentOrder[0]?.martOrderId || 0,
              orderName: currentOrder[0]?.orderName || '',
            };

            setRiderNote && setRiderNote(currentOrder[0]?.riderNote)

            GET_METHOD_AUTH(`/api/Order?oidoid=${currentOrder[0]?.OrderID}`, TokenId).then(
              async (resultt) => {

                const OrderStatus = resultt?.status;
                const resturantAllAddress = `, ${resultt?.vendorCity}, ${resultt?.vendorState}, ${resultt?.vendorCountry}`

                if (result?.Orders?.length > 0) {
                  Geolocation.getCurrentPosition(
                    (position) => {
                      GetOrderLocationAndPayment(
                        SetLoading,
                        UserDetail,
                        TokenId,
                        setorderDetails,
                        Details,
                        {
                          latitude: position?.coords?.latitude,
                          longitude: position?.coords?.longitude,
                        },
                        setdurationData,
                        OrderStatus,
                        setmodalmsg,
                        seterrorModal,
                        resturantAllAddress,
                        makeLoaderFalse
                      );
                    },
                    (error) => {
                      // See error code charts below.
                      console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                  );
                } else {
                  SetLoading(false);
                }

                if (currentOrder[0]?.Type == 'Chef') {
                  if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRideFirst && (OrderStatus == AllOrderStatus.ChefAutoAccept || OrderStatus == AllOrderStatus.ChefAccept || OrderStatus == AllOrderStatus.chefInitial)) {
                    SetOrderStatus("startride-start");
                  }

                  if (currentOrder[0]?.OrderStatus == AllOrderStatus.Reached) {
                    SetOrderStatus("startride");
                  }
                  if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRide && OrderStatus == AllOrderStatus.RiderReachedRest && OrderStatus != AllOrderStatus.chefInitial) {
                    SetOrderStatus("wdispatch");
                  }
                  if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRide && OrderStatus == AllOrderStatus.OrderDispatchChef) {
                    SetOrderStatus("odispateched");
                  }
                  if (currentOrder[0]?.OrderStatus == AllOrderStatus.OrderDispatch && OrderStatus == AllOrderStatus.RiderStartRideToCustomer) {
                    SetOrderStatus("startdelivery");
                  }
                  if (currentOrder[0]?.OrderStatus == AllOrderStatus.FinishRide && OrderStatus == AllOrderStatus.RiderFinishRider) {
                    SetOrderStatus("fnshride");
                  }
                  if (currentOrder[0]?.OrderStatus == AllOrderStatus.ChefAccept && OrderStatus == AllOrderStatus.RiderFinishRider) {
                    SetOrderStatus("fnshride");
                  }

                } else {

                  if (currentOrder[0]?.OrderStatus == 1) {
                    SetOrderStatus("startride-start");
                  }

                  if (currentOrder[0]?.OrderStatus == 2) {
                    SetOrderStatus("startride");
                  }

                  if (currentOrder[0]?.OrderStatus == 3) {
                    SetOrderStatus("wdispatch");
                  }
                  if (currentOrder[0]?.OrderStatus == 4) {
                    SetOrderStatus("startdelivery");
                  }
                  if (currentOrder[0]?.OrderStatus == 5 || currentOrder[0]?.OrderStatus == 14 || currentOrder[0]?.OrderStatus == 6) {
                    SetOrderStatus("fnshride");
                  }
                }

                if (currentOrder[0]?.OrderStatus == AllOrderStatus.CancelledByAdmin1 || OrderStatus == AllOrderStatus.CancelledByAdmin) {
                  SetOrderStatus("Order cancelled by admin");
                  setTimeout(() => {
                    setorderCancelByAdmin && setorderCancelByAdmin(true)
                  }, 700);
                }
              }
            );

          }
        }

      })
      .catch((err) => {
        console.log('er==============121r', err);
        console.error(err);
        SetLoading(false);
      });
  } catch (error) {
    console.log('error', error);
    setmodalmsg(error.message);
    seterrorModal(true);
    // alert(error);
    SetLoading(false);
  }
};

const GetCurrentOrderDetailsOnFinish = async (
  SetLoading,
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
  activeOrderId,
  setActiveTab,
  setAcknowledgeModalView,
  setAcknowledgeModalData,
  setLodaer,
  setBidViewData
) => {
  try {
    SetLoading(true);
    GET_METHOD_AUTH(`/api/V5DmsOrder?Ridrid=${UserDetail?.Id}`, TokenId)
      .then(async (result) => {
        if (result?.message == "No active deliveries currently. Stay online to receive new orders." && result?.Orders?.length == undefined && result?.Bids?.length == undefined) {
          navigation.goBack()
        }
        // console.log(">>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<", result)
        setActiveTab && setActiveTab(result?.Orders?.length > 0 ? result?.Orders[0]?.OrderID : result?.Bids[0]?.OrderId)
        setBidViewData && setBidViewData(result?.Orders?.length > 0 ? null : result?.Bids[0])
        setAllOrders && setAllOrders([...result?.Orders, ...result?.Bids])
        setAcknowledgeModalView && setAcknowledgeModalView(false)
        setLodaer && setLodaer(false)

        // const currentStatus = result?.Orders[0]?.?.OrderStatus;
        const currentOrder = result?.Orders && result?.Orders?.filter((data) => data.OrderID == activeOrderId)

        if (currentOrder[0]?.Status == 0 && result?.message == 'No active deliveries currently. Stay online to receive new orders.') {
          try {
            navigation && navigation.goBack()
          } catch (error) {
          }
          SetLoading(false);
        } else {
          let Details = {
            Status: currentOrder[0]?.Status,
            CurrentStatus: currentOrder[0]?.OrderStatus,
            OrderId: currentOrder[0]?.OrderID,
            Type: currentOrder[0]?.Type,
            UserId: UserDetail.Id,
            Datetime: currentOrder[0]?.Datetime,
            tip: currentOrder[0]?.tip || 0,
          };

          setRiderNote && setRiderNote(currentOrder[0]?.riderNote)

          GET_METHOD_AUTH(`/api/Order?oidoid=${currentOrder[0]?.OrderID}`, TokenId).then(
            async (resultt) => {

              const OrderStatus = resultt?.status;
              const resturantAllAddress = `, ${resultt?.vendorCity}, ${resultt?.vendorState}, ${resultt?.vendorCountry}`
              if (result?.Orders?.length > 0) {
                Geolocation.getCurrentPosition(
                  (position) => {
                    GetOrderLocationAndPayment(
                      SetLoading,
                      UserDetail,
                      TokenId,
                      setorderDetails,
                      Details,
                      {
                        latitude: position?.coords?.latitude,
                        longitude: position?.coords?.longitude,
                      },
                      setdurationData,
                      OrderStatus,
                      setmodalmsg,
                      seterrorModal,
                      resturantAllAddress
                    );
                  },
                  (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                  },
                  { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
              } else {
                SetLoading(false)
              }

              if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRideFirst && (OrderStatus == AllOrderStatus.ChefAutoAccept || OrderStatus == AllOrderStatus.ChefAccept || OrderStatus == AllOrderStatus.chefInitial)) {
                SetOrderStatus("startride-start");
              }

              if (currentOrder[0]?.OrderStatus == AllOrderStatus.Reached) {
                SetOrderStatus("startride");
              }
              if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRide && OrderStatus == AllOrderStatus.RiderReachedRest && OrderStatus != AllOrderStatus.chefInitial) {
                SetOrderStatus("wdispatch");
              }
              if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRide && OrderStatus == AllOrderStatus.OrderDispatchChef) {
                SetOrderStatus("odispateched");
              }
              if (currentOrder[0]?.OrderStatus == AllOrderStatus.OrderDispatch && OrderStatus == AllOrderStatus.RiderStartRideToCustomer) {
                SetOrderStatus("startdelivery");
              }
              if (currentOrder[0]?.OrderStatus == AllOrderStatus.FinishRide && OrderStatus == AllOrderStatus.RiderFinishRider) {
                SetOrderStatus("fnshride");
              }
              if (currentOrder[0]?.OrderStatus == AllOrderStatus.ChefAccept && OrderStatus == AllOrderStatus.RiderFinishRider) {
                SetOrderStatus("fnshride");
              }

              if (currentOrder[0]?.OrderStatus == AllOrderStatus.CancelledByAdmin1 || OrderStatus == AllOrderStatus.CancelledByAdmin) {
                SetOrderStatus("Order cancelled by admin");
                setTimeout(() => {
                  setorderCancelByAdmin && setorderCancelByAdmin(true)
                }, 700);
              }
            }
          );

        }
      })
      .catch((err) => {
        console.error(err);
        SetLoading(false);
      });
  } catch (error) {
    setmodalmsg(error.message);
    seterrorModal(true);
    // alert(error);
    SetLoading(false);
  }
};

const UpDateRiderCordinates = async (
  UserDetail,
  TokenId,
  latitude,
  longitude
) => {
  let riderCoordinates = latitude + "," + longitude;
  try {
    PUT_METHOD_AUTH(
      `/api/DMSOrder?riderId=${UserDetail?.Id}&riderCoordinates=${riderCoordinates}`,
      TokenId
    )
      .then(async (result) => {
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (error) {
    console.log("UpDateRiderCordinates", error);
  }
};

const GetOrderLocationAndPayment = (
  SetLoading,
  UserDetail,
  TokenId,
  setorderDetails,
  Details,
  curLoc,
  setdurationData,
  OrderStatus,
  setmodalmsg,
  seterrorModal,
  resturantAllAddress,
  makeLoaderFalse
) => {

  // console.log('Details===<><><><><><><>', Details)
  try {
    GET_METHOD_AUTH(
      `/api/DMSOrder?ordrid=${Details?.OrderId}&tpe=${Details?.Type}`,
      TokenId
    )
      .then(async (result) => {
        try {

          const Result = (result);


          const OrderDetails = Result?.orderhistory;
          // console.log("OrderDetails>>>>>>>............................",  `/api/DMSOrder?ordrid=${Details?.OrderId}&tpe=${Details?.Type}`)
          const OrderAddress = Result?.vendorDetails;;
          const locationOfRestaurant = OrderDetails?.Pickup && JSON.parse(OrderDetails?.Pickup);
          const locationOfUsers = OrderDetails?.dropoff && JSON?.parse(OrderDetails?.dropoff);

          // console.log('result===<<><><><><><,.,.,.,.,.<><><><><><><><><>', result, locationOfRestaurant, locationOfUsers)
          const TotalAmount =
            OrderDetails?.Amount +
            OrderDetails?.BidAmtFinal +
            OrderDetails?.ServiceTax +
            OrderDetails?.Tax;

          const getName = (encryptText) => {
            let temp = ''
            let name = encryptText?.split('/')
            if (name?.length > 3) {
              for (let index = 0; index < name?.length; index++) {
                if (index > 1) {
                  let temp2 = temp?.concat(name[index])
                  temp2 += name?.length - 1 === index ? '' : '/'

                  temp = temp2
                }
              }

            } else {
              temp = encryptText?.split('/')[2]
            }
            return temp
          }

          const customer_Restaurants_Distance = await getDistance({ latitude: locationOfRestaurant?.lat, longitude: locationOfRestaurant?.long }, { latitude: locationOfUsers?.latitude, longitude: locationOfUsers?.longitude });
          const driver_Restaurants_Distance = await getDistance({ latitude: locationOfRestaurant?.lat, longitude: locationOfRestaurant?.long }, { latitude: curLoc?.latitude, longitude: curLoc?.longitude })

          setorderDetails({
            ...Details,
            locationOfRestaurant,
            locationOfUsers,
            ...OrderAddress,
            CustomerPhone: "+" + OrderDetails?.UserID?.split("/")[1],
            CustomerName: getName(OrderDetails?.UserID),
            BIdAmount: OrderDetails?.BidAmtFinal,
            TotalAmount: TotalAmount,
            PaymentType: OrderDetails?.PaymentType,
            TotalDistanceD: OrderDetails?.TotalDistanceD,
            TotalDistanceP: OrderDetails?.TotalDistanceP,
            Endtime: OrderDetails?.Endtime,
            CurrentStatus: OrderDetails?.OrderStatus,
            resturantAllAddress: resturantAllAddress,
            customer_Restaurants_Distance: customer_Restaurants_Distance,
            driver_Restaurants_Distance: driver_Restaurants_Distance
          });

          let startLoc = `${curLoc?.latitude},${curLoc?.longitude}`;
          let LocationToGo = "";

          switch (OrderStatus) {
            case "13":
              LocationToGo = `${locationOfRestaurant?.lat},${locationOfRestaurant?.long}`;
              break;
            case "11":
              LocationToGo = `${locationOfRestaurant?.lat},${locationOfRestaurant?.long}`;
              break;
            case "4":
              LocationToGo = `${locationOfUsers?.latitude},${locationOfUsers?.longitude}`;
              break;
            case "12":
              LocationToGo = `${locationOfUsers?.latitude},${locationOfUsers?.longitude}`;
              break;
            case "16":
              LocationToGo = `${locationOfUsers?.latitude},${locationOfUsers?.longitude}`;
              break;
          }
          makeLoaderFalse && makeLoaderFalse()
          SetLoading(false)

        } catch (error) {
          console.log("error----------------------error", error)
          makeLoaderFalse && makeLoaderFalse()
          SetLoading(false)
        }
      })
      .catch((err) => {
        console.error(err);
        makeLoaderFalse && makeLoaderFalse()
        SetLoading(false);
      });
  } catch (error) {
    makeLoaderFalse && makeLoaderFalse()
    setmodalmsg(error.message);
    seterrorModal(true);
    // alert(error);
    SetLoading(false);
  }
};

const GetRoutesDurationDetails = async (
  SetLoading,
  startLoc,
  LocationToGo,
  setdurationData
) => {
  try {
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${LocationToGo}&key=${GOOGLE_API}`
    );
    let respJson = await resp.json();

    let distanceFrom = respJson?.routes[0]?.legs[0]?.distance?.text;
    if (distanceFrom) {

      var ret = respJson?.routes[0]?.legs[0]?.distance?.text?.replace("km", "");
      var ret = ret?.replace("m", "");

      if (distanceFrom.toLowerCase().includes("km")) {
        distanceFrom = distanceFrom.replace(/km/g, "");
        distanceFrom = ((Number(distanceFrom) * 0.621371).toFixed(2)) + " miles";
      }
      if (distanceFrom.toLowerCase().includes("mi") && !(distanceFrom.toLowerCase().includes("miles"))) {
        distanceFrom = distanceFrom.replace(/mi/g, "");
        distanceFrom = ((Number(distanceFrom)).toFixed(2)) + " miles";
      }
      if (distanceFrom.toLowerCase().includes("m") && !(distanceFrom.toLowerCase().includes("miles"))) {
        distanceFrom = distanceFrom.replace(/m/g, "");
        distanceFrom = ((Number(distanceFrom) * 0.000621371).toFixed(2)) + " miles";
      }
      if (distanceFrom.toLowerCase().includes("ft")) {
        distanceFrom = distanceFrom.replace(/ft/g, "");
        distanceFrom = ((Number(distanceFrom) / 5280).toFixed(2)) + " miles";
      }
      if (distanceFrom.toLowerCase().includes("in")) {
        distanceFrom = distanceFrom.replace(/in/g, "");
        distanceFrom = ((Number(distanceFrom) / 63360).toFixed(2)) + " miles";
      }
      if (distanceFrom.toLowerCase().includes("yd")) {
        distanceFrom = distanceFrom.replace(/yd/g, "");
        distanceFrom = ((Number(distanceFrom) / 1760).toFixed(2)) + " miles";
      }

      setdurationData({
        distancerem: respJson.routes[0]?.legs[0]?.distance.text,
        duration: respJson.routes[0]?.legs[0].duration.text,
        durationMiles: distanceFrom ? distanceFrom || '0.00 miles' : "0.00 miles",
      });
    }
    SetLoading(false);
  } catch (error) {
    SetLoading(false);
    console.log("GetRoutesDurationDetails", error);
    return error;
  }
};

const StartRideFunctionV2 = (orderDetails, adressFinal, TokenId) => {
  PUT_METHOD_AUTH(`/api/DMSOrder?orderId=${orderDetails.OrderId}&${orderDetails.OrderId}&RiderLocation=${adressFinal}&TotalDistance=${orderDetails?.driver_Restaurants_Distance?.finalDistance}&TotalTime=${orderDetails?.driver_Restaurants_Distance?.duration}&type=&status=0`, TokenId)
    .then(async (result) => {
      // console.log("---------------------------------------------------", result)
    })
    .catch((err) => {
      console.error(err);
    });

}

const MartOrderNextStep = async (
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
  setorderDeliverModal,
  setsupport,
  setDistanceForRange,
  setsupportCondition
) => {

  const Adress = orderDetails?.vedraddress?.replace(/%/g, '%25');
  const Adress1 = Adress?.replace(/&/g, '%26');
  const adressFinal = Adress1?.replace(/#/g, '%23');

  let AccrordingToOrderPrams = "";


  switch (OrderStatus) {
    case "startride":
      StartRideFunctionV2(orderDetails, adressFinal, TokenId);
      AccrordingToOrderPrams = `/ReachedRestaurant?orderId=${orderDetails.OrderId}&latitude=${curLoc?.latitude}&longtitude=${curLoc?.longitude}`;
      break;
    case "odispateched":
      AccrordingToOrderPrams = `?orderid=${orderDetails.OrderId}&status=${AllOrderStatus.OrderDispatch}`;
      break;
    case "fnshride":
      AccrordingToOrderPrams = `?orderid=${orderDetails.OrderId}&status=${AllOrderStatus.CompleteOrder}`;
      break;
  }

  setLoading2(true);
  PUT_METHOD_AUTH(`/api/V2DmsOrder${AccrordingToOrderPrams}`, TokenId)
    .then(async (result) => {
      if (result.Status == 1 && OrderStatus == "startride") {
      } else if (OrderStatus == "startride") {
        OnSuccess();
      }
      if (result.status == 0 && OrderStatus == "odispateched") {
        OnSuccess();
      }
      if (result.status == 0 && OrderStatus == "fnshride") {
        setTimeout(() => {
          setorderDeliverModal && setorderDeliverModal(true)
        }, 800)
      }
      if (result.message == 'Not in range' && result.status == 1) {
        setsupportCondition(false)
        setDistanceForRange && setDistanceForRange(result?.radius)
        setsupport && setsupport(true)
        setLoading2(false);
      }

      setLoading2(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading2(false);
    });
};

const FinishRide = (
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
  setsupport,
  setDistanceForRange,
  setsupportCondition
) => {
  setLoading2(true)
  var vedraddress = orderDetails?.userAddress;
  var AddressRest;
  if (vedraddress.includes("#")) {
    AddressRest = vedraddress.replace("#", " ");
  } else {
    AddressRest = vedraddress;
  }

  PUT_METHOD_AUTH(
    `/api/V2DmsOrder/ReachedDropoff?orderId=${orderDetails.OrderId}&latitude=${curLoc?.latitude}&longtitude=${curLoc?.longitude}`,
    TokenId
  )
    .then((responseJson) => {
      if (responseJson?.message == 'Not in range' && responseJson?.status == 1) {
        setsupportCondition(false)
        setDistanceForRange && setDistanceForRange(responseJson?.radius)
        setsupport && setsupport(true)
        setLoading2(false);
      }
      if (responseJson.status == 0) {
        var mydata = {
          RiderID: UserDetail.Id,
          OrderID: orderDetails.OrderId,
          Datetime: getISOFormattedDateWithGMT(),
          orderAmt: orderDetails.TotalAmount - orderDetails.BIdAmount,
          riderAmt: orderDetails?.BIdAmount,
          TransactionStatus: 0,
          TransactionType: orderDetails?.PaymentType,
        };


        var ural =
          `${API_URL}api/DMSRiderCollection`;
        let data = {
          method: "POST",
          body: JSON.stringify(mydata),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TokenId}`,
          },
        };

        return fetch(ural, data)
          .then((response) => response.json())
          .then(async (response) => {
            var res = response;

            if (res.status == 0) {
              // console.log('Finish Ride PUT', `/api/DMSOrder?orderId=${orderDetails.OrderId}&RiderLocation=${AddressRest}&TotalDistance=${orderDetails?.customer_Restaurants_Distance.finalDistance}&TotalTime=${orderDetails?.customer_Restaurants_Distance.duration}&type=&status=1`);
              PUT_METHOD_AUTH(
                `/api/DMSOrder?orderId=${orderDetails.OrderId}&RiderLocation=${AddressRest}&TotalDistance=${orderDetails?.customer_Restaurants_Distance.finalDistance}&TotalTime=${orderDetails?.customer_Restaurants_Distance.duration}&type=chef&status=1`,
                TokenId
              ).then(async (ress) => {
                // PUT_METHOD_AUTH(`/api/DMSOrder?orderId=${orderDetails.OrderId}&endtime=${new Date()}`, TokenId)
                PUT_METHOD_AUTH(`/api/DMSOrder?orderId=${orderDetails.OrderId}&endtime=${getISOFormattedDateWithGMT()}&type=chef`, TokenId)
                  .then((res) => {
                    if (res?.status == 1) {
                    } else {
                    }
                  }).catch((errqwe) => {
                    console.log(errqwe)
                  })
                if (ress.Status == 1) {
                  SetOrderStatus("fnshride");
                  setLoading2(false);
                  // OnSuccess();
                } else {
                  setLoading2(false);
                  setmodalmsg(
                    "Location, Duration and Distance not uploaded"
                  );
                  seterrorModal(true);
                  // alert("Location, Duration and Distance not uploaded");
                }
              });
            }
            setLoading2(false)
          })
          .catch((error) => {
            console.log("eerr2", error);
            setLoading2(false);
          });
      }
    })
    .catch((error) => {
      console.log("eerr1", error);
      setLoading2(false);
    });

};

const CompleteMartOrder = (
  setLoading2,
  orderDetails,
  UserDetail,
  navigation
) => {

  try {
    setLoading2(true);
    let Body = {
      RiderID: UserDetail.Id,
      OrderID: orderDetails?.OrderId,
      Datetime: getISOFormattedDateWithGMT(),
      orderAmt: orderDetails.scharges + orderDetails.gst,
      riderAmt:
        orderDetails.bidAmount - (orderDetails.scharges + orderDetails.gst),
      TransactionStatus: 0,
      TransactionType: orderDetails.paymentmetod,
    };

    PUT_METHOD(
      `/api/WalmartOrder?orderid=${orderDetails?.OrderId}&status=10&imgUrl='https://foodostiimagedb.blob.core.windows.net/itemimages/Wagon_Wheel-8-Foodosti'`
    )
      .then(async (result) => {
        POST_METHOD(`/api/DMSRiderCollection`, Body)
          .then((res) => {
            let Result = res && JSON.parse(res);
            if (Result.status == 0) {
              Alert.alert('Info', 'Order delivered successfully');
              navigation.goBack();
            } else {
              Alert.alert("Warning", "Fail to update status try again.");
            }
            setLoading2(false);
          })
          .catch((error) => {
            setLoading2(false);
            console.log("CompleteMartOrder===>", error);
          });
      })
      .catch((err) => {
        console.error(err);
        setLoading2(false);
      });
  } catch (error) {
    setLoading2(false);
    console.log("CompleteMartOrder===>", error);
  }
};


const GET_ORDER_DETAILS = (TokenId, setLoading, OrderData, setCompleteOrderDetails) => {
  setLoading && setLoading(true)
  GET_METHOD_AUTH(`api/OrderProduct?oid=${OrderData?.OrderId || OrderData?.OrderID}`, TokenId,)
    .then((res) => {
      setLoading && setLoading(false)
      setCompleteOrderDetails(res)
    })
    .catch((error) => {
      console.log("GET_ATTRIBUTES_CATEGORY====>", error);
      setLoading && setLoading(false)
    });
};

const StartRideFirst = async (setLoading2, OnSuccess, orderDetails, TokenId) => {

  setLoading2(true);
  PUT_METHOD_AUTH(`/api/V2DmsOrder?orderid=${orderDetails.OrderId}&status=2`, TokenId)
    .then(async (result) => {
      console.log('StartRideFirst =======>', result);

      OnSuccess()
      setLoading2(false);
    })
    .catch((err) => {
      console.log('StartRideFirst', err);
      setLoading2(false);
    });
};


const GetBgLocationForIOS = async (cords, setLoading, OnSucces, UserDetail) => {
  if (cords.latitude && cords.longitude && UserDetail?.Address) {
    await OnSucces(UserDetail?.country, UserDetail?.state, UserDetail?.city, setLoading, cords.latitude, cords.longitude, UserDetail?.Address)
  }
}

const GetBgLocationForANDROID = async (setLoading, OnSucces, UserDetail) => {
  try {
    Geolocation.getCurrentPosition(
      async (position) => {
        if (position.coords.latitude && position.coords.longitude) {
          await OnSucces(UserDetail?.country, UserDetail?.state, UserDetail?.city, setLoading, position.coords.latitude, position.coords.longitude, UserDetail?.Address)
        }
      },
      (err) => {
        setLoading && setLoading(false);
        console.log('GetLocationAndAddress1 Restu function', err)
      },
      {
        enableHighAccuracy: false, timeout: 15000, maximumAge: 20000
      }
    );
  } catch (error) {
    console.log("ERROR GetBgLocationForANDROID===", error);
  }
}

const UpdaeAcknowledgeStatus = async (OrderID, setAcknowledgeModalView, setAcknowledgeModalData, TokenId, setmodalmsg, seterrorModal, setAllOrders, setActiveTab, activeTab, bidViewData,
  navigateToJob, setLoading, setOrderDetail, updateOrderSheet, isMart) => {
  setLoading(true);
  const url = `api/V3DMSOrder/UpdateOrderAcknowledgement?orderId=${OrderID}&type=${isMart}`;
  PUT_METHOD_AUTH(url, TokenId)
    .then(async (result) => {
      console.log(" UpdaeAcknowledgeStatus result", result)
      if (result?.Bids || result?.Orders) {
        setAllOrders && setAllOrders([...result?.Orders || [], ...result?.Bids || []]);

        if (navigateToJob == true) {
          setActiveTab(OrderID);
          updateOrderSheet(OrderID)
        } else {
          setActiveTab(activeTab ? activeTab : result?.Orders[0]?.OrderID);
          updateOrderSheet(activeTab ? activeTab : result?.Orders[0]?.OrderID)
        }

        bidViewData(null)
        setLoading(false)
        setAcknowledgeModalView(false)
        setAcknowledgeModalData(null)
        setOrderDetail(null)
      } else {
        setAcknowledgeModalView(false)
        setAcknowledgeModalData(null)
        setmodalmsg('Unable to update status')
        seterrorModal(true)
        setLoading(false)
        setOrderDetail(null)
      }
    })
    .catch((error) => {
      setAcknowledgeModalView(false)
      setAcknowledgeModalData(null)
      setLoading(false)
      setmodalmsg('Something went wrong...')
      seterrorModal(true)
      console.log('UpdaeAcknowledgeStatus', error)

    });
};

export {
  GetCurrentOrderDetails,
  GetOrderLocationAndPayment,
  MartOrderNextStep,
  GetRoutesDurationDetails,
  CompleteMartOrder,
  FinishRide,
  UpDateRiderCordinates,
  GET_ORDER_DETAILS,
  StartRideFirst,
  GetBgLocationForIOS,
  GetBgLocationForANDROID,
  UpdaeAcknowledgeStatus,
  GetCurrentOrderDetailsOnFinish,
  GetCurrentOrderDetailsBackground
};
