import { GET_METHOD_AUTH, POST_METHOD, POST_METHOD_AUTH, PUT_METHOD, PUT_METHOD_AUTH } from "../../utils/ApiCallingMachnisem";
import { Alert } from "react-native";
import moment from "moment";
import { GOOGLE_API, API_URL } from "@env"
import { UPLOAD_FILE } from "./AuthFunctions";
import Geolocation from "react-native-geolocation-service";
import AllOrderStatus from "../../utils/AllOrderStatus";
import { getDistance } from "../../utils/helperFunctions";
import { getISOFormattedDateWithGMT } from "./AppFunctions";

const GetCurrentOrderDetailsMarts = async (
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
    try {
        SetLoading(true);
        GET_METHOD_AUTH(`/api/V3DmsOrder/Mart?Ridrid=${UserDetail?.Id}`, TokenId)
            .then(async (result) => {

                // console.log('result************************************************************', result)

                if (result?.message == "No active deliveries currently. Stay online to receive new orders." && result?.Orders?.length == undefined) {
                    makeLoaderFalse && makeLoaderFalse()
                    navigation.goBack()
                    SetLoading(false);
                }

                const IsOrder = result?.Orders?.filter((data) => data.OrderID == activeTab)
                // console.log("***********************>>>>>>>>>>>>", IsOrder)

                setAllOrders && setAllOrders([...result?.Orders])
                setAcknowledgeModalView && setAcknowledgeModalView(false)

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
                            // if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRide && OrderStatus == AllOrderStatus.RiderReachedRest && OrderStatus != AllOrderStatus.chefInitial) {
                            //     SetOrderStatus("wdispatch");
                            // }
                            // if (currentOrder[0]?.OrderStatus == AllOrderStatus.StartRide && OrderStatus == AllOrderStatus.OrderDispatchChef) {
                            //     SetOrderStatus("odispateched");
                            // }
                            // if (currentOrder[0]?.OrderStatus == AllOrderStatus.OrderDispatch && OrderStatus == AllOrderStatus.RiderStartRideToCustomer) {
                            //     SetOrderStatus("startdelivery");
                            // }
                            // if (currentOrder[0]?.OrderStatus == AllOrderStatus.FinishRide && OrderStatus == AllOrderStatus.RiderFinishRider) {
                            //     SetOrderStatus("fnshride");
                            // }
                            // if (currentOrder[0]?.OrderStatus == AllOrderStatus.ChefAccept && OrderStatus == AllOrderStatus.RiderFinishRider) {
                            //     SetOrderStatus("fnshride");
                            // }

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
                console.log('err--------------12121', err);
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

const UpDateRiderCordinates = async (SetLoading, UserDetail, TokenId, latitude, longitude) => {
    try {
        // SetLoading(true)
        let riderCoordinates = latitude + "," + longitude;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${TokenId}`);
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${API_URL}api/DMSOrder?riderId=${UserDetail.Id}&riderCoordinates=${riderCoordinates}`, requestOptions)
            .then(response => response.json())
            .then(result => { })
            .catch(error => {
                SetLoading && SetLoading(false);
                console.log('UpDateRiderCordinates', error)
            });

    } catch (error) {
        console.log('UpDateRiderCordinates', error)
        SetLoading && SetLoading(false)
    }
};

// const GetOrderLocationAndPayment = (SetLoading, UserDetail, TokenId, setorderDetails, Details, curLoc, setdurationData, GetCameraPermission) => {
//     try {
//         GET_METHOD_AUTH(`api/WallmartRider?RidRid=${UserDetail?.Id}`, TokenId)
//             .then(async result => {

//                 console.log("result",result)

//                 const locationOfMart = JSON.parse(result.MartLocation);
//                 const locationOfUsers = JSON.parse(result.UserLocation);

//                 setorderDetails({
//                     ...Details,
//                     locationOfMart,
//                     locationOfUsers,
//                     // bidAmount: result.BidAmount + result.ServiceTax + result.Tax,
//                     bidAmount: result.BidAmount,
//                     scharges: result.ServiceTax,
//                     gst: result.Tax,
//                     paymentmetod: result.PaymentType,
//                     morderId: result.morderId,
//                     // OrderId: result.orderId,
//                     martAddress: result?.martAddress,
//                     userAddress: result?.userAddress
//                 })

//                 if (Details.CurrentStatus == 6) {
//                     GetRoutesDurationDetails(SetLoading, curLoc, locationOfMart, setdurationData)
//                 } else {
//                     SetLoading(false)
//                 }
//                 SetLoading(false)
//                 setTimeout(() => {
//                     GetCameraPermission && GetCameraPermission()
//                 }, 6000)

//                 SetLoading(false)
//             })
//             .catch((err) => {
//                 console.log('GetOrderLocationAndPayment===>', err)
//                 console.error(err);
//                 SetLoading(false)
//             });

//     } catch (error) {
//         console.log('GetOrderLocationAndPayment===>', error)
//         alert(error)
//         SetLoading(false)
//     }
// };


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
    try {
        GET_METHOD_AUTH(
            `/api/DMSOrder?ordrid=${Details?.OrderId}&tpe=mart`,
            TokenId
        )
            .then(async (result) => {
                try {

                    const Result = (result);

                    // console.log('result===================================>', result)

                    const OrderDetails = Result?.orderhistory;
                    const OrderAddress = Result?.vendorDetails;
                    const locationOfRestaurant = OrderDetails?.Pickup && JSON.parse(OrderDetails?.Pickup);
                    const locationOfUsers = OrderDetails?.dropoff && JSON?.parse(OrderDetails?.dropoff);

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

                    const customer_Restaurants_Distance = await getDistance({ latitude: Result?.vendorDetails?.Cords?.latitude || locationOfRestaurant?.lat, longitude: Result?.vendorDetails?.Cords?.longitude || locationOfRestaurant?.long }, { latitude: locationOfUsers?.latitude, longitude: locationOfUsers?.longitude });
                    const driver_Restaurants_Distance = await getDistance({ latitude: Result?.vendorDetails?.Cords?.latitude || locationOfRestaurant?.lat, longitude: Result?.vendorDetails?.Cords?.longitude || locationOfRestaurant?.long }, { latitude: curLoc?.latitude, longitude: curLoc?.longitude })

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

const MartOrderNextStep = async (setLoading2, OrderStatus, OnSuccess, orderDetails, durationData, curLoc, setdurationData, TokenId, OrderIdSpecial) => {


    let AccrordingToOrderPrams = ''
    switch (orderDetails.CurrentStatus) {
        case 6:
            AccrordingToOrderPrams = `&status=7&type=${orderDetails?.Type}`
            break;
        case 17:
            AccrordingToOrderPrams = `&status=7&type=${orderDetails?.Type}`
            break;
        case 7:
            AccrordingToOrderPrams = `&status=20&type=${orderDetails?.Type}`
            break;
        case 20:
            AccrordingToOrderPrams = `&status=8&type=${orderDetails?.Type}`
            break;
        case 8:
            AccrordingToOrderPrams = `&status=9&type=${orderDetails?.Type}`
            break;
        case 9:
            AccrordingToOrderPrams = `&status=9&type=${orderDetails?.Type}`
            break;
    }

    setLoading2(true);

    PUT_METHOD_AUTH(`api/WallmartRider?orderid=${OrderIdSpecial ? OrderIdSpecial : orderDetails.OrderId}${AccrordingToOrderPrams}`, TokenId)
        .then(async result => {

            var vedraddress = orderDetails?.userAddress;
            var AddressRest;
            if (vedraddress.includes("#")) {
                AddressRest = vedraddress.replace("#", " ");
            } else {
                AddressRest = vedraddress;
            }

            let destinationLocUsers = `${orderDetails?.locationOfUsers?.latitude} + ${orderDetails?.locationOfUsers?.longitude}`;

            if (orderDetails?.CurrentStatus == 6) {
                if (result.status == 0) {
                    PUT_METHOD_AUTH(`api/DMSOrder?orderId=${OrderIdSpecial ? OrderIdSpecial : orderDetails.OrderId}&RiderLocation=${AddressRest}&TotalDistance=${durationData?.durationMiles}&TotalTime=${durationData?.duration}&type=${orderDetails?.Type}&status=1`, TokenId)
                        .then(async rES => {
                            setLoading2(false);
                            OnSuccess();
                        })
                        .catch((err) => {
                            console.error('UPDATE TIME', err);
                            setLoading2(false)
                        });
                } else {
                    Alert.alert('WARNING', 'Time duration fail to update')
                }
            } else {
                setLoading2(false);
                OnSuccess();
                GetRoutesDurationDetails(setLoading2, curLoc, destinationLocUsers, setdurationData)
            }

            if (orderDetails?.CurrentStatus == 7) {
                setLoading2(false);
                OnSuccess();
                GetRoutesDurationDetails(setLoading2, curLoc, destinationLocUsers, setdurationData)
            }
            if (orderDetails?.CurrentStatus == 20) {
                setLoading2(false);
                OnSuccess();
                GetRoutesDurationDetails(setLoading2, curLoc, destinationLocUsers, setdurationData)
            }
            setLoading2(false)
        })
        .catch((err) => {
            console.error(err);
            setLoading2(false)
        });
}

const GetRoutesDurationDetails = async (SetLoading, curLoc, locationOfMart, setdurationData) => {

    try {

        let startLoc = `${curLoc.latitude} + ${curLoc.longitude}`;
        let destinationLoc = `${locationOfMart.lat} + ${locationOfMart.long}`;

        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${GOOGLE_API}`);
        let respJson = await resp.json();

        var ret = respJson?.routes[0]?.legs[0]?.distance?.text?.replace("km", "");
        var ret = ret?.replace("m", "");
        setdurationData({
            distancerem: respJson.routes[0]?.legs[0]?.distance.text,
            duration: respJson.routes[0]?.legs[0].duration.text,
            durationMiles: ret ? Number(ret).toFixed(2) + " miles" : "0.00 miles",
        });

        SetLoading(false)


    } catch (error) {
        SetLoading(false)
        console.log('GetRoutesDurationDetails', error)
        return error;
    }
}

const CompleteMartOrderMart = async (setLoading2, orderDetails, UserDetail, navigation, TokenId, setorderDeliverModal, UserImageUrl) => {

    try {
        let Body = {
            RiderID: UserDetail.Id,
            OrderID: orderDetails?.OrderId,
            Datetime: getISOFormattedDateWithGMT(),
            orderAmt: orderDetails.scharges + orderDetails.gst,
            riderAmt: orderDetails.bidAmount - (orderDetails.scharges + orderDetails.gst),
            TransactionStatus: 0,
            TransactionType: orderDetails.paymentmetod,
        };
        setLoading2(true)
        UPLOAD_FILE(UserImageUrl, false, UserDetail?.ContactNum, 0).then((res) => {
            PUT_METHOD_AUTH(`api/WalmartOrder?orderid=${orderDetails?.OrderId}&status=10&imgUrl=${res?.data?.message}`, TokenId)
                .then(async result => {

                    POST_METHOD_AUTH(`api/DMSRiderCollection`, TokenId, Body)
                        .then((res) => {
                            GET_METHOD_AUTH(`api/WallmartRider?Rid=${orderDetails?.OrderId}`, TokenId)
                                .then(async result => {
                                    setLoading2(false)
                                    if (result?.Status == 0) {
                                        // navigation.goBack();
                                        // Alert.alert('Info', 'Order delivered successfully');
                                        setTimeout(() => {
                                            setorderDeliverModal && setorderDeliverModal(true)
                                        }, 800)

                                    } else {
                                        navigation.goBack();
                                        // navigation.navigate("MartOrders")
                                    }

                                })
                                .catch((err) => {
                                    console.error(err);
                                    setLoading2(false)

                                });



                        }).catch((error) => {
                            setLoading2(false)
                            console.log('CompleteMartOrderMart===>', error)
                        })
                })
                .catch((err) => {
                    console.error(err);
                    setLoading2(false)
                });
        }).catch((err) => {
            setLoading2(false)
            return Alert.alert('Image upload fail try again')
        })
        const date = new Date()?.getMilliseconds()


        // }).catch((err) => {
        //     Alert.alert('Warning', 'Fail to upload image')
        //     console.log('err', err)
        //     setLoading2(false)
        // })

    } catch (error) {
        setLoading2(false)
        console.log('CompleteMartOrderMart===>', error)
    }
}

const GetRiderAllRiders = async (UserDetail, TokenId, setAllOrders) => {
    try {
        GET_METHOD_AUTH(`api/WalmartOrder?riderId=${UserDetail?.Id}`, TokenId)
            .then(async result => {
                setAllOrders(result)
            })
            .catch((err) => {
                console.log('GetRiderAllRiders===>', err)
            });

    } catch (error) {
        console.log('GetRiderAllRiders===>', error)
    }
}

const StartRideMultiple = (HandleNextStep, value, TokenId, SetLoading) => {
    try {
        PUT_METHOD_AUTH(`api/WalmartOrder?ordrId=${value?.id}`, TokenId)
            .then(async result => {
                SetLoading(false)
                setTimeout(() => {
                    HandleNextStep(value?.id)
                }, 600);
            })
            .catch((err) => {
                SetLoading(false)
                console.log('StartRideMultiple===>', err)
            });

    } catch (error) {
        console.log('StartRideMultiple===>', error)
    }
}

const FinishMartOrder = (
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

    // PUT_METHOD_AUTH(
    //     `/api/V2DmsOrder/ReachedDropoffMart?orderId=${orderDetails.OrderId}&latitude=${curLoc?.latitude}&longtitude=${curLoc?.longitude}`,
    //     TokenId
    // )
    //     .then((responseJson) => {
    //         console.log("Finish Ride>>>>>>>>222", responseJson)
    //         if (responseJson?.message == 'Not in range' && responseJson?.status == 1) {
    //             setsupportCondition(false)
    //             setDistanceForRange && setDistanceForRange(responseJson?.radius)
    //             setsupport && setsupport(true)
    //             setLoading2(false);
    //         }
    //         if (responseJson.status == 0) {
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
        `${API_URL}api/DMSRiderCollection/Mart`;
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

            console.log('res', res)

            if (res.status == 0) {
                PUT_METHOD_AUTH(
                    `/api/DMSOrder?orderId=${orderDetails.OrderId}&RiderLocation=${AddressRest}&TotalDistance=${orderDetails?.customer_Restaurants_Distance.finalDistance}&TotalTime=${orderDetails?.customer_Restaurants_Distance.duration}&type=mart&status=1`,
                    TokenId
                ).then(async (ress) => {
                    PUT_METHOD_AUTH(`/api/DMSOrder?orderId=${orderDetails.OrderId}&endtime=${getISOFormattedDateWithGMT()}&type=mart`, TokenId)
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
                    } else {
                        setLoading2(false);
                        setmodalmsg(
                            "Location, Duration and Distance not uploaded"
                        );
                        seterrorModal(true);
                    }
                });
            }
            setLoading2(false)
        })
        .catch((error) => {
            console.log("eerr2", error);
            setLoading2(false);
        });
    // }
    // })
    // .catch((error) => {
    //     console.log("eerr1", error);
    //     setLoading2(false);
    // });

};

const StartRideFirstMart = async (setLoading2, OnSuccess, orderDetails, TokenId, status, OrderStatus,
    durationData,
    curLoc,
    setdurationData,
    SetOrderStatus,
    userDetailDecrypted,
    setmodalmsg,
    seterrorModal,
    setsupport,
    setDistanceForRange,
    setsupportCondition,
    UserImageUrl,
    UserDetail,
    navigation,
    setorderDeliverModal
) => {

    if (UserImageUrl == undefined && status == 6) {
        Alert.alert("Info", "Proof image is required");
        return null;
    }

    setLoading2(true);
    const URL = `/api/V2DmsOrder/Mart?orderid=${orderDetails.OrderId}&status=${status}`;
    const URLForRangeCheckMart = `/api/V2DmsOrder/${status == 5 ? 'ReachedDropoffMart' : 'ReachedMart'}?orderId=${orderDetails.OrderId}&latitude=${curLoc?.latitude}&longtitude=${curLoc?.longitude}`;

    if (status == 3 || status == 5) {
        PUT_METHOD_AUTH(URLForRangeCheckMart, TokenId)
            .then(async (responseJson) => {
                // console.log('ReachedDropoffMart =======****************************>', responseJson);
                if (responseJson?.message == 'Not in range' && responseJson?.status == 1) {
                    setsupportCondition(false)
                    setDistanceForRange && setDistanceForRange(responseJson?.radius)
                    setsupport && setsupport(true)
                    setLoading2(false);
                } else {
                    PUT_METHOD_AUTH(URL, TokenId)
                        .then(async (result) => {
                            // console.log('StartRideFirst =======>', result, status);
                            if (result.status == 0) {
                                if (status == 5) {
                                    await FinishMartOrder(
                                        setLoading2,
                                        OrderStatus,
                                        OnSuccess,
                                        orderDetails,
                                        durationData,
                                        curLoc,
                                        setdurationData,
                                        SetOrderStatus,
                                        userDetailDecrypted,
                                        TokenId,
                                        setmodalmsg,
                                        seterrorModal,
                                        setsupport,
                                        setDistanceForRange,
                                        setsupportCondition)
                                } else if (status == 6) {
                                    setorderDeliverModal(true)
                                    setLoading2(false);
                                } else {
                                    setLoading2(false);
                                }
                                OnSuccess()
                            } else {
                                Alert.alert("Info", "Something went wrong please try again")
                                OnSuccess()
                            }
                        })
                        .catch((err) => {
                            console.log('StartRideFirst', err);
                            setLoading2(false);
                        });
                }
            })
            .catch((err) => {
                console.log('StartRideFirst', err);
                setLoading2(false);
            });
    } else {
        PUT_METHOD_AUTH(URL, TokenId)
            .then(async (result) => {
                if (result.status == 0) {
                    if (status == 5) {
                        FinishMartOrder(
                            setLoading2,
                            OrderStatus,
                            OnSuccess,
                            orderDetails,
                            durationData,
                            curLoc,
                            setdurationData,
                            SetOrderStatus,
                            userDetailDecrypted,
                            TokenId,
                            setmodalmsg,
                            seterrorModal,
                            setsupport,
                            setDistanceForRange,
                            setsupportCondition)
                    } else if (status == 6) {
                        setorderDeliverModal(true)
                    }
                    setLoading2(false);
                    OnSuccess()
                } else {
                    Alert.alert("Info", "Something went wrong please try again")
                    OnSuccess()
                }
            })
            .catch((err) => {
                console.log('StartRideFirst', err);
                setLoading2(false);
            });
    }


};



export {
    GetOrderLocationAndPayment,
    MartOrderNextStep,
    GetRoutesDurationDetails,
    CompleteMartOrderMart,
    UpDateRiderCordinates,
    GetRiderAllRiders,
    StartRideMultiple,
    GetCurrentOrderDetailsMarts,
    FinishMartOrder,
    StartRideFirstMart,

}