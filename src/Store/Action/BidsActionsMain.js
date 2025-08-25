import { LoginUser, UserDetail, TokenId, RemamberUser } from "../Reducers/AuthReducer/AuthReducer";
import { API, GET_METHOD, GET_METHOD_AUTH, POST_METHOD } from "../../utils/ApiCallingMachnisem";
import { Alert, Keyboard, Platform, Vibration } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { locationPermission } from "../../utils/helperFunctions";
import Geolocation from "react-native-geolocation-service";
import { GOOGLE_API, API_URL } from "@env"
import { getISOFormattedDateWithGMT } from "./AppFunctions";
import { EventRegister } from "react-native-event-listeners";
import { IsLoading, IsRefreshing, removeSpecificBid, setRideStatus, setRideStatusMart } from "../Reducers/AppReducer/BidReducer";
import NavigationServices from "../../utils/NavigationServices";
import { removeAllBids, addBids } from "../Reducers/AppReducer/BidReducer";

import BackgroundTimer from 'react-native-background-timer';
import { StaticMethods } from "../../utils/StaticMethods";

// const GetNewBidsMain = async (UserDetail, TokenId, isUserOnline, BiddingAmount, setErrorModel, dispatch) => {

//   try {

//     if (UserDetail?.Id == undefined) {
//       console.log('error no user ');
//       return null
//     }

//     await locationPermission();

//     Geolocation.getCurrentPosition(
//       async (position) => {

//         dispatch(IsRefreshing(true));
//         dispatch(IsLoading(true))

//         if (UserDetail?.OnlineStatus == 0 && isUserOnline == undefined) {
//           dispatch(IsRefreshing(false));
//           dispatch(IsLoading(false))
//         } else {

//           const URL = `api/V3DmsBid?status=${UserDetail.Type == null ? "0" : UserDetail.Type}&riderid=${UserDetail?.Id}&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;

//           GET_METHOD_AUTH(URL, TokenId)
//             .then(async (res) => {

//               console.log('res===>', res);

//               let latitude = position.coords.latitude;
//               let longitude = position.coords.longitude;
//               var start = latitude + "," + longitude;
//               let EarnMore = false
//               var bids = [];
//               // console.log('res-***********************', res)
//               if (res.length > 0 && res != "No record found") {
//                 for (var i = 0; i < res.length; i++) {
//                   var obj = res[i];
//                   var venderCoords = JSON.parse(obj.CoordinatesOfVendor);
//                   var destination = venderCoords.lat + "," + venderCoords.long;
//                   let distanceFrom = obj.Distance;
//                   distanceFrom = distanceFrom.replace(/,/g, "");


//                   if (obj.earnMore == true) {
//                     EarnMore = true
//                   }

//                   if (distanceFrom.toLowerCase().includes("km")) {
//                     distanceFrom = distanceFrom.replace(/km/g, "");
//                     distanceFrom = ((Number(distanceFrom) * 0.621371).toFixed(2)) + " miles";
//                   }
//                   if (distanceFrom.toLowerCase().includes("mi") && !(distanceFrom.toLowerCase().includes("miles"))) {
//                     distanceFrom = distanceFrom.replace(/mi/g, "");
//                     distanceFrom = ((Number(distanceFrom)).toFixed(2)) + " miles";
//                   }
//                   if (distanceFrom.toLowerCase().includes("m") && !(distanceFrom.toLowerCase().includes("miles"))) {
//                     distanceFrom = distanceFrom.replace(/m/g, "");
//                     distanceFrom = ((Number(distanceFrom) * 0.000621371).toFixed(2)) + " miles";
//                   }
//                   if (distanceFrom.toLowerCase().includes("ft")) {
//                     distanceFrom = distanceFrom.replace(/ft/g, "");
//                     distanceFrom = ((Number(distanceFrom) / 5280).toFixed(2)) + " miles";
//                   }
//                   if (distanceFrom.toLowerCase().includes("in")) {
//                     distanceFrom = distanceFrom.replace(/in/g, "");
//                     distanceFrom = ((Number(distanceFrom) / 63360).toFixed(2)) + " miles";
//                   }
//                   if (distanceFrom.toLowerCase().includes("yd")) {
//                     distanceFrom = distanceFrom.replace(/yd/g, "");
//                     distanceFrom = ((Number(distanceFrom) / 1760).toFixed(2)) + " miles";
//                   }

//                   const GetAddressOfBid = await fetch(
//                     `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${GOOGLE_API}`
//                   );
//                   let OrderAddress = await GetAddressOfBid.json();
//                   let duration = obj.Duration ? obj.Duration : "0.00 miles";
//                   let distanceTo = "0.00 miles";
//                   if (OrderAddress.routes && OrderAddress.routes[0]?.legs) {

//                     distanceTo = OrderAddress.routes[0]?.legs[0]?.distance.text;
//                     distanceTo = distanceTo.replace(/,/g, "");


//                     if (distanceTo.toLowerCase().includes("mi") && !(distanceTo.toLowerCase().includes("miles"))) {
//                       distanceTo = distanceTo.replace(/mi/g, "");
//                       distanceTo = ((Number(distanceTo)).toFixed(2)) + " miles";
//                     }
//                     if (distanceTo.toLowerCase().includes("km")) {
//                       distanceTo = distanceTo.replace(/km/g, "");
//                       distanceTo = ((Number(distanceTo) * 0.621371).toFixed(2)) + " miles";
//                     }
//                     if (distanceTo.toLowerCase().includes("m") && !(distanceTo.toLowerCase().includes("miles"))) {
//                       distanceTo = distanceTo.replace(/m/g, "");
//                       distanceTo = ((Number(distanceTo) * 0.000621371).toFixed(2)) + " miles";
//                     }
//                     if (distanceTo.toLowerCase().includes("ft")) {
//                       distanceTo = distanceTo.replace(/ft/g, "");
//                       distanceTo = ((Number(distanceTo) / 5280).toFixed(2)) + " miles";
//                     }
//                     if (distanceTo.toLowerCase().includes("in")) {
//                       distanceTo = distanceTo.replace(/in/g, "");
//                       distanceTo = ((Number(distanceTo) / 63360).toFixed(2)) + " miles";
//                     }
//                     if (distanceTo.toLowerCase().includes("yd")) {
//                       distanceTo = distanceTo.replace(/yd/g, "");
//                       distanceTo = ((Number(distanceTo) / 1760).toFixed(2)) + " miles";
//                     }
//                   }

//                   var CustomerCoords = JSON.parse(obj.CoordinatesOfUser);
//                   var CustomerDestination = CustomerCoords.latitude + "," + CustomerCoords.longitude;

//                   const CustomerTOVendor = await fetch(
//                     `https://maps.googleapis.com/maps/api/directions/json?origin=${CustomerDestination}&destination=${destination}&key=${GOOGLE_API}`
//                   );

//                   let customerTOVendor = await CustomerTOVendor.json();
//                   let CVduration = "0 mins"; // Initialize with a default value
//                   let CVdistanceTo = "0.00 miles"; // Initialize with a default value

//                   if (customerTOVendor.routes && customerTOVendor.routes[0]?.legs) {
//                     const leg = customerTOVendor.routes[0]?.legs[0];

//                     // Extract distance
//                     CVdistanceTo = leg.distance.text;
//                     CVdistanceTo = CVdistanceTo.replace(/,/g, "");

//                     if (CVdistanceTo.toLowerCase().includes("mi") && !(CVdistanceTo.toLowerCase().includes("miles"))) {
//                       CVdistanceTo = CVdistanceTo.replace(/mi/g, "");
//                       CVdistanceTo = ((Number(CVdistanceTo)).toFixed(2)) + " miles";
//                     }
//                     if (CVdistanceTo.toLowerCase().includes("km")) {
//                       CVdistanceTo = CVdistanceTo.replace(/km/g, "");
//                       CVdistanceTo = ((Number(CVdistanceTo) * 0.621371).toFixed(2)) + " miles";
//                     }
//                     if (CVdistanceTo.toLowerCase().includes("m") && !(CVdistanceTo.toLowerCase().includes("miles"))) {
//                       CVdistanceTo = CVdistanceTo.replace(/m/g, "");
//                       CVdistanceTo = ((Number(CVdistanceTo) * 0.000621371).toFixed(2)) + " miles";
//                     }
//                     if (CVdistanceTo.toLowerCase().includes("ft")) {
//                       CVdistanceTo = CVdistanceTo.replace(/ft/g, "");
//                       CVdistanceTo = ((Number(CVdistanceTo) / 5280).toFixed(2)) + " miles";
//                     }
//                     if (CVdistanceTo.toLowerCase().includes("in")) {
//                       CVdistanceTo = CVdistanceTo.replace(/in/g, "");
//                       CVdistanceTo = ((Number(CVdistanceTo) / 63360).toFixed(2)) + " miles";
//                     }
//                     if (CVdistanceTo.toLowerCase().includes("yd")) {
//                       CVdistanceTo = CVdistanceTo.replace(/yd/g, "");
//                       CVdistanceTo = ((Number(CVdistanceTo) / 1760).toFixed(2)) + " miles";
//                     }
//                     CVduration = leg.duration.text;
//                   }


//                   const step1 = obj.maxBid * 0.6;
//                   const step2 = obj.maxBid * 0.8;
//                   const step3 = obj.maxBid * 0.9;
//                   let bidOptions2 = [step1, step2, step3];

//                   bidOptions2 = bidOptions2.filter(value => value >= obj.minimumBidValue);

//                   if (bidOptions2.length == 0) {
//                     bidOptions2 = [obj.maxBid];
//                   }

//                   // console.log("============",obj)

//                   // Convert array to an object with desired keys
//                   const bidOptionsObject = bidOptions2.reduce((acc, value, index) => {
//                     acc[`option${index + 1}`] = value;
//                     return acc;
//                   }, {});

//                   let durationB = OrderAddress.routes[0]
//                     ? OrderAddress.routes[0]?.legs[0]?.duration?.text
//                     : "NAN";

//                   let bidder = {
//                     id: obj.Id,
//                     type: obj.Type,
//                     PPK: obj.PPK,
//                     min: obj.min,
//                     max: obj.maxBid,
//                     type: obj.Type,
//                     Neworderid: obj.OrderId,
//                     OrderVendorName: obj.Title,
//                     OrderVendorPic: obj.ProfilePic,
//                     TotalDistanceFrom: distanceFrom,
//                     TotalDistanceTo: distanceTo,
//                     orderfrom: obj.LocOfVendor,
//                     orderto: obj.LocOfUser,
//                     TimeOut: obj.RemainingTime,
//                     TotalDurationto: durationB,
//                     TotalDurationfrom: duration,
//                     identifier: obj?.identifier,
//                     schtype: obj?.schtype,
//                     earnMore: obj?.earnMore,
//                     orderTime: obj?.orderTime,
//                     riderNote: obj.riderNote,
//                     riderCommossion: obj.riderCommossion,
//                     riderCommissionType: obj.riderCommissionType,
//                     tip: obj?.tip,
//                     Date: obj?.Date,
//                     chefStartTime: obj?.chefStartTime,
//                     CVduration: CVduration,
//                     CVdistanceTo: CVdistanceTo,
//                     bidOptions: bidOptionsObject,
//                     orderType: obj?.orderType,
//                     martandPreOrder: obj.maxBid,
//                     minimumBidValue: obj?.minimumBidValue,
//                     maximumBidValue: obj.maxBid,
//                     userAddress2: obj.userAddress2,
//                     vendorAddress2: obj.vendorAddress2,
//                   };
//                   bids.push(bidder);
//                   setErrorModel && setErrorModel(false)
//                 }

//                 dispatch(addBids(bids))
//                 EventRegister.emit('showBidModal', bids)

//                 if (EarnMore == true && bids?.length > 1) {
//                   NavigationServices && NavigationServices.navigate('MultipleBidsScreen', {
//                     BiddingAmount,
//                     bids
//                   })
//                 }


//               } else {
//                 dispatch(removeAllBids([]))

//               }
//             })
//             .catch((e) => {
//               console.log('ebids error ===>', e);
//               dispatch(IsRefreshing(false));
//               dispatch(IsLoading(false));
//             });
//         }
//       },
//       (err) => {
//         dispatch(IsLoading(false))
//         dispatch(IsRefreshing(false))
//         console.log("GetLocationAndAddress1 bids action", err);
//       },
//       {
//         enableHighAccuracy: true, timeout: 15000, maximumAge: 20000
//       }
//     );

//   } catch (error) {
//     console.log('bidssss===>', error);

//   }
// };

const GetNewBidsMain = async (UserDetail, TokenId, isUserOnline, BiddingAmount, setErrorModel, dispatch) => {
  try {
    if (UserDetail?.Id == undefined) {
      console.log('error no user ');
      return null
    }
    await locationPermission();
    Geolocation.getCurrentPosition(
      async (position) => {

        dispatch(IsRefreshing(true));
        dispatch(IsLoading(true))

        if (UserDetail?.OnlineStatus == 0 && isUserOnline == undefined) {
          dispatch(IsRefreshing(false));
          dispatch(IsLoading(false))
        } else {

          const URL = `api/V3DmsBid?status=${UserDetail.Type == null ? "0" : UserDetail.Type}&riderid=${UserDetail?.Id}&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;

          GET_METHOD_AUTH(URL, TokenId)
            .then(async (res) => {

              let latitude = position.coords.latitude;
              let longitude = position.coords.longitude;
              var start = latitude + "," + longitude;
              let EarnMore = false
              var bids = [];
              if (res.length > 0 && res != "No record found") {
                for (var i = 0; i < res.length; i++) {
                  var obj = res[i];
                  var venderCoords = JSON.parse(obj.CoordinatesOfVendor);
                  var destination = venderCoords.lat + "," + venderCoords.long;
                  let distanceFrom = obj.Distance;
                  distanceFrom = distanceFrom.replace(/,/g, "");


                  if (obj.earnMore == true) {
                    EarnMore = true
                  }

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

                  const numericDistance = parseFloat(distanceFrom.split(' ')[0]);

                  let FinalBidAmount = parseFloat(obj.minimumBidValue);
                  if (obj.minimumBidDistance && obj.costPerMile) {
                    if (numericDistance > obj.minimumBidDistance) {
                      const additionalCost = parseFloat(obj.costPerMile) * (numericDistance - Number(obj.minimumBidDistance || 0));
                      FinalBidAmount = parseFloat(obj.minimumBidValue) + additionalCost;
                      FinalBidAmount = parseFloat(FinalBidAmount);
                    }
                  }

                  const GetAddressOfBid = await fetch(
                    `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${GOOGLE_API}`
                  );
                  let OrderAddress = await GetAddressOfBid.json();
                  let duration = obj.Duration ? obj.Duration : "0.00 miles";
                  let distanceTo = "0.00 miles";
                  if (OrderAddress.routes && OrderAddress.routes[0]?.legs) {

                    distanceTo = OrderAddress.routes[0]?.legs[0]?.distance.text;
                    distanceTo = distanceTo.replace(/,/g, "");


                    if (distanceTo.toLowerCase().includes("mi") && !(distanceTo.toLowerCase().includes("miles"))) {
                      distanceTo = distanceTo.replace(/mi/g, "");
                      distanceTo = ((Number(distanceTo)).toFixed(2)) + " miles";
                    }
                    if (distanceTo.toLowerCase().includes("km")) {
                      distanceTo = distanceTo.replace(/km/g, "");
                      distanceTo = ((Number(distanceTo) * 0.621371).toFixed(2)) + " miles";
                    }
                    if (distanceTo.toLowerCase().includes("m") && !(distanceTo.toLowerCase().includes("miles"))) {
                      distanceTo = distanceTo.replace(/m/g, "");
                      distanceTo = ((Number(distanceTo) * 0.000621371).toFixed(2)) + " miles";
                    }
                    if (distanceTo.toLowerCase().includes("ft")) {
                      distanceTo = distanceTo.replace(/ft/g, "");
                      distanceTo = ((Number(distanceTo) / 5280).toFixed(2)) + " miles";
                    }
                    if (distanceTo.toLowerCase().includes("in")) {
                      distanceTo = distanceTo.replace(/in/g, "");
                      distanceTo = ((Number(distanceTo) / 63360).toFixed(2)) + " miles";
                    }
                    if (distanceTo.toLowerCase().includes("yd")) {
                      distanceTo = distanceTo.replace(/yd/g, "");
                      distanceTo = ((Number(distanceTo) / 1760).toFixed(2)) + " miles";
                    }
                  }

                  var CustomerCoords = JSON.parse(obj.CoordinatesOfUser);
                  var CustomerDestination = CustomerCoords.latitude + "," + CustomerCoords.longitude;

                  const CustomerTOVendor = await fetch(
                    `https://maps.googleapis.com/maps/api/directions/json?origin=${CustomerDestination}&destination=${destination}&key=${GOOGLE_API}`
                  );

                  let customerTOVendor = await CustomerTOVendor.json();
                  let CVduration = "0 mins"; // Initialize with a default value
                  let CVdistanceTo = "0.00 miles"; // Initialize with a default value

                  if (customerTOVendor.routes && customerTOVendor.routes[0]?.legs) {
                    const leg = customerTOVendor.routes[0]?.legs[0];

                    // Extract distance
                    CVdistanceTo = leg.distance.text;
                    CVdistanceTo = CVdistanceTo.replace(/,/g, "");

                    if (CVdistanceTo.toLowerCase().includes("mi") && !(CVdistanceTo.toLowerCase().includes("miles"))) {
                      CVdistanceTo = CVdistanceTo.replace(/mi/g, "");
                      CVdistanceTo = ((Number(CVdistanceTo)).toFixed(2)) + " miles";
                    }
                    if (CVdistanceTo.toLowerCase().includes("km")) {
                      CVdistanceTo = CVdistanceTo.replace(/km/g, "");
                      CVdistanceTo = ((Number(CVdistanceTo) * 0.621371).toFixed(2)) + " miles";
                    }
                    if (CVdistanceTo.toLowerCase().includes("m") && !(CVdistanceTo.toLowerCase().includes("miles"))) {
                      CVdistanceTo = CVdistanceTo.replace(/m/g, "");
                      CVdistanceTo = ((Number(CVdistanceTo) * 0.000621371).toFixed(2)) + " miles";
                    }
                    if (CVdistanceTo.toLowerCase().includes("ft")) {
                      CVdistanceTo = CVdistanceTo.replace(/ft/g, "");
                      CVdistanceTo = ((Number(CVdistanceTo) / 5280).toFixed(2)) + " miles";
                    }
                    if (CVdistanceTo.toLowerCase().includes("in")) {
                      CVdistanceTo = CVdistanceTo.replace(/in/g, "");
                      CVdistanceTo = ((Number(CVdistanceTo) / 63360).toFixed(2)) + " miles";
                    }
                    if (CVdistanceTo.toLowerCase().includes("yd")) {
                      CVdistanceTo = CVdistanceTo.replace(/yd/g, "");
                      CVdistanceTo = ((Number(CVdistanceTo) / 1760).toFixed(2)) + " miles";
                    }
                    CVduration = leg.duration.text;
                  }


                  let durationB = OrderAddress.routes[0]
                    ? OrderAddress.routes[0]?.legs[0]?.duration?.text
                    : "NAN";

                  let bidder = {
                    id: obj.Id,
                    type: obj.Type,
                    PPK: obj.PPK,
                    min: obj.min,
                    max: obj.maxBid,
                    type: obj.Type,
                    Neworderid: obj.OrderId,
                    OrderVendorName: obj.Title,
                    OrderVendorPic: obj.ProfilePic,
                    TotalDistanceFrom: distanceFrom,
                    TotalDistanceTo: distanceTo,
                    orderfrom: obj.LocOfVendor,
                    orderto: obj.LocOfUser,
                    TimeOut: obj.RemainingTime,
                    TotalDurationto: durationB,
                    TotalDurationfrom: duration,
                    identifier: obj?.identifier,
                    schtype: obj?.schtype,
                    earnMore: obj?.earnMore,
                    orderTime: obj?.orderTime,
                    riderNote: obj.riderNote,
                    riderCommossion: obj.riderCommossion,
                    riderCommissionType: obj.riderCommissionType,
                    tip: obj?.tip,
                    Date: obj?.Date,
                    chefStartTime: obj?.chefStartTime,
                    CVduration: CVduration,
                    CVdistanceTo: CVdistanceTo,
                    orderType: obj?.orderType,
                    martandPreOrder: obj.maxBid,
                    minimumBidValue: obj?.minimumBidValue,
                    maximumBidValue: obj.maxBid,
                    userAddress2: obj.userAddress2,
                    vendorAddress2: obj.vendorAddress2,
                    FinalBidAmount: FinalBidAmount, // Added new field
                    minimumBidDistance: obj?.minimumBidDistance, // Added for reference
                    costPerMile: obj?.costPerMile // Added for reference
                  };
                  bids.push(bidder);
                  setErrorModel && setErrorModel(false)
                }
                dispatch(addBids(bids))
                EventRegister.emit('showBidModal', bids)
              } else {
                dispatch(removeAllBids([]))
              }
            })
            .catch((e) => {
              console.log('ebids error ===>', e);
              dispatch(IsRefreshing(false));
              dispatch(IsLoading(false));
            });
        }
      },
      (err) => {
        dispatch(IsLoading(false))
        dispatch(IsRefreshing(false))
        console.log("GetLocationAndAddress1 bids action", err);
      },
      {
        enableHighAccuracy: true, timeout: 15000, maximumAge: 20000
      }
    );

  } catch (error) {
    console.log('bidssss===>', error);

  }
};

const GetBidAmount = async (SetBiddingAmount, setRadius) => {
  try {
    const bidApiRes = await GET_METHOD("api/DMSRiderDetailAcc/BidRange");
    if (bidApiRes) {
      SetBiddingAmount && SetBiddingAmount(bidApiRes);
    }

    const radiusResponse = await GET_METHOD("api/DMSRiderAcc");
    if (radiusResponse && radiusResponse.value) {
      setRadius && setRadius(radiusResponse.value);
    }
  } catch (error) { }
};

const CheckAnyPendingOrdersMain = async (UserDetail, TokenId, dispatch, navigation) => {
  UserDetail?.Id && GET_METHOD_AUTH(`api/V5DmsOrder?Ridrid=${UserDetail.Id}`, TokenId)
    .then(async (res) => {
      // console.log("?????????????????????????????????????????????????????????????", res)
      let OrderId = res?.Orders?.OrderID;
      let MartOrderCount = res?.Orders?.filter(order => order.martOrderId)?.length || 0;
      let OrdersCount = res?.Orders?.length - MartOrderCount || 0;

      let OrderId2 = (res?.Orders && res?.Orders?.length > 0) && res?.Orders[0]?.OrderID;
      let BidId = (res?.Bids && res?.Bids?.length > 0) && res?.Bids[0]?.OrderId;

      if (res?.Orders?.message == "No active deliveries currently. Stay online to receive new orders.") {
        dispatch(
          setRideStatus({
            RasturantOngoingOrder: false,
            MartOngoingJobs: false,
            Status: "",
            OrderId: "",
            BidsCount: res?.Bids?.length || 0,
            OrdersCount: OrdersCount,
            MartOrderCount: MartOrderCount
          })
        )

      }

      if (res?.Orders?.Type == "mart" && res?.Orders?.currentStatus != "21") {

        if (res?.Orders?.length > 0 || res?.Bids?.length > 0) {
          setTutorialModal && setTutorialModal(false)
          navigation.navigate("ResturantOrder", {
            OrderId: OrderId2 ? OrderId2 : BidId,
          })
        } else if (res?.Orders?.Status == "1") {
          dispatch(
            setRideStatus({
              RasturantOngoingOrder: false,
              MartOngoingJobs: true,
              Status: res?.Orders?.currentStatus == 17 ? "Schedule Job Confirm" : "Continue Delivery",
              OrderId: OrderId,
              OrderType: res?.Orders?.scheduleType,
              orderTime: res?.Orders?.orderTime,
              currentStatus: res?.Orders?.currentStatus,
              BidsCount: res?.Bids?.length || 0,
              OrdersCount: OrdersCount,
              MartOrderCount: MartOrderCount
            })
          )

        } else if (res?.Orders?.Status == "2" || res?.Orders?.Status == "21") {
          dispatch(
            setRideStatus({
              RasturantOngoingOrder: false,
              MartOngoingJobs: true,
              Status: "Waiting for\nbid acceptance",
              OrderId: OrderId,
              OrderType: res?.Orders?.scheduleType,
              orderTime: res?.Orders?.orderTime,
              currentStatus: res?.Orders?.currentStatus,
              BidsCount: res?.Bids?.length,
              OrdersCount: res?.Orders?.length,
              BidsCount: res?.Bids?.length || 0,
              OrdersCount: OrdersCount,
              MartOrderCount: MartOrderCount
            })
          )

        } else {
          dispatch(
            setRideStatus({
              RasturantOngoingOrder: false,
              MartOngoingJobs: false,
              Status: "",
              OrderId: "",
              BidsCount: res?.Bids?.length || 0,
              OrdersCount: OrdersCount,
              MartOrderCount: MartOrderCount
            })
          )

        }
      } else if (res?.Orders?.Type == "Chef") {
        if (res?.Orders?.Status == 1) {
          dispatch(
            setRideStatus({
              RasturantOngoingOrder: true,
              MartOngoingJobs: false,
              Status: "Continue Delivery",
              OrderId: OrderId,
              BidsCount: res?.Bids?.length || 0,
              OrdersCount: OrdersCount,
              MartOrderCount: MartOrderCount
            })
          )

        } else if (res?.Orders?.Status == 2) {
          dispatch(
            setRideStatus({
              RasturantOngoingOrder: true,
              MartOngoingJobs: false,
              Status: "Waiting for\nbid acceptance",
              OrderId: OrderId,
              BidsCount: res?.Bids?.length || 0,
              OrdersCount: OrdersCount,
              MartOrderCount: MartOrderCount
            })
          )

        }
      } else {
        dispatch(
          setRideStatus({
            RasturantOngoingOrder: false,
            MartOngoingJobs: false,
            Status: "",
            OrderId: "",
            BidsCount: res?.Bids?.length || 0,
            OrdersCount: OrdersCount,
            MartOrderCount: MartOrderCount
          })
        )

      }
    })
    .catch((Err) => {
      console.log("CheckAnyOrderProgress Err===> ", Err);
    });
};

const CheckOrderProgressFinalMain = async (UserDetail, navigation, r, setLoading, TokenId, orderType, seterrorModal, setmodalmsg, setTutorialModal, dispatch) => {
  try {
    setLoading(true);
    UserDetail?.Id && GET_METHOD_AUTH(`api/V5DmsOrder?Ridrid=${UserDetail.Id}`, TokenId)
      .then(async (res) => {
        console.log('res',res);
        setLoading(false)
        let OrderId = (res?.Orders && res?.Orders?.length > 0) && res?.Orders[0]?.OrderID;
        let BidId = (res?.Bids && res?.Bids?.length > 0) && res?.Bids[0]?.OrderId;
        let MartOrderCount = res?.Orders?.filter(order => order.martOrderId)?.length || 0;
        let OrdersCount = res?.Orders?.length - MartOrderCount || 0;


        if (res.message == "No active deliveries currently. Stay online to receive new orders.") {
          dispatch(setRideStatus({
            RasturantOngoingOrder: false,
            MartOngoingJobs: false,
            Status: "",
            OrderId: "",
            BidsCount: res?.Bids?.length || 0,
            OrdersCount: OrdersCount,
            MartOrderCount: MartOrderCount
          }))



          if (orderType && UserDetail?.isDisabled == 0 && orderType != "any") {
            // setmodalmsg(`No current order of ${orderType}`);
            setmodalmsg(`No ongoing jobs right now. Stay online for upcoming jobs.`);
            seterrorModal(true);
          }
          if (orderType && UserDetail?.isDisabled == 1 && orderType != "any") {
            setmodalmsg(`You are blocked from admin`);
            seterrorModal(true);
          }
          return null;
        }

        if (orderType == "mart") {

          if (UserDetail?.isDisabled == 0) {
            setmodalmsg(res.message == 'Set yourself online to accept orders.' ? res.message : `No current order of ${orderType}`);
            seterrorModal(true);
          }
          if (UserDetail?.isDisabled == 1) {
            setmodalmsg(`You are blocked from admin`);
            seterrorModal(true);
          }
          return null;
        }
        if (orderType == "restaurant" || orderType == 'any') {
          if (res?.Orders?.length > 0 || res?.Bids?.length > 0) {
            setTutorialModal && setTutorialModal(false)
            navigation.navigate("ResturantOrder", {
              OrderId: OrderId ? OrderId : BidId,
            });
            dispatch(setRideStatus({
              RasturantOngoingOrder: true,
              MartOngoingJobs: false,
              Status: "Continue Delivery",
              OrderId: OrderId,
              BidsCount: res?.Bids?.length || 0,
              OrdersCount: OrdersCount,
            }))

            return 0
          } else if (res?.Orders?.OrderStatus == 2) {
            dispatch(setRideStatus({
              RasturantOngoingOrder: true,
              MartOngoingJobs: false,
              Status: "Waiting for\nbid acceptance",
              OrderId: OrderId,
              BidsCount: res?.Bids?.length || 0,
              MartOrderCount: MartOrderCount
            }))


          } else {
            if (orderType != 'any') {
              if (UserDetail?.isDisabled == 0) {
                setmodalmsg(res.message == 'Set yourself online to accept orders.' ? res.message : `No current order of ${orderType}`);
                seterrorModal(true);
              }
              if (UserDetail?.isDisabled == 1) {
                setmodalmsg(`You are blocked from admin`);
                seterrorModal(true);
              }
            }
            dispatch(
              setRideStatus({
                RasturantOngoingOrder: false,
                MartOngoingJobs: false,
                Status: "",
                OrderId: "",
                BidsCount: res?.Bids?.length || 0,
                OrdersCount: OrdersCount,
                MartOrderCount: MartOrderCount
              })
            )
          }

          return null;
        }

      })
      .catch((Err) => {
        setLoading(false);
        console.log("CheckAnyOrderProgress Err===> ", Err);
      });
  } catch (error) {
    setLoading(false)
    console.log("CheckAnyOrderProgress Err===> ", error);
  }
};


const checkOrderForMarts = async (UserDetail, navigation, setLoading, TokenId, seterrorModal, setmodalmsg, dispatch, isNavigate, isPress) => {
  try {
    setLoading(true);
    UserDetail?.Id && GET_METHOD_AUTH(`api/V5DmsOrder?Ridrid=${UserDetail.Id}`, TokenId)
      .then(async (res) => {
        setLoading(false)
        // console.log('res marts==>', res)
        let OrderId = (res?.Orders && res?.Orders?.length > 0) && res?.Orders[0]?.OrderID;


        dispatch(setRideStatusMart({
          MartOngoingJobs: res?.Orders?.length > 0 ? true : false,
          Status: "",
          OrderId: OrderId,
          OrdersCount: res?.Orders?.length || 0
        }))

        if (isNavigate == true && res?.Orders?.length > 0) {
          NavigationServices.navigate("ResturantOrder", {
            OrderId: OrderId
          });
        }

        if (res.message == "No active deliveries currently. Stay online to receive new orders.") {
          if (UserDetail?.isDisabled == 0 && isPress) {
            setmodalmsg(`No ongoing jobs of Marts.`);
            seterrorModal(true);
          }
          if (UserDetail?.isDisabled == 1 && isPress) {
            setmodalmsg(`You are blocked from admin`);
            seterrorModal(true);
          }
          return null;
        }


        if (UserDetail?.isDisabled == 0 && isPress) {
          setmodalmsg(res.message == 'Set yourself online to accept orders.' ? res.message : `No current order of Marts`);
          seterrorModal(true);
        }
        if (UserDetail?.isDisabled == 1 && isPress) {
          setmodalmsg(`You are blocked from admin`);
          seterrorModal(true);
        }

      })
      .catch((Err) => {
        setLoading(false);
        console.log("CheckAnyOrderProgress Err===> ", Err);
      });
  } catch (error) {
    setLoading(false)
    console.log("CheckAnyOrderProgress Err===> ", error);
  }
};


const GetNewBidsMainWithoutLocationPermission = async (UserDetail, TokenId, isUserOnline, BiddingAmount, setErrorModel, dispatch) => {

  if (UserDetail?.Id == undefined) {
    return null
  }

  Geolocation.getCurrentPosition(
    async (position) => {

      dispatch(IsRefreshing(true));
      dispatch(IsLoading(true))

      if (UserDetail?.OnlineStatus == 0 && isUserOnline == undefined) {
        dispatch(IsRefreshing(false));
        dispatch(IsLoading(false))
      } else {

        const URL = `api/V3DmsBid?status=${UserDetail.Type == null ? "0" : UserDetail.Type}&riderid=${UserDetail?.Id}&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;

        GET_METHOD_AUTH(URL, TokenId)
          .then(async (res) => {

            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            var start = latitude + "," + longitude;
            let EarnMore = false
            var bids = [];
            if (res.length > 0 && res != "No record found") {
              for (var i = 0; i < res.length; i++) {
                var obj = res[i];
                var venderCoords = JSON.parse(obj.CoordinatesOfVendor);
                var destination = venderCoords.lat + "," + venderCoords.long;
                let distanceFrom = obj.Distance;
                distanceFrom = distanceFrom.replace(/,/g, "");


                if (obj.earnMore == true) {
                  EarnMore = true
                }

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

                const numericDistance = parseFloat(distanceFrom.split(' ')[0]);

                let FinalBidAmount = parseFloat(obj.minimumBidValue);
                if (obj.minimumBidDistance && obj.costPerMile) {
                  if (numericDistance > obj.minimumBidDistance) {
                    const additionalCost = parseFloat(obj.costPerMile) * (numericDistance - Number(obj.minimumBidDistance || 0));
                    FinalBidAmount = parseFloat(obj.minimumBidValue) + additionalCost;
                    FinalBidAmount = parseFloat(FinalBidAmount);
                  }
                }

                const GetAddressOfBid = await fetch(
                  `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${GOOGLE_API}`
                );
                let OrderAddress = await GetAddressOfBid.json();
                let duration = obj.Duration ? obj.Duration : "0.00 miles";
                let distanceTo = "0.00 miles";
                if (OrderAddress.routes && OrderAddress.routes[0]?.legs) {

                  distanceTo = OrderAddress.routes[0]?.legs[0]?.distance.text;
                  distanceTo = distanceTo.replace(/,/g, "");


                  if (distanceTo.toLowerCase().includes("mi") && !(distanceTo.toLowerCase().includes("miles"))) {
                    distanceTo = distanceTo.replace(/mi/g, "");
                    distanceTo = ((Number(distanceTo)).toFixed(2)) + " miles";
                  }
                  if (distanceTo.toLowerCase().includes("km")) {
                    distanceTo = distanceTo.replace(/km/g, "");
                    distanceTo = ((Number(distanceTo) * 0.621371).toFixed(2)) + " miles";
                  }
                  if (distanceTo.toLowerCase().includes("m") && !(distanceTo.toLowerCase().includes("miles"))) {
                    distanceTo = distanceTo.replace(/m/g, "");
                    distanceTo = ((Number(distanceTo) * 0.000621371).toFixed(2)) + " miles";
                  }
                  if (distanceTo.toLowerCase().includes("ft")) {
                    distanceTo = distanceTo.replace(/ft/g, "");
                    distanceTo = ((Number(distanceTo) / 5280).toFixed(2)) + " miles";
                  }
                  if (distanceTo.toLowerCase().includes("in")) {
                    distanceTo = distanceTo.replace(/in/g, "");
                    distanceTo = ((Number(distanceTo) / 63360).toFixed(2)) + " miles";
                  }
                  if (distanceTo.toLowerCase().includes("yd")) {
                    distanceTo = distanceTo.replace(/yd/g, "");
                    distanceTo = ((Number(distanceTo) / 1760).toFixed(2)) + " miles";
                  }
                }

                var CustomerCoords = JSON.parse(obj.CoordinatesOfUser);
                var CustomerDestination = CustomerCoords.latitude + "," + CustomerCoords.longitude;

                const CustomerTOVendor = await fetch(
                  `https://maps.googleapis.com/maps/api/directions/json?origin=${CustomerDestination}&destination=${destination}&key=${GOOGLE_API}`
                );

                let customerTOVendor = await CustomerTOVendor.json();
                let CVduration = "0 mins"; // Initialize with a default value
                let CVdistanceTo = "0.00 miles"; // Initialize with a default value

                if (customerTOVendor.routes && customerTOVendor.routes[0]?.legs) {
                  const leg = customerTOVendor.routes[0]?.legs[0];

                  // Extract distance
                  CVdistanceTo = leg.distance.text;
                  CVdistanceTo = CVdistanceTo.replace(/,/g, "");

                  if (CVdistanceTo.toLowerCase().includes("mi") && !(CVdistanceTo.toLowerCase().includes("miles"))) {
                    CVdistanceTo = CVdistanceTo.replace(/mi/g, "");
                    CVdistanceTo = ((Number(CVdistanceTo)).toFixed(2)) + " miles";
                  }
                  if (CVdistanceTo.toLowerCase().includes("km")) {
                    CVdistanceTo = CVdistanceTo.replace(/km/g, "");
                    CVdistanceTo = ((Number(CVdistanceTo) * 0.621371).toFixed(2)) + " miles";
                  }
                  if (CVdistanceTo.toLowerCase().includes("m") && !(CVdistanceTo.toLowerCase().includes("miles"))) {
                    CVdistanceTo = CVdistanceTo.replace(/m/g, "");
                    CVdistanceTo = ((Number(CVdistanceTo) * 0.000621371).toFixed(2)) + " miles";
                  }
                  if (CVdistanceTo.toLowerCase().includes("ft")) {
                    CVdistanceTo = CVdistanceTo.replace(/ft/g, "");
                    CVdistanceTo = ((Number(CVdistanceTo) / 5280).toFixed(2)) + " miles";
                  }
                  if (CVdistanceTo.toLowerCase().includes("in")) {
                    CVdistanceTo = CVdistanceTo.replace(/in/g, "");
                    CVdistanceTo = ((Number(CVdistanceTo) / 63360).toFixed(2)) + " miles";
                  }
                  if (CVdistanceTo.toLowerCase().includes("yd")) {
                    CVdistanceTo = CVdistanceTo.replace(/yd/g, "");
                    CVdistanceTo = ((Number(CVdistanceTo) / 1760).toFixed(2)) + " miles";
                  }
                  CVduration = leg.duration.text;
                }


                let durationB = OrderAddress.routes[0]
                  ? OrderAddress.routes[0]?.legs[0]?.duration?.text
                  : "NAN";

                let bidder = {
                  id: obj.Id,
                  type: obj.Type,
                  PPK: obj.PPK,
                  min: obj.min,
                  max: obj.maxBid,
                  type: obj.Type,
                  Neworderid: obj.OrderId,
                  OrderVendorName: obj.Title,
                  OrderVendorPic: obj.ProfilePic,
                  TotalDistanceFrom: distanceFrom,
                  TotalDistanceTo: distanceTo,
                  orderfrom: obj.LocOfVendor,
                  orderto: obj.LocOfUser,
                  TimeOut: obj.RemainingTime,
                  TotalDurationto: durationB,
                  TotalDurationfrom: duration,
                  identifier: obj?.identifier,
                  schtype: obj?.schtype,
                  earnMore: obj?.earnMore,
                  orderTime: obj?.orderTime,
                  riderNote: obj.riderNote,
                  riderCommossion: obj.riderCommossion,
                  riderCommissionType: obj.riderCommissionType,
                  tip: obj?.tip,
                  Date: obj?.Date,
                  chefStartTime: obj?.chefStartTime,
                  CVduration: CVduration,
                  CVdistanceTo: CVdistanceTo,
                  orderType: obj?.orderType,
                  martandPreOrder: obj.maxBid,
                  minimumBidValue: obj?.minimumBidValue,
                  maximumBidValue: obj.maxBid,
                  userAddress2: obj.userAddress2,
                  vendorAddress2: obj.vendorAddress2,
                  FinalBidAmount: FinalBidAmount,
                  minimumBidDistance: obj?.minimumBidDistance,
                  costPerMile: obj?.costPerMile
                };
                bids.push(bidder);
                setErrorModel && setErrorModel(false)
              }
              dispatch(addBids(bids))
              EventRegister.emit('showBidModal', bids)
            } else {
              dispatch(removeAllBids([]))
            }
          })
          .catch((e) => {
            console.log('ebids error ===>', e);
            dispatch(IsRefreshing(false));
            dispatch(IsLoading(false));
          });
      }
    },
    (err) => {
      dispatch(IsLoading(false))
      dispatch(IsRefreshing(false))
      console.log("GetLocationAndAddress1 bids action", err);
    },
    {
      enableHighAccuracy: true, timeout: 15000, maximumAge: 20000
    }
  );
};

const PlaceBid = async (
  onIgnoreBid,
  BidModalData,
  CloseBidModal,
  UserDetail,
  Bidamount,
  setRideStatus,
  TokenId,
  BiddingAmount,
  setmodalmsg,
  seterrorModal,
  SetPlacingBid,
  RidreProgressCheck,
  EliminateRides,
  value,
  onBidTimeOut,
  pickUpDistance,
  totalDistance,
  minBid,
  maxBid,
  dispatch,
  orders,
  setPlaceBidModal,
  setSelectedOrder,
  setOrders,
  interval,
  stopSound,
  setErrorModel,
  setModalMessage,
  setBidModalData,
  comission
) => {
  try {

    SetPlacingBid(true)
    const startTime = Date.now();
    const body = {
      RiderID: UserDetail.Id,
      Datetime: getISOFormattedDateWithGMT(),
      BidAmount: StaticMethods.getTwoDecimalPlacesString(Bidamount),
      BidStatus: 0,
      OrderId: BidModalData?.Neworderid,
      Type: BidModalData?.type,
      identifier: BidModalData?.identifier,
      tip: value?.tip || 0,
      pickUpDistance: Number(pickUpDistance.split(' ')[0]),
      totalDistance: Number(totalDistance),
      bidCom: StaticMethods.getTwoDecimalPlacesString(Number(Bidamount || 0) - Number((comission)?.replace("$", "") || 0)),
      bidComType: BidModalData?.riderCommissionType
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", `application/json`);
    myHeaders.append("Authorization", `Bearer ${TokenId}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify(body),
    };

    fetch(
      `${API_URL}${BidModalData?.orderType == 1 ? "api/V5DmsBid/PreOrder" : 'api/V4DmsBid'}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (Result) => {
        RidreProgressCheck();

        const endTime = Date.now(); // Record end time
        const elapsedTimeInSeconds = Math.round((endTime - startTime) / 1000);
        SetPlacingBid(false)
        EventRegister.emit('orderBidUpdated', [])
        if (Result?.bidStatus == 7 || Result?.bidStatus == 6) {
          EventRegister.emit('OnBidRejectedByUser', JSON.stringify({ Result: Result, ID: BidModalData?.Neworderid }))
        } else if (Result?.bidStatus == 8) {
          setModalMessage("Sorry! Another driver won this order, more chances are coming soon.");
          setErrorModel(true);
          dispatch(removeSpecificBid(BidModalData?.Neworderid));

        } else if (Result?.bidStatus == 9) {

          setModalMessage("This job is no longer available!");
          setErrorModel(true);
          dispatch(removeSpecificBid(BidModalData?.Neworderid));

        } else if (Result.status == 0) {
          try {
            // Update orders based on actual elapsed time
            setOrders((prevOrders) => {
              const updatedOrders = prevOrders
                .map((order) => ({
                  ...order,
                  remainingTime: order.remainingTime - elapsedTimeInSeconds,
                }))
                .filter(
                  (order) => {
                    return order.remainingTime > 0 && order.Neworderid != BidModalData?.Neworderid
                  }

                );

              if (updatedOrders.length > 0) {
                setSelectedOrder(updatedOrders[0]);
                setBidModalData && setBidModalData(updatedOrders[0]) // Select the next available order
              } else {
                BackgroundTimer.clearInterval(interval);
                setPlaceBidModal(false)
                stopSound()
                setmodalmsg(
                  "Your job has been placed, please wait while your job is being accepted. Your ride will automatically be started"
                );
                seterrorModal(true);
                CloseBidModal(); // Close the modal if no orders remain
                onIgnoreBid();
                EliminateRides && EliminateRides();
                dispatch(removeSpecificBid(BidModalData?.Neworderid)); 
              }

              return updatedOrders; // Update state with remaining orders
            });


            await AsyncStorage.setItem('ActiveBidPlaced', "0")

          } catch (error) {
            console.log('error', error)
          }

        } else {
          setPlaceBidModal(false);
          stopSound()
          BackgroundTimer.clearInterval(interval);
          onBidTimeOut && onBidTimeOut()
          onIgnoreBid();
        }
        return null;
      })
      .finally(() => {
        SetPlacingBid(false)
      })
      .catch((error) => {
        console.log("error", error);
        SetPlacingBid(false)
      });

  } catch (error) {
    SetPlacingBid(false)
  }
};


const PlaceBidForMart = async (
  onIgnoreBid,
  BidModalData,
  CloseBidModal,
  UserDetail,
  Bidamount,
  setRideStatus,
  TokenId,
  BiddingAmount,
  setmodalmsg,
  seterrorModal,
  SetPlacingBid,
  RidreProgressCheck,
  EliminateRides,
  value,
  onBidTimeOut,
  pickUpDistance,
  totalDistance,
  minBid,
  maxBid,
  dispatch,
  orders,
  setPlaceBidModal,
  setSelectedOrder,
  setOrders,
  interval,
  stopSound,
  setErrorModel,
  setModalMessage,
  setBidModalData,
  comission
) => {
  try {

    SetPlacingBid(true)
    const startTime = Date.now(); // Record start time
    const body = {
      RiderID: UserDetail.Id,
      Datetime: getISOFormattedDateWithGMT(),
      BidAmount: Number(Bidamount)?.toFixed(2),
      BidStatus: 0,
      OrderId: BidModalData?.Neworderid,
      Type: BidModalData?.type,
      identifier: BidModalData?.identifier,
      tip: value?.tip || 0,
      pickUpDistance: Number(pickUpDistance.split(' ')[0]),
      totalDistance: Number(totalDistance),
      bidCom: StaticMethods.getTwoDecimalPlacesString(Number(Bidamount || 0) - Number((comission)?.replace("$", "") || 0)),
      bidComType: BidModalData?.riderCommissionType
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", `application/json`);
    myHeaders.append("Authorization", `Bearer ${TokenId}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify(body),
    };

    fetch(
      `${API_URL}${"api/V2DmsBid/V3Mart"}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (Result) => {
        RidreProgressCheck();

        const endTime = Date.now(); // Record end time
        const elapsedTimeInSeconds = Math.round((endTime - startTime) / 1000);
        SetPlacingBid(false)
        EventRegister.emit('orderBidUpdated', [])
        if (Result?.bidStatus == 6) {
          EventRegister.emit('OnBidRejectedByUser', JSON.stringify({ Result: Result, ID: BidModalData?.Neworderid }))
        } else if (Result?.bidStatus == 8) {
          setModalMessage("Sorry! Another driver won this order, more chances are coming soon.");
          setErrorModel(true);
          dispatch(removeSpecificBid(BidModalData?.Neworderid)); 

        } else if (Result?.bidStatus == 7 || Result?.bidStatus == 9) {
          setModalMessage("This job is no longer available!");
          setErrorModel(true);
          dispatch(removeSpecificBid(BidModalData?.Neworderid)); 

        } else if (Result.status == 0) {
          try {
            // Update orders based on actual elapsed time
            setOrders((prevOrders) => {
              const updatedOrders = prevOrders
                .map((order) => ({
                  ...order,
                  remainingTime: order.remainingTime - elapsedTimeInSeconds,
                }))
                .filter(
                  (order) => {
                    return order.remainingTime > 0 && order.Neworderid != BidModalData?.Neworderid
                  }

                );
              if (updatedOrders.length > 0) {
                setSelectedOrder(updatedOrders[0]);
                setBidModalData && setBidModalData(updatedOrders[0]) // Select the next available order
              } else {
                BackgroundTimer.clearInterval(interval);
                setPlaceBidModal(false)
                stopSound()
                setmodalmsg(
                  "Your job has been placed, please wait while your job is being accepted. Your ride will automatically be started"
                );
                seterrorModal(true);
                CloseBidModal(); // Close the modal if no orders remain
                onIgnoreBid();
                EliminateRides && EliminateRides();
                dispatch(removeSpecificBid(BidModalData?.Neworderid)); 
              }

              return updatedOrders; // Update state with remaining orders
            });


            await AsyncStorage.setItem('ActiveBidPlaced', "0")

          } catch (error) {
            console.log('error', error)
          }

        } else {
          setPlaceBidModal(false);
          stopSound()
          BackgroundTimer.clearInterval(interval);
          onBidTimeOut && onBidTimeOut()
          onIgnoreBid();
        }
        return null;
      })
      .finally(() => {
        SetPlacingBid(false)
      })
      .catch((error) => {
        console.log("error", error);
        SetPlacingBid(false)
      });

  } catch (error) {
    SetPlacingBid(false)
  }
};

export {
  GetNewBidsMain,
  PlaceBid,
  GetBidAmount,
  CheckAnyPendingOrdersMain,
  GetNewBidsMainWithoutLocationPermission,
  CheckOrderProgressFinalMain,
  PlaceBidForMart,
  checkOrderForMarts
};

