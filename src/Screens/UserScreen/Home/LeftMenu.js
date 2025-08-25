import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Share,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { APP_VERSION } from "@env"
import FastImage from 'react-native-fast-image'
import { EventRegister } from "react-native-event-listeners";

import LeftMenuStyles from "./LeftMenuStyles";
import Label from "../../../Components/Label/Label";
import { LogOut } from "../../../Store/Reducers/AuthReducer/AuthReducer";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import colors from "../../../styles/colors";
import { LogoutUserAuth } from "../../../Store/Action/AuthFunctions";
import { GetUpdateUserProfile } from "../../../Store/Action/DashboardActions";
import styles from "./styles";

function LeftMenu({ CloseDrawer, UserDetail, radius = 0, setmodalmsg, seterrorModal }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { TokenId } = useSelector((state) => state?.AuthReducer);

  const shareOptions = {
    message: `Get the app now for the ultimate food delivery experience\nBecome a Dost with Foodosti.\n\nApple https://apps.apple.com/us/app/FoodostiDriver/id1602964934\n\nAndroid https://play.google.com/store/apps/details?id=com.deliverydost&pli=1`,

  };

  const ShareMe = () => {
    Share.share(shareOptions);
  };

  const onLogOut = () => {

    const OnScuess = async () => {
      dispatch(LogOut());
    };

    Alert.alert("Confirmation", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => { },
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            // await GetLocationAndAddress(setaddressdata, () => { }, OnSucces);

            await LogoutUserAuth(
              OnScuess,
              TokenId,
              UserDetail,
              setmodalmsg,
              seterrorModal,
              dispatch,
              CloseDrawer
            );
          } catch (error) {
            console.error("ERRORRRRR", error);
            setmodalmsg("Can not logout at this time. Please try again later");
            seterrorModal(true);
            // Alert.alert(
            //   "Alert",
            //   "Can not logout at this time. Please try again later."
            // );
          }
        },
      },
    ]);
    // LogoutUserAuth(OnScuess, TokenId, UserDetail);
  };

  const Menu = [
    {
      id: 1,
      name: "Orders",
      image: require("../../../assets/images/cart.png"),
      move: "OrdersHistory",
    },
    {
      id: 2,
      name: "Profile",
      image: require("../../../assets/images/user.png"),
      move: "Profile",
    },
    // {
    //   id: 3,
    //   name: "Bid History",
    //   image: require("../../../assets/images/history.png"),
    //   move: "BidHistory",
    // },
    {
      id: 4,
      name: "Schedule Availability",
      image: require("../../../assets/images/icon15.png"),
      move: "ScheduleAvailability",
    },
    {
      id: 5,
      name: "Invite a Friend",
      image: require("../../../assets/images/share.png"),
      fun: () => ShareMe(),
    },
    {
      id: 7,
      name: "Legal Document",
      image: require("../../../assets/images/cloud.png"),
      move: "LegalDocumentsScreen",
    },
    {
      id: 8,
      name: "Earnings",
      image: require("../../../assets/images/earnings.png"),
      move: "EarningPayout",
    },
    {
      id: 12,
      name: "Manage Notification",
      image: require("../../../assets/images/bell.png"),
      move: "ManageNotification",
    },
    {
      id: 9,
      name: "Tutorial",
      image: require("../../../assets/images/tutorial.png"),
      move: "Tutorial",
    },
    {
      id: 4,
      name: "Help",
      image: require("../../../assets/images/report.png"),
      move: "Report",
    },

    {
      id: 10,
      name: "Logout",
      image: require("../../../assets/images/logout.png"),
      fun: () => onLogOut(),
    },
  ];

  const movepage = (value) => {
    if (value?.move) {
      navigation.navigate(value?.move);
      CloseDrawer();
    }
    if (value?.fun) {
      value?.fun();
    }
  };
  useEffect(() => {
    const UpdatedProfileData = EventRegister.addEventListener(
      "UpdatedProfile",
      (data) => {
        const setLoading2 = () => { }
        GetUpdateUserProfile(
          setLoading2,
          UserDetail,
          dispatch,
          TokenId
        );
      }
    );
    return () => {
      EventRegister?.removeEventListener(UpdatedProfileData);
    };
  }, []);
  let freelance =
    UserDetail.Type == null
      ? "Freelance Driver"
      : UserDetail.Type == 0
        ? "Freelance Driver"
        : "Hired Driver";


  return (
    <>
      <View style={LeftMenuStyles.container}>
        <View style={LeftMenuStyles.con2}>
          <View style={LeftMenuStyles.ImageView}>
            <ActivityIndicator size={'small'} color={colors.white} style={{ position: 'absolute' }} />
            <FastImage
              style={LeftMenuStyles.profile}
              source={{
                uri: UserDetail?.ProfileImageURL,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>

          <View style={LeftMenuStyles.usercon}>
            <Label
              label={UserDetail?.Firstname + " " + UserDetail?.Lastname}
              color={"#fff"}
              textAlign={"center"}
              width={250}
              numberOfLines={1}
              ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
            />

            <Label
              label={freelance}
              color={"#fff"}
              textAlign={"center"}
              ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
            />
            <Label
              label={UserDetail?.city?.length > 0 ? `${UserDetail?.city}, ${UserDetail?.state}` : 'Allow Location'}
              color={"#fff"}
              textAlign={"center"}
              ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
            />
            {radius != 0 && (
              <Label
                label={"Covered Radius: " + radius + " miles"}
                color={"#fff"}
                textAlign={"center"}
                ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
              />
            )}
          </View>

          <View style={LeftMenuStyles.notverf}>
            {UserDetail?.isDisabled == 0 ? (
              <Label
                label={
                  UserDetail?.verificationStatus == 0 ? "Verified" : "Not Verified"
                }
                color={
                  UserDetail?.verificationStatus == 0 ? colors.green1 : colors.theme
                }
                textAlign={"center"}
                ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
              />
            ) : (
              <Label
                label={"Blocked"}
                color={colors.theme}
                textAlign={"center"}
                ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
              />
            )}
          </View>
        </View>

        <ScrollView style={styles.container}>
          <View style={styles.leftMenuCon}>
            <View>
              {Menu.map((value, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={LeftMenuStyles.Item}
                    onPress={() => movepage(value)}
                  >
                    <Image
                      source={value.image}
                      style={LeftMenuStyles.icon}
                      resizeMode={"contain"}
                    />
                    <Label
                      label={value.name}
                      ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                    />
                  </TouchableOpacity>
                );
              })}

              <View style={LeftMenuStyles.VersionView}>
                <Label
                  label={`${APP_VERSION}`}
                  ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                />
              </View>
            </View>
          </View>
        </ScrollView>

      </View>

      {/* {errorModal && (
        <AnimatedModal visible={errorModal} onClose={() => { seterrorModal(false) }} >
          <ModalPattern1
            setValue={seterrorModal}
            heading={modalMsg}
            btnTittle={"Okay"}
            OnPress={() => {
              setmodalmsg("");
              seterrorModal(false);
            }}
          />
        </AnimatedModal>
      )} */}

    </>
  );
}

export default LeftMenu;
