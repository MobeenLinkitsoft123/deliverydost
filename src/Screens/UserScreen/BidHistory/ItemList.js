import { View, Text, StyleSheet } from "react-native";
import React from "react";

import styles from "./Styles";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import { StaticMethods } from "../../../utils/StaticMethods";
import colors from "../../../styles/colors";
import { getComissionValueBidHistory } from "../../../Store/Action/HelperActions";
import { convertToISOFormat, dateFormatter } from "../../../Store/Action/AppFunctions";

const Tag = ({ label, color }) => {
  return (
    <View style={[styles.tagtextView, { backgroundColor: color }]}>
      <Text style={[styles.tagtext, ResponsiveFonts.textualStyles.smallBold]}>
        {label}
      </Text>
    </View>
  );
};

const DateTime = ({ dateTime }) => {
  return (
    <Text style={[styles.datetext, ResponsiveFonts.textualStyles.small]}>
      {dateTime.replace("T", " - ")}
    </Text>
  );
};


const ItemList = ({ data }) => {

  const DateConvert = (datea) => {
    return new Date(datea)?.toLocaleString("en-US")
  };

  let dates = dateFormatter(data?.Datetime);
  let datesForVersion0 = DateConvert(data?.Datetime);

  const comission = getComissionValueBidHistory(data?.riderCommissionType, data?.riderCommission, data?.BidAmount);

  return (
    <View style={styles.itemcontainer}>
      <Text style={[styles.ordertext, ResponsiveFonts.textualStyles.medium]}>
        Order ID: <Text style={{ color: "#333" }}>{data.OrderId}</Text>
      </Text>
      <DateTime dateTime={(data?.version == 1 || data?.Type == 'mart') ? dates : datesForVersion0} />
      <View style={styles.bidcon}>
        <View>
          <Text style={[styles.text1, ResponsiveFonts.textualStyles.medium]}>
            Bid: $
            {data && data.BidAmount > 0
              ? StaticMethods.getTwoDecimalPlacesString(data.BidAmount)
              : "0.00"}
          </Text>
          {data?.tip > 0 && (
            <Text style={[{ color: colors.gray }, ResponsiveFonts.textualStyles.small]}>
              Tip: <Text style={[ResponsiveFonts.textualStyles.smallBold, { color: colors.black }]}>
                {'$ '}{StaticMethods.getTwoDecimalPlacesString(data?.tip) || 0}</Text>
            </Text>
          )}
          {data?.riderCommission && (
            <Text style={[{ color: colors.gray }, ResponsiveFonts.textualStyles.small]}>
              FD commission: <Text style={[ResponsiveFonts.textualStyles.smallBold, { color: colors.black }]}>{
                `${comission?.sign == '$' ? '$ ' : ''}${comission?.value} ${comission?.sign == '%' ? '% ' : ''}`}</Text>
            </Text>
          )}

          <Text style={[{ color: colors.gray }, ResponsiveFonts.textualStyles.small]}>
            Receivable amount: <Text style={[ResponsiveFonts.textualStyles.smallBold, { color: colors.black }]}>
              $ {StaticMethods.getTwoDecimalPlacesString(Number(comission?.valueAfterMinus) + Number(data?.tip))}</Text>
          </Text>

        </View>

        {data.BidStatus == 0 || data.BidStatus == 4 ? (
          <Tag label="Pending" color="orange" />
        ) : data.BidStatus == 1 ? (
          <Tag label="Accepted" color="#2ecc71" />
        ) : data.BidStatus == 3 ? (
          <Tag label="Rejected" color="red" />
        ) : data.BidStatus == 5 ? (
          <Tag label="Rejected" color="red" />
        )
          : data.BidStatus == 7 ? (
            <Tag label="Canceled" color={colors.theme} />
          )
            : data.BidStatus == 6 ? (
              <Tag label="Late Bid" color="orange" />
            )
              : (
                <Tag label="Rejected" color="red" />
              )}
      </View>
    </View>
  );
};

export default ItemList;