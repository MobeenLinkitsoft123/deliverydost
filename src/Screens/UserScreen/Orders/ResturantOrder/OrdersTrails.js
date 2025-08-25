import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  Animated,
  Linking,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import LottieView from "lottie-react-native";

import { styles, hiden, whole } from "../../../../assets/styling/stylesheet";
import { height, moderateScale, verticalScale, width } from "../../../../styles/responsiveSize";
import { OpenGoogleMapsRestaurant, returnUserDetailData } from "../../../../utils/helperFunctions";
import { ResponsiveFonts } from "../../../../constants/ResponsiveFonts";
import KeepAwake from "@sayem314/react-native-keep-awake";
import { StaticMethods } from "../../../../utils/StaticMethods";
import imagePath from "../../../../constants/imagePath";
import { decryptVale } from "../../../../utils/Crypto";
import colors from "../../../../styles/colors";
import { UPLOAD_FILE } from "../../../../Store/Action/AuthFunctions";
import { useSelector } from "react-redux";
import { PUT_METHOD_AUTH } from "../../../../utils/ApiCallingMachnisem";
import MapStyles from "./MapStyles";
import SkeletonLoader from "../../../../Components/SkeletonLoder/SkeleonLoader";


function OrdersTrails({
  OrderStatus,
  ScreenMode,
  SetOrderStatus,
  SetScreenMode,
  orderDetails,
  curLoc,
  HandleNextStep,
  FinishRide1,
  setmapModal,
  changedState,
  animateLocation,
  setOrderModal,
  showImageFullPath,
  setLoader,
  loader,
  errorModal,
  modalMsg,
  StartRideFirst,
  requestCameraPermission,
  setShowImageFullPath,
  StartRideFirstMart,
  activeOrderType
}) {
  const animatedmargin = new Animated.Value(5);
  const deliveryAddress = decryptVale(orderDetails?.userAddress)
  const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);

  const userDetailDecrypted = returnUserDetailData(UserDetail);

  const handleMap = () => {
    if (Platform.OS == 'android') {
      OpenGoogleMapsRestaurant(curLoc, orderDetails, OrderStatus)
    } else {
      setmapModal(true)
    }
  }

  const changeState = () => {
    changedState()
    SetScreenMode(!ScreenMode)
  }

  const handleFunc = async () => {
    if (loader) {
    } else {
      if (showImageFullPath) {
        setLoader(true)
        try {
          let ImageUrl = await UPLOAD_FILE(showImageFullPath, false, userDetailDecrypted?.ContactNum, 0)
          PUT_METHOD_AUTH(`/api/DMSOrder?orderId=${orderDetails?.OrderId}&proofImageUrl=${ImageUrl?.data?.message}`, TokenId)
            .then((res) => {
              // console.log(res)
              if (res?.Status == 1) {
                HandleNextStep()
                // setShowImageFullPath()
              } else {
                modalMsg('Something went wrong\nTry Again')
                errorModal(true)
              }
            }).catch((err) => {
              console.log('err====>', err)
              setLoader(false)
            })
        } catch (error) {
          console.log('error----->', error)
          setLoader(false)
        }
      } else {
        setLoader(false)
        modalMsg('Please upload proof image.')
        errorModal(true)
      }
    }

  }

  const handleFuncMart = async () => {
    if (loader) {
    } else {
      if (showImageFullPath) {
        setLoader(true)
        try {
          let ImageUrl = await UPLOAD_FILE(showImageFullPath, false, userDetailDecrypted?.ContactNum, 0)
          PUT_METHOD_AUTH(`/api/V2DmsOrder/Mart?orderId=${orderDetails?.OrderId}&proofImageUrl=${ImageUrl?.data?.message}`, TokenId)
            .then((res) => {
              // console.log(res)
              if (res?.Status == 1) {
                StartRideFirstMart(6)
              } else {
                modalMsg('Something went wrong\nTry Again')
                errorModal(true)
              }
            }).catch((err) => {
              console.log('err====>', err)
              setLoader(false)
            })
        } catch (error) {
          console.log('error----->', error)
          setLoader(false)
        }
      } else {
        setLoader(false)
        modalMsg('Please upload proof image.')
        errorModal(true)
      }
    }

  }

  // console.log("orderDetails>>>>>>>>>>>", orderDetails)
  return (
    <>
      <KeepAwake />

      {ScreenMode && (
        <View style={OrderTrailsStyles.sideButtonsContainer}>
          <TouchableOpacity
            style={[whole.sidebtn, OrderTrailsStyles.buttonGray]}
            onPress={changeState}
          >
            <Image
              source={imagePath.MinizeScreen}
              style={[OrderTrailsStyles.whiteicon, MapStyles.img, OrderTrailsStyles.iconWhite]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[whole.sidebtn, OrderTrailsStyles.buttonGray1]}
            onPress={() => animateLocation()}
          >
            <Image
              source={imagePath.Ordermappoint}
              style={[OrderTrailsStyles.whiteicon, MapStyles.img]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[whole.sidebtn, OrderTrailsStyles.buttonGray1]}
            onPress={handleMap}
          >
            <Image
              source={imagePath.OrderAsset14}
              style={[MapStyles.img, OrderTrailsStyles.iconSend]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}


      {ScreenMode ? null : (
        <TouchableOpacity
          style={[OrderTrailsStyles.buttonOrderDetails, OrderTrailsStyles.detailChip]}
          onPress={() => orderDetails?.vedraddress && setOrderModal(true)}
        >
          <View style={OrderTrailsStyles.detailChipView}>
            <Text style={[ResponsiveFonts.textualStyles.smallBold, { color: 'white' }]}>Order Details</Text>
            <Image
              source={imagePath.rightArrow}
              style={[OrderTrailsStyles.whiteicon, MapStyles.img, OrderTrailsStyles.detailChipImg]}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      )}

      <Animated.View style={[OrderTrailsStyles.aniview, { bottom: animatedmargin }]}>

        <View style={OrderTrailsStyles.actionBtnView}>
          <View style={OrderTrailsStyles.BtnView1}>
            <TouchableOpacity
              style={[whole.sidebtn, OrderTrailsStyles.buttonLocation, OrderTrailsStyles.buttonLocation1,]}
              onPress={() => animateLocation()}
            >
              <Image
                source={imagePath.Ordermappoint}
                style={[OrderTrailsStyles.whiteicon, MapStyles.img]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={OrderTrailsStyles.BtnView2}>
            <TouchableOpacity
              style={[whole.sidebtn, OrderTrailsStyles.buttonGray, { width: 40, height: 40 }]}
              onPress={changeState}
            >
              <Image
                source={ScreenMode ? imagePath.MinizeScreen : imagePath.FullScreen}
                style={[OrderTrailsStyles.whiteicon, MapStyles.img, OrderTrailsStyles.iconWhite]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {ScreenMode && (
              <TouchableOpacity
                style={[whole.sidebtn, OrderTrailsStyles.buttonLocation]}
                onPress={() => animateLocation()}
              >
                <Image
                  source={imagePath.locationPin}
                  style={[OrderTrailsStyles.whiteicon, MapStyles.img]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {!ScreenMode && (
              <TouchableOpacity
                style={[whole.sidebtn, OrderTrailsStyles.buttonPhone]}
                onPress={() => Linking.openURL(`tel:${orderDetails?.CustomerPhone}`)}
              >
                <Image
                  source={imagePath.CallIcon}
                  style={[OrderTrailsStyles.whiteicon, MapStyles.img]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {!ScreenMode && (
              <TouchableOpacity
                style={[whole.sidebtn, OrderTrailsStyles.buttonPhone]}
                onPress={() => Linking.openURL(`sms:${orderDetails?.CustomerPhone}`)}
              >
                <Image
                  source={imagePath.SmsIcon}
                  style={[OrderTrailsStyles.whiteicon, MapStyles.img]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {!ScreenMode ? (
              <TouchableOpacity
                style={[whole.sidebtn, OrderTrailsStyles.buttonSend]}
                onPress={handleMap}
              >
                <Image
                  source={imagePath.OrderAsset14}
                  style={[MapStyles.img, OrderTrailsStyles.iconSend]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {(orderDetails?.Type == 'Chef') ?
          <ImageBackground
            style={MapStyles.imageBackgroundStyle}
            imageStyle={MapStyles.imageBackgroundStyleImg}
            source={imagePath.whiteBG}
          >
            <Image
              source={imagePath.Orderline}
              resizeMode="contain"
              style={OrderTrailsStyles.orderLineImage}
            />
            <View
              style={whole.whiteroundcard
              }
            >
              <View style={MapStyles.con5}>
                <Text style={[whole.cardH2, MapStyles.textColor, ResponsiveFonts.textualStyles.medium, OrderTrailsStyles.spacing]}>
                  {OrderStatus == "wdispatch" && orderDetails?.vedraddress ? `Order# ${orderDetails?.OrderId}` : OrderStatus == 'odispateched' ? 'Order ready. Pick up and Go!' : OrderStatus === "startdelivery" ? 'Drop off Address' : OrderStatus == "fnshride" ? 'Upload Proof Image' : orderDetails?.vedraddress ? 'Pickup Address' : 'Loading...'}
                </Text>
                <View style={OrderTrailsStyles.divider} />
              </View>
              <View style={[OrderTrailsStyles.cardRow, { marginBottom: OrderStatus == "wdispatch" ? verticalScale(-40) : 0 }]}>
                <View style={[OrderTrailsStyles.cardLeftColumn]}>
                  <View style={[MapStyles.con5, OrderTrailsStyles.spacing]}>
                    <View style={whole.redborderview}>
                      <Text style={[whole.normltxt, ResponsiveFonts.textualStyles.smallBold,]}>
                        {OrderStatus == "wdispatch" ? 'Wait till your order gets ready' : OrderStatus == "fnshride" ? 'Please upload image of order at drop off address'
                          : (OrderStatus == "startride-start" && orderDetails?.vedraddress) ? orderDetails?.vedraddress : (OrderStatus == "startride" && orderDetails?.vedraddress) ? orderDetails?.vedraddress : (OrderStatus == "odispateched" && orderDetails?.userAddress) ? decryptVale(orderDetails?.userAddress)
                            : (OrderStatus == "startdelivery" && orderDetails?.userAddress) ? decryptVale(orderDetails?.userAddress)
                              : "Loading..."}
                      </Text>
                      <Text style={[whole.normltxt, ResponsiveFonts.textualStyles.smallBold, { color: colors.black }]}>
                        {(OrderStatus == "startride-start" && orderDetails?.vendorAddress2) ?
                          orderDetails?.vendorAddress2 :
                          (OrderStatus == "startride" && orderDetails?.vendorAddress2) ?
                            orderDetails?.vendorAddress2 :
                            (OrderStatus == "odispateched" && orderDetails?.userAddress2) ?
                              decryptVale(orderDetails?.userAddress2)
                              : (OrderStatus == "startdelivery" && orderDetails?.userAddress2) ?
                                decryptVale(orderDetails?.userAddress2)
                                : ""}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[OrderTrailsStyles.cardCenter, OrderTrailsStyles.spacing]}>
                  <Image
                    source={
                      OrderStatus == "wdispatch" ? imagePath.OrderAsset5 : OrderStatus == 'startride-start' ? imagePath.OrderAsset3 : OrderStatus == 'odispateched' ? imagePath.OrderAsset6 : OrderStatus == "fnshride" ? imagePath.OrderAsset9 : OrderStatus === "startdelivery" ? imagePath.OrderAsset7 : imagePath.OrderAsset4
                    }
                    resizeMode="contain"
                    style={OrderTrailsStyles.cardImage}
                  />
                </View>
              </View>
              {OrderStatus == "wdispatch" && (<View style={OrderTrailsStyles.loaderView}>
                <LottieView
                  source={imagePath.Loader}
                  loop={true}
                  autoPlay={true}
                  style={OrderTrailsStyles.loader}
                  speed={1}
                />
              </View>)}
              {OrderStatus == "fnshride" && (<TouchableOpacity style={OrderTrailsStyles.uploadButton3} onPress={requestCameraPermission}>
                {showImageFullPath && (
                  <Image
                    source={{ uri: showImageFullPath?.uri }}
                    resizeMode="contain"
                    style={OrderTrailsStyles.uploadedImage3}
                  />
                )}
                <Image
                  source={showImageFullPath ? imagePath.OrderAsset12 : imagePath.OrderAsset8}
                  resizeMode="contain"
                  style={OrderTrailsStyles.uploadIcon3}
                />
                <Image
                  source={showImageFullPath ? imagePath.OrderAsset11 : imagePath.OrderAsset10}
                  resizeMode="contain"
                  style={OrderTrailsStyles.uploadArrow3}
                />
              </TouchableOpacity>)}
              {OrderStatus == 'wdispatch'
                ?
                <Text style={[whole.smltext, MapStyles.text4, ResponsiveFonts.textualStyles.smallBold, OrderTrailsStyles.orderText]}>
                  While collecting, Please ensure restaurant presses dispatch button in POS app
                </Text>
                : (<TouchableOpacity
                  disabled={orderDetails?.vedraddress ? false : true}
                  style={[styles.ButtonImportant, OrderTrailsStyles.buttonImportantStyle]}
                  onPress={() =>
                    OrderStatus == "startride-start" ? StartRideFirst() : OrderStatus == "startride" || OrderStatus == "odispateched" ? HandleNextStep() : OrderStatus === "startdelivery" ? FinishRide1() : OrderStatus == "fnshride" ? handleFunc() : null
                  }
                >
                  <View style={OrderTrailsStyles.buttonTextContainer}>
                    <Text style={[OrderTrailsStyles.buttonText, ResponsiveFonts.textualStyles.medium]}>
                      {OrderStatus == "startride-start" || OrderStatus == "odispateched" ? "Let's Go!" : OrderStatus == "startride" ? 'I have arrived' : OrderStatus === "startdelivery" ? 'I have arrived' : OrderStatus == "fnshride" ? 'Complete Order' : orderDetails?.vedraddress ? "Loading..." : ''}
                    </Text>
                  </View>
                  <View style={OrderTrailsStyles.arrowContainer}>
                    <Image
                      source={imagePath.rightArrow}
                      resizeMode="contain"
                      style={OrderTrailsStyles.arrowIcon}
                    />
                  </View>
                </TouchableOpacity>)}
            </View>

          </ImageBackground>
          :
          (orderDetails?.Type == 'mart') ?
            <ImageBackground
              style={MapStyles.imageBackgroundStyle}
              imageStyle={MapStyles.imageBackgroundStyleImg}
              source={imagePath.whiteBG}
            >
              <Image
                source={imagePath.Orderline}
                resizeMode="contain"
                style={OrderTrailsStyles.orderLineImage}
              />
              <View
                style={whole.whiteroundcard
                }
              >
                <View style={MapStyles.con5}>
                  <Text style={[whole.cardH2, MapStyles.textColor, ResponsiveFonts.textualStyles.medium, OrderTrailsStyles.spacing]}>
                    {OrderStatus == "wdispatch" && orderDetails?.vedraddress ? `Order# ${orderDetails?.OrderId}` : OrderStatus === "startdelivery" ? 'Drop off Address' : OrderStatus == "fnshride" ? 'Upload Proof Image' : orderDetails?.vedraddress ? `Pickup Address (${orderDetails?.vendrname})` : 'Loading...'}
                  </Text>
                  <View style={OrderTrailsStyles.divider} />
                </View>
                <View style={[OrderTrailsStyles.cardRow, { marginBottom: OrderStatus == "wdispatch" ? verticalScale(-40) : 0 }]}>
                  <View style={[OrderTrailsStyles.cardLeftColumn]}>
                    <View style={[MapStyles.con5, OrderTrailsStyles.spacing]}>
                      <View style={[whole.redborderview, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }]}>
                        {OrderStatus == "wdispatch" && (<Image
                          source={
                            OrderStatus == "wdispatch" ? imagePath.MartIcon2 : null
                          }
                          resizeMode="contain"
                          style={[OrderTrailsStyles.cardImage2, { marginRight: 10 }]}
                        />)}
                        <View style={{ flexDirection: 'column' }}>
                          {OrderStatus != "wdispatch" && (<Text style={[whole.normltxt, ResponsiveFonts.textualStyles.smallBold,]}>
                            {OrderStatus == "fnshride" ? 'Please upload image of order at drop off address'
                              : (OrderStatus == "startride-start" && orderDetails?.vedraddress) ? orderDetails?.vedraddress
                                : (OrderStatus == "startride" && orderDetails?.vedraddress) ? orderDetails?.vedraddress
                                  : (OrderStatus == "startdelivery" && orderDetails?.userAddress) ? decryptVale(orderDetails?.userAddress)
                                    : "Loading..."}
                          </Text>)}
                          {(OrderStatus != "wdispatch" && (orderDetails?.vendorAddress2 || orderDetails?.userAddress2)) &&
                            (<Text style={[whole.normltxt, ResponsiveFonts.textualStyles.smallBold, { marginTop: 5, color: colors.black }]}>
                              {(OrderStatus == "startride-start" && orderDetails?.vendorAddress2) ? orderDetails?.vendorAddress2
                                : (OrderStatus == "startride" && orderDetails?.vendorAddress2) ? orderDetails?.vendorAddress2
                                  : (OrderStatus == "startdelivery" && orderDetails?.userAddress2) ? decryptVale(orderDetails?.userAddress2)
                                    : ""}
                            </Text>)}
                        </View>
                        {OrderStatus == "wdispatch" && (
                          <View style={{ flexDirection: 'column' }}>
                            {(orderDetails?.orderName != undefined && orderDetails?.orderName != 0) && (<><Text style={[whole.normltxt, ResponsiveFonts.textualStyles.smallBold, { color: colors.blackOpacity60 }]}>
                              Order For:
                            </Text>
                              <Text style={[whole.normltxt, ResponsiveFonts.textualStyles.medium, { textTransform: 'capitalize' }]}>
                                {orderDetails?.orderName ? orderDetails?.orderName : "Loading..."}
                              </Text></>)}

                            <Text style={[whole.normltxt, ResponsiveFonts.textualStyles.smallBold, { color: colors.blackOpacity60, marginTop: 5 }]}>
                              Mart Order #{" "}
                            </Text>
                            <Text style={[whole.normltxt, ResponsiveFonts.textualStyles.medium,]}>
                              {orderDetails?.martOrderId ? orderDetails?.martOrderId : 'Loading...'}
                            </Text>

                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={[OrderTrailsStyles.cardCenter, OrderTrailsStyles.spacing]}>
                    <Image
                      source={
                        OrderStatus == "wdispatch" ? imagePath.MartIcon3 : OrderStatus == 'startride-start' ? imagePath.OrderAsset3 : OrderStatus == "fnshride" ? imagePath.OrderAsset9 : OrderStatus === "startdelivery" ? imagePath.OrderAsset7 : imagePath.MartIcon1
                      }
                      resizeMode="contain"
                      style={OrderTrailsStyles.cardImage}
                    />
                  </View>
                </View>
                {OrderStatus == "wdispatch" && (<View style={OrderTrailsStyles.loaderView}>
                  <LottieView
                    source={imagePath.Loader}
                    loop={true}
                    autoPlay={true}
                    style={OrderTrailsStyles.loader}
                    speed={1}
                  />
                </View>)}
                {OrderStatus == "fnshride" && (<TouchableOpacity style={OrderTrailsStyles.uploadButton3} onPress={requestCameraPermission}>
                  {showImageFullPath && (
                    <Image
                      source={{ uri: showImageFullPath?.uri }}
                      resizeMode="contain"
                      style={OrderTrailsStyles.uploadedImage3}
                    />
                  )}
                  <Image
                    source={showImageFullPath ? imagePath.OrderAsset12 : imagePath.OrderAsset8}
                    resizeMode="contain"
                    style={OrderTrailsStyles.uploadIcon3}
                  />
                  <Image
                    source={showImageFullPath ? imagePath.OrderAsset11 : imagePath.OrderAsset10}
                    resizeMode="contain"
                    style={OrderTrailsStyles.uploadArrow3}
                  />
                </TouchableOpacity>)}
                {OrderStatus == 'wdispatch'
                  &&
                  <Text style={[whole.smltext, MapStyles.text4, ResponsiveFonts.textualStyles.smallBold, OrderTrailsStyles.orderText]}>
                    Show order name or order id to collect the order
                  </Text>}
                <TouchableOpacity
                  disabled={orderDetails?.vedraddress ? false : true}
                  style={[styles.ButtonImportant, OrderTrailsStyles.buttonImportantStyle]}
                  onPress={() =>
                    (OrderStatus == "startride-start" || OrderStatus == "startride" || OrderStatus == "wdispatch" || OrderStatus === "startdelivery") ?
                      StartRideFirstMart(OrderStatus == "startride-start" ? 2 : OrderStatus == "wdispatch" ? 4 : OrderStatus == "startdelivery" ? 5 : 3) :
                      OrderStatus === "fnshride" && handleFuncMart()

                  }
                >
                  <View style={OrderTrailsStyles.buttonTextContainer}>
                    <Text style={[OrderTrailsStyles.buttonText, ResponsiveFonts.textualStyles.medium]}>
                      {OrderStatus == "startride-start" ? "Let's Go!" : OrderStatus == "startride" ? 'I have arrived' :
                        OrderStatus == "wdispatch" ? "Let's Go! Drop off" :
                          OrderStatus === "startdelivery" ? 'I have arrived' :
                            OrderStatus == "fnshride" ? 'Complete Order' : orderDetails?.vedraddress ? "Loading..." : ''}
                    </Text>
                  </View>
                  <View style={OrderTrailsStyles.arrowContainer}>
                    <Image
                      source={imagePath.rightArrow}
                      resizeMode="contain"
                      style={OrderTrailsStyles.arrowIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>

            </ImageBackground>
            :
            <ImageBackground
              style={MapStyles.imageBackgroundStyle}
              imageStyle={MapStyles.imageBackgroundStyleImg}
              source={imagePath.whiteBG}
            >
              <Image
                source={imagePath.Orderline}
                resizeMode="contain"
                style={OrderTrailsStyles.orderLineImage}
              />
              <View
                style={whole.whiteroundcard
                }
              >
                <SkeletonLoader />
              </View>

            </ImageBackground>
        }

      </Animated.View >
    </>
  );
}

export default OrdersTrails;

const OrderTrailsStyles = StyleSheet.create({
  whiteicon: { height: 20, width: 20, tintColor: "#e54e5b", },
  whitetext: { marginLeft: 10, marginRight: 6, color: "white" },
  screenmodtext: {
    marginLeft: 10,
    marginRight: 6,
    color: "white",
    fontSize: 10,
  },
  aniview: {
    zIndex: 999,
    width: "100%",
    position: "absolute",
    justifyContent: "flex-end",
    alignContent: "center",
    flexDirection: "column",
  },
  sideButtonsContainer: {
    position: 'absolute',
    zIndex: 9999,
    right: 10,
    bottom: '5%',
  },
  buttonGray: {
    marginBottom: 10,
    backgroundColor: 'gray',
  },
  buttonGray1: {
    marginBottom: 10,
  },
  iconWhite: {
    tintColor: 'white',
  },
  topRightContainer: {
    zIndex: 2112,
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: 10,
    // backgroundColor: "red"//==========================
  },
  buttonLocation: {
    width: 40,
    height: 40,
  },
  buttonLocation1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPhone: {
    marginBottom: 10,
    width: 40,
    height: 40,
  },
  buttonSend: {
    marginBottom: 10,
    width: 40,
    height: 40,
  },
  bottomLeftContainer: {//==============
    // zIndex: 3105,
    width: '30%',
    alignItems: 'flex-start',
    paddingLeft: 10,
    marginTop: verticalScale(-95),
    justifyContent: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'yellow',
    height: 50
  },
  orderLineImage: {
    width: '100%',
    height: 25,
    marginBottom: -5,
    zIndex: 2,
  },
  cardRow: {
    flexDirection: 'row',
  },
  cardLeftColumn: {
    flex: 2,
  },
  cardCenter: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: 50,
    height: 50,
  },
  buttonImportantStyle: {
    width: '90%',
    borderRadius: 15,
    flexDirection: 'row',
    marginBottom: 20,
  },
  buttonTextContainer: {
    flex: 1.4,
    justifyContent: 'center',
    // alignItems: 'flex-end',
  },
  buttonText: {
    color: "white",
  },
  arrowContainer: {
    flex: 1,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
    alignSelf: 'flex-end',
  },
  divider: {
    width: '100%',
    backgroundColor: 'gray',
    height: 1,
  },
  loaderView: {
    alignItems: 'center',
    width: '100%',
    height: 80,
    marginBottom: -15
  },
  loader: {
    width: '100%',
    height: '100%',
  },
  orderText: {
    borderWidth: 2,
    borderColor: colors.blackOpacity40,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    color: colors.blackOpacity50,
  },
  iconSend: { height: 20, width: 20, },
  spacing: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    textTransform: 'uppercase'
  },
  uploadButton3: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row'
  },
  uploadedImage3: {
    width: 80,
    height: 80,
    position: 'absolute',
    zIndex: 2,
    top: '-18%',
  },
  uploadIcon3: {
    width: 80,
    height: 80,
  },
  uploadArrow3: {
    width: 160,
    height: 40,
  },
  detailChip: {
    zIndex: 99999,
    alignContent: "center",
    alignItems: "flex-end",
    width: '98%',
    position: 'absolute',
    top: '31%',
  },
  detailChipView: {
    justifyContent: 'space-around',
    flexDirection: "row",
    backgroundColor: colors.theme,
    elevation: 13,
    borderRadius: 100,
    padding: 5,
    alignItems: 'center',
  },
  detailChipImg: {
    width: 12,
    height: 12,
    tintColor: 'white'
  },
  cardImage2: {
    width: 70,
    height: 70,
  },
  actionBtnView: {
    width: '100%',
    height: verticalScale(800),
    flexDirection: 'row',
    marginBottom: -5,
  },
  BtnView1: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingLeft: 15
  },
  BtnView2: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 15
  }
});
