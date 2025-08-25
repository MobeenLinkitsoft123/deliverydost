import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";

import colors from "../../../styles/colors";
import { moderateScale, verticalScale } from "../../../styles/responsiveSize";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import { decryptVale } from "../../../utils/Crypto";
import { getComissionValue, getComissionValueBidHistory, getTwoDecimalPlacesString } from "../../../Store/Action/HelperActions";
import { StaticMethods } from "../../../utils/StaticMethods";
import { convertToISOFormat, dateFormatter } from "../../../Store/Action/AppFunctions";
import AllOrderStatus from "../../../utils/AllOrderStatus";

const ItemList = ({ data, openOrderDetailModal }) => {
  const OrderStatus =
    data?.OrderStatus == AllOrderStatus.CompleteOrder && data?.chefStatus == AllOrderStatus.chefCompleteORder || data?.OrderStatus == AllOrderStatus.CompleteOrder
      ? "DELIVERED"
      : data?.OrderStatus == AllOrderStatus.WaitingForBidAcceptance && data?.chefStatus == AllOrderStatus.ChefWaitingForOrderAccept
        ? "ASSIGNED"
        : data?.OrderStatus == AllOrderStatus.StartRideFirst || data?.OrderStatus == AllOrderStatus.Reached && data?.chefStatus == AllOrderStatus.ChefAutoAccept
          ? "ASSIGNED"
          : data?.OrderStatus == AllOrderStatus.Reached && data?.chefStatus == AllOrderStatus.ChefAccept || data?.OrderStatus == AllOrderStatus.Reached
            ? "ASSIGNED"
            : data?.OrderStatus == AllOrderStatus.StartRide && data?.chefStatus == AllOrderStatus.RiderReachedRest || data?.OrderStatus == AllOrderStatus.StartRide
              ? "AT PICKUP"
              : data?.OrderStatus == AllOrderStatus.StartRide && data?.chefStatus == AllOrderStatus.OrderDispatchChef
                ? "RECEIVED TAKEAWAY"
                : data?.OrderStatus == AllOrderStatus.OrderDispatch && data?.chefStatus == AllOrderStatus.RiderStartRideToCustomer || data?.OrderStatus == AllOrderStatus.OrderDispatch
                  ? "RECEIVED TAKEAWAY"
                  : data?.OrderStatus == AllOrderStatus.FinishRide && data?.chefStatus == AllOrderStatus.RiderFinishRider || data?.OrderStatus == AllOrderStatus.FinishRide
                    ? "AT DROP OFF"
                    : data?.OrderStatus == AllOrderStatus.CancelledByAdmin || data?.OrderStatus == AllOrderStatus.CancelledByAdmin1
                      ? "CANCELLED BY ADMIN"
                      : "NAN";

  const dateTime = dateFormatter(data?.Starttime);
  const dateTimeForVersion0 = moment(data?.Starttime).format("M/D/YYYY, h:mm:ss A");

  const pickupAddress = data?.RiderPickupLoc?.replace(/ /g, " ");
  const deliveryAddress = data?.RiderDropOffLoc?.replace(/ /g, "+");
  const commission = getComissionValue(data?.riderComissionType, getTwoDecimalPlacesString(data?.riderComission), data?.BidAmtFinal, false);

  const comission = getComissionValueBidHistory(data?.riderComissionType, data?.riderComission, data?.BidAmtFinal);
  const totalReciveableAmount = StaticMethods.getTwoDecimalPlacesString(Number(comission?.valueAfterMinus) + Number(data?.tip))

  const returnDistance = (a, b) => {
    return data.TotalDistanceD
  }

  const returnTotalTime = () => {
    const endTime = moment(convertToISOFormat(data.Endtime));
    const startTime = moment(convertToISOFormat(data.Starttime));

    // Calculate the difference in minutes
    const diffInMinutes = endTime.diff(startTime, 'minutes');
    // Check if the difference is less than 0 minutes
    if (diffInMinutes <= 0) {
      // Calculate the difference in seconds if less than 0 minutes
      const diffInSeconds = endTime.diff(startTime, 'seconds');
      return `${diffInSeconds} secs`
    } else {
      return `${diffInMinutes} mins`
    }
  }

  // console.log("data>>>>>>>>>>>>",data)
  return (
    <View style={styles.cardContainer}>

      <View style={[styles.header, { backgroundColor: data.version == 0 ? colors.orange : colors.theme }]}>
        <Text style={[styles.orderNumber, ResponsiveFonts.textualStyles.smallBold]}>Order # {data?.OrderID}</Text>
        <Text style={[styles.dateTime, ResponsiveFonts.textualStyles.small]}>{(data?.version == 1 || data?.Type == 'mart') ? dateTime : dateTimeForVersion0}</Text>
      </View>

      <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
        <View style={styles.row2}>
          <View style={styles.row}>
            <Image
              source={require("../../../assets/images/res-01.png")}
              style={styles.locationImage1}
            />
            <Text style={[styles.restaurantName, ResponsiveFonts.textualStyles.medium]}>{data?.VendorID}</Text>
          </View>
          <TouchableOpacity onPress={() => openOrderDetailModal(data)}>
            <Text style={[styles.ViewOrder, ResponsiveFonts.textualStyles.smallBold]}>View Order</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.addressContainer}>
          <Image
            source={require("../../../assets/images/Rider-order-details-Asseets-06.png")}
            style={styles.locationImage}
          />
          <View style={styles.addressDetails}>
            <Text style={[styles.addressTitle, ResponsiveFonts.textualStyles.smallBold]}>Pick Up Address</Text>
            <Text style={[styles.addressText, ResponsiveFonts.textualStyles.smallBold]}>{pickupAddress ? pickupAddress : '- - - - - - - - - - - - -'}</Text>
            {data?.vendorAddress2 && (<Text style={[styles.addressText, ResponsiveFonts.textualStyles.smallBold]}>{data?.vendorAddress2 ? data?.vendorAddress2 : ''}</Text>)}

            <Text style={[styles.addressTitle, { marginTop: 10 }, ResponsiveFonts.textualStyles.smallBold]}>Delivery Address</Text>
            <Text style={[styles.addressText, ResponsiveFonts.textualStyles.smallBold]}>{deliveryAddress ? decryptVale(deliveryAddress) : '- - - - - - - - - - - - -'}</Text>
            {data?.userAddress2 && (<Text style={[styles.addressText, ResponsiveFonts.textualStyles.smallBold]}>{data?.userAddress2 ? decryptVale(data?.userAddress2) : ''}</Text>)}
          </View>

          <View style={styles.bidTipContainer}>
            <View style={styles.bidTipBox}>
              <Text style={[styles.bidTipText, ResponsiveFonts.textualStyles.medium]}>$ {parseFloat(data?.BidAmtFinal).toFixed(2)}</Text>
              <Text style={[styles.bidTipLabel, ResponsiveFonts.textualStyles.smallBold]}>Delivery Fare</Text>
            </View>
            <View style={styles.bidTipBox}>
              <Text style={[styles.bidTipText, ResponsiveFonts.textualStyles.medium]}>$ {parseFloat(data?.tip).toFixed(2)}</Text>
              <Text style={[styles.bidTipLabel, ResponsiveFonts.textualStyles.smallBold]}>Your Tip</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={[styles.distanceTimeText1, ResponsiveFonts.textualStyles.smallBold]}>{commission}</Text>
              <Text style={[styles.distanceTimeText, ResponsiveFonts.textualStyles.small]}>FD Commission</Text>
            </View>
            <View style={styles.distanceTimeContainer}>
              <View>
                <Text style={[styles.distanceTimeText1, ResponsiveFonts.textualStyles.smallBold]}>{OrderStatus == "DELIVERED" && data.TotalDistanceD && data.TotalDistanceP ? returnDistance() : OrderStatus == "DELIVERED" && data.TotalDistanceP ? data.TotalDistanceP : OrderStatus == "DELIVERED" && data.TotalDistanceD ? data.TotalDistanceD : '-'}</Text>
                <Text style={[styles.distanceTimeText, ResponsiveFonts.textualStyles.small]}>Total Distance</Text>
              </View>
              <View>
                <Text style={[styles.distanceTimeText1, { padding: 5 }, ResponsiveFonts.textualStyles.medium]}> _ </Text>
              </View>
              <View>
                <Text style={[styles.distanceTimeText1, ResponsiveFonts.textualStyles.smallBold]}>{OrderStatus == "DELIVERED" && data.TotalTimeD ? data.TotalTimeD : OrderStatus == "DELIVERED" && data.Endtime ? returnTotalTime() : '-'}</Text>
                <Text style={[styles.distanceTimeText, ResponsiveFonts.textualStyles.small]}>Total Time</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={[styles.totalAmountText1, ResponsiveFonts.textualStyles.smallBold]}>Total Receivable Amount</Text>
              <Text style={[styles.totalAmountText, ResponsiveFonts.textualStyles.medium]}>$ {totalReciveableAmount}</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.statusText, { color: OrderStatus == "DELIVERED" ? "#2ecc71" : '#888' }, ResponsiveFonts.textualStyles.medium]}>{OrderStatus}</Text>
            </View>
          </View>
        </View>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    justifyContent: "space-between",
    marginBottom: verticalScale(5)
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: colors.theme,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  orderNumber: {
    fontWeight: "bold",
    color: "#fff",
  },
  dateTime: {
    color: "#fff",
  },
  restaurantName: {
    // paddingBottom: 5
  },
  ViewOrder: {
    color: colors.theme
  }
  ,
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5
  },
  locationImage: {
    width: 20,
    height: verticalScale(90),
    resizeMode: "contain",
    marginRight: 5,
  },
  locationImage1: {
    width: 25,
    height: verticalScale(25),
    resizeMode: "contain",
    marginRight: 10,
  },
  addressDetails: {
    flex: 1,
  },
  addressTitle: {
    color: "#333",
    marginBottom: 5,
  },
  addressText: {
    color: "#666",
  },
  bidTipContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  bidTipBox: {
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: colors.themeLight,
    borderRadius: 10,
    paddingVertical: 10,
    width: moderateScale(90),
    marginLeft: 10,
    paddingHorizontal: 4
  },
  bidTipText: {
    color: "#ff4d4d",
  },
  bidTipLabel: {
    color: "#666",
    textAlign: 'center'
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#f1f1f1",
    paddingTop: 5,
  },
  commissionText: {
    color: "#999",
  },
  distanceTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  distanceTimeText: {
    color: "#999",
  },
  distanceTimeText1: {
    color: "#000",
  },
  totalAmountText: {
    color: "#ff4d4d",
  },
  totalAmountText1: {
    color: "#000",
  },
  statusText: {
    padding: 10
  },
});

export default ItemList;
