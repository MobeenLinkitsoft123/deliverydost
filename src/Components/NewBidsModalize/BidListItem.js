import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import BackgroundTimer from 'react-native-background-timer';

import { ResponsiveFonts } from "../../constants/ResponsiveFonts";
import colors from "../../styles/colors";
import { verticalScale, moderateScale } from "../../styles/responsiveSize";
import moment from "moment";

const BidListItem = ({ value, setPlaceBidModal, setItemCount, ItemCount, time, UserDetailType }) => {
  const [intervalSeconds, setIntervalSeconds] = useState(value.TimeOut ? value.TimeOut : time ? time : value.TimeOut);
  const [intervalID, setIntervalID] = useState(null);
  const intervalRef = useRef(intervalSeconds);  // Using ref to track current interval seconds

  const bidTimer = 120;

  const startTimer = () => {
    const intervalId = BackgroundTimer.setInterval(() => {
      const currentTime = moment();
      const cookingElapsedTime = currentTime.diff(value?.chefStartTime, 's');
      const newTime = bidTimer - cookingElapsedTime;

      // Update ref directly
      intervalRef.current = newTime;

      // Ensure state is updated with the latest value
      setIntervalSeconds(newTime);
    }, 1000);
    setIntervalID(intervalId);
  };

  useEffect(() => {
    if (intervalSeconds > 0 && !intervalID) {
      startTimer();
    }
    return () => {
      if (intervalID) {
        BackgroundTimer.clearInterval(intervalID);
        setIntervalID(null);
      }
    };
  }, [intervalSeconds, intervalID]);

  useEffect(() => {
    if (intervalSeconds <= 0 && intervalID) {
      BackgroundTimer.clearInterval(intervalID);
      setIntervalID(null);
    }
  }, [intervalSeconds, intervalID]);

  // If timer hits zero, stop the timer and mark the item
  if (intervalSeconds <= 0) {
    if (!ItemCount.includes(value.id)) {
      setItemCount([...ItemCount, value.id]);
    }
    return null;
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.Itemcontainer}
        onPress={() => setPlaceBidModal(value, intervalSeconds)}
      >
        <View style={styles.row}>
          <View style={styles.imageWrapper}>
            <View style={styles.imgContainer}>
              <Image
                source={{ uri: value?.OrderVendorPic }}
                style={styles.resrturentImg}
                resizeMode={"cover"}
              />
            </View>
          </View>
          <View style={styles.vendorDetails}>
            <Text style={[styles.text, ResponsiveFonts.textualStyles.large, styles.vendorName]}>
              {value.OrderVendorName}
            </Text>
            {value.tip > 0 && (
              <Text style={[styles.text, ResponsiveFonts.textualStyles.mediumNormal]}>
                Your Tip : <Text style={[styles.text4, ResponsiveFonts.textualStyles.medium]}>
                  ${(value.tip)?.toFixed(2)}
                </Text>
              </Text>
            )}
          </View>
          <View style={styles.timerContainer}>
            <View style={styles.timerBox}>
              <Text style={[styles.text3, ResponsiveFonts.textualStyles.small, styles.timerText]}>
                {"   "}Bid cancel in
              </Text>
              <Text
                style={[
                  styles.text3,
                  ResponsiveFonts.textualStyles.medium,
                  styles.timerSeconds,
                ]}
              >
                {intervalSeconds} sec
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.distanceContainer}>
          <View style={styles.distanceWrapper}>
            <Text style={[styles.text2, ResponsiveFonts.textualStyles.mediumNormal, styles.distanceLabel]}>
              Pick up to Drop off :
            </Text>
            <Text style={[styles.text, ResponsiveFonts.textualStyles.medium, styles.distanceValue]}>
              {value?.TotalDistanceFrom}{" "}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BidListItem;


const styles = StyleSheet.create({
  modalStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
  },
  info: {
    alignItems: "flex-start",
    width: "67%",
    marginLeft: moderateScale(15)
  },
  time: {
    justifyContent: "center",
  },
  text: {
    color: colors.blackOpacity60,
  },
  text2: {
    color: colors.blackOpacity25,
  },
  text3: {
    color: colors.white,
  },
  text4: {
    color: colors.theme,
  },
  title: {
    color: colors.theme,
    margin: moderateScale(5),
    textAlign: "center",
  },
  Itemcontainer: {
    width: "100%",
    marginTop: verticalScale(30),
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: '#fff3f5',
    borderRadius: 10,
  },
  container: {
    width: "95%",
    alignSelf: "center",
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(20),
  },
  icon: {
    height: verticalScale(100),
    width: moderateScale(100),
    alignSelf: "center",
    marginTop: verticalScale(30),
    marginBottom: verticalScale(20),
  },
  okayicon: {
    height: verticalScale(60),
    width: moderateScale(60),
  },
  HEADER: {
    alignItems: "center",
    paddingHorizontal: 5,
  },
  row2: {
    alignSelf: "center",
    marginTop: verticalScale(20),
  },
  resrturentImg: {
    height: "100%",
    width: "100%",
  },
  imgContainer: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderRadius: verticalScale(25),
    overflow: "hidden",
  },
  imagheader: {
    position: "absolute",
    bottom: 0,
    top: verticalScale(8),
    marginLeft: 1,
  },
  imagheader2: {
    position: "absolute",
    bottom: 5,
    top: 6,
    marginLeft: 1,
  },
  vendorName: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
  },
  imageWrapper: {
    width: '15%',
    paddingTop: 10,
    paddingLeft: 10
  },
  vendorDetails: {
    width: '50%',
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 10
  },
  timerContainer: {
    width: '35%',
    alignItems: 'flex-end',
  },
  timerBox: {
    backgroundColor: colors.theme,
    borderBottomLeftRadius: 50,
    paddingHorizontal: 15,
    paddingTop: verticalScale(12),
    borderTopRightRadius: 10,
  },
  timerText: {
    marginTop: 10,
    textAlign: 'center',
  },
  timerSeconds: {
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 15,
  },
  distanceContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  distanceWrapper: {
    width: '100%',
    flexDirection: 'row',
  },
  distanceLabel: {
    color: 'gray',
    paddingLeft: moderateScale(15),
  },
  distanceValue: {
    color: 'black',
    paddingLeft: moderateScale(10),
  },
});
