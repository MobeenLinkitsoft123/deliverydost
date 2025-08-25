import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { 
  View, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Animated, 
  ScrollView, 
  Modal, 
  TouchableOpacity, 
  Text, 
  AppState 
} from "react-native";
import moment from "moment";
import BackgroundTimer from 'react-native-background-timer';
import { useDispatch, useSelector } from "react-redux";

// Components
import Label from "../../Label/Label";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import ModalPattern1 from "./ModalPattern1";
import BidSelectionBtn from "./BidSelectionBtn";

// Utils & Actions
import { decryptVale } from "../../../utils/Crypto";
import { StaticMethods } from "../../../utils/StaticMethods";
import { getComissionValue, getTwoDecimalPlacesString } from "../../../Store/Action/HelperActions";
import { PlaceBid, PlaceBidForMart } from "../../../Store/Action/BidsActionsMain";
import { removeSpecificBid } from "../../../Store/Reducers/AppReducer/BidReducer";

// Styles
import { verticalScale, moderateScale } from "../../../styles/responsiveSize";
import colors from "../../../styles/colors";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";

const PlaceBidModal = ({
  onIgnoreBid,
  CloseBidModal,
  UserDetail,
  TokenId,
  BiddingAmount,
  RidreProgressCheck,
  EliminateRides,
  onBidTimeOut,
  onBackButtonPress,
  setPlaceBidModal,
  stopSound,
  innerModal,
  setinnerModal,
  ErrorModel,
  setErrorModel,
  ModalMessage,
  setModalMessage,
  setBidModalData
}) => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const BidMain = useSelector((state) => state?.BidReducer?.Bids);
  
  const [modalMsg, setmodalmsg] = useState("");
  const [errorModal, seterrorModal] = useState(false);
  const [PlacingBid, SetPlacingBid] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Memoized values
  const distanceFrom = useMemo(() => 
    selectedOrder?.TotalDistanceFrom?.replace(/miles/g, ""), 
    [selectedOrder]
  );
  
  const distanceTo = useMemo(() => 
    selectedOrder?.TotalDistanceTo?.replace(/miles/g, ""), 
    [selectedOrder]
  );

  const maximumBid = selectedOrder?.maximumBidValue;
  const minimumBidRange = selectedOrder?.minimumBidValue;
  const deliveryAddress = decryptVale(selectedOrder?.orderto);
  const comission = getComissionValue(
    selectedOrder?.riderCommissionType, 
    selectedOrder?.riderCommossion, 
    0, 
    false
  );


  const selectedBidingAmount = Number(selectedOrder?.FinalBidAmount || 0);
  const totalReceive = (Number(selectedOrder?.tip) + selectedBidingAmount) - 
    Number((comission)?.replace("$", ""));

  // App state change handler
  useEffect(() => {
    const handleChange = AppState.addEventListener("change", (changedState) => {
      if (changedState == 'background') {
        stopSound();
      }
    });
    return () => handleChange.remove();
  }, [stopSound]);

  // Initialize orders from BidMain
  useEffect(() => {
    const initialOrders = BidMain.map((order) => ({
      ...order,
      remainingTime: order.TimeOut,
    }));
    setOrders(initialOrders);
    if (!selectedOrder?.Neworderid) {
      setSelectedOrder(initialOrders[0] || null);
      setBidModalData(initialOrders[0] || null);
    }
  }, [BidMain]);

  // Timer effect for order countdown
  useEffect(() => {
    const interval = BackgroundTimer.setInterval(() => {
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders
          .map((order) => ({
            ...order,
            remainingTime: order.remainingTime - 1,
          }))
          .filter((order) => order.remainingTime > 0);

        if (!updatedOrders.find((o) => o.Neworderid == selectedOrder?.Neworderid)) {
          setSelectedOrder(updatedOrders[0] || null);
          setBidModalData(updatedOrders[0] || null);
        }

        if (updatedOrders.length == 0) {
          setPlaceBidModal(false);
          stopSound();
          BackgroundTimer.clearInterval(interval);
        }

        return updatedOrders;
      });
    }, 1000);

    return () => BackgroundTimer.clearInterval(interval);
  }, [selectedOrder, setPlaceBidModal, stopSound, setBidModalData]);

  // Handlers
  const handleIgnoreJob = useCallback(() => {
    if (BidMain?.length > 1) {
      dispatch(removeSpecificBid(selectedOrder?.Neworderid));
    } else {
      onIgnoreBid();
    }
    RidreProgressCheck();
  }, [BidMain, selectedOrder, dispatch, onIgnoreBid, RidreProgressCheck]);

  const handlePlaceBid = useCallback(() => {
    const bidFunction = selectedOrder?.type == 'mart' ? PlaceBidForMart : PlaceBid;
    
    bidFunction(
      onIgnoreBid,
      selectedOrder,
      CloseBidModal,
      UserDetail,
      selectedBidingAmount,
      () => {},
      TokenId,
      BiddingAmount,
      setmodalmsg,
      seterrorModal,
      SetPlacingBid,
      RidreProgressCheck,
      EliminateRides,
      selectedOrder,
      onBidTimeOut,
      selectedOrder?.TotalDistanceTo,
      (Number(distanceFrom || 0) + Number(distanceTo || 0))?.toFixed(2),
      minimumBidRange,
      maximumBid,
      dispatch,
      orders,
      setPlaceBidModal,
      setSelectedOrder,
      setOrders,
      null, // interval
      stopSound,
      setErrorModel,
      setModalMessage,
      setBidModalData,
      comission
    );
  }, [
    selectedOrder,
    onIgnoreBid,
    CloseBidModal,
    UserDetail,
    selectedBidingAmount,
    TokenId,
    BiddingAmount,
    RidreProgressCheck,
    EliminateRides,
    onBidTimeOut,
    distanceFrom,
    distanceTo,
    minimumBidRange,
    maximumBid,
    dispatch,
    orders,
    setPlaceBidModal,
    stopSound,
    setErrorModel,
    setModalMessage,
    setBidModalData,
    comission
  ]);

  const closeErrorModal = useCallback(() => {
    setinnerModal?.(false);
    setErrorModel?.(false);
    setModalMessage?.('');
    setmodalmsg("");
    seterrorModal(false);
  }, [setinnerModal, setErrorModel, setModalMessage]);

  // Render functions
  const renderOrderDetails = () => (
    <View style={styles.addresscontainer}>
      <View style={styles.OrderVendorNameText}>
        <View style={styles.OrderVendorNameTextView}>
          <Image 
            source={require('../../../assets/images/res-01.png')} 
            style={styles.smallIcon} 
            resizeMode="contain" 
          />
          <Label
            label={selectedOrder?.OrderVendorName}
            textAlign={"left"}
            color={colors.black}
            ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
          />
        </View>
        <View style={styles.viewImage}>
          <Image 
            source={require('../../../assets/images/Rider-order-details-Asseets-08.png')} 
            style={styles.smallIcon} 
            resizeMode="contain" 
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.viewImage}>
          <Image 
            source={require('../../../assets/images/Rider-order-details-Asseets-06.png')} 
            style={styles.verticalLineImage} 
            resizeMode="contain" 
          />
        </View>
        <View style={styles.viewLabel}>
          {selectedOrder?.schtype == 1 && (
            <>
              <Label
                label={'Schedule Order'}
                textAlign={"left"}
                color={colors.theme}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
              />
              <Label
                label={moment(selectedOrder?.orderTime)?.add(5, 'hours').format('LLL')}
                textAlign={"left"}
                color={colors.blackOpacity40}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                marginBottom={10}
              />
            </>
          )}

          <Label
            label={'Pick Up Address'}
            textAlign={"left"}
            color={colors.black}
            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
            marginTop={3}
          />

          <Label
            label={selectedOrder?.orderfrom}
            textAlign={"left"}
            color={colors.blackOpacity90}
            ResponsiveFonts={ResponsiveFonts.textualStyles.small}
          />
          {selectedOrder?.vendorAddress2 && (
            <Label
              label={selectedOrder?.vendorAddress2}
              textAlign={"left"}
              color={colors.blackOpacity90}
              ResponsiveFonts={ResponsiveFonts.textualStyles.small}
            />
          )}

          <Label
            label={'Delivery Address'}
            textAlign={"left"}
            color={colors.black}
            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
            marginTop={8}
          />
          <Label
            label={deliveryAddress?.replace('$', ',')}
            textAlign={"left"}
            color={colors.blackOpacity90}
            ResponsiveFonts={ResponsiveFonts.textualStyles.small}
          />
          {selectedOrder?.userAddress2 && (
            <Label
              label={decryptVale(selectedOrder?.userAddress2)}
              textAlign={"left"}
              color={colors.blackOpacity90}
              ResponsiveFonts={ResponsiveFonts.textualStyles.small}
            />
          )}
        </View>
      </View>
    </View>
  );

  const renderPaymentDetails = () => (
    <>
      {selectedBidingAmount > 0 && (
        <View style={[styles.row, { marginVertical: 1 }, styles.flexing]}>
          <Label label={"Delivery Fare"} textAlign={"left"} color={colors.black} />
          <Label
            label={'$ ' + getTwoDecimalPlacesString(selectedBidingAmount) || 0}
            textAlign={"center"}
            color={colors.theme}
          />
        </View>
      )}

      {selectedOrder?.tip > 0 && (
        <View style={[styles.row, { marginVertical: 1 }, styles.flexing]}>
          <Label label={"Your Tip"} textAlign={"center"} color={colors.black} />
          <Label
            label={`$ ${StaticMethods.getTwoDecimalPlacesString(selectedOrder?.tip) || 0}`}
            textAlign={"center"}
            color={colors.theme}
          />
        </View>
      )}

      <View style={[styles.row, { marginVertical: 1 }, styles.flexing]}>
        <Label label={"Foodosti Commission"} textAlign={"left"} color={colors.black} />
        <Label
          label={'- ' + comission || 0}
          textAlign={"center"}
          color={colors.theme}
        />
      </View>

      {selectedBidingAmount > 0 && (
        <View style={[styles.row, { marginVertical: 5 }, styles.flexing]}>
          <Label 
            label={"Total Receivable Amount"} 
            textAlign={"center"} 
            ResponsiveFonts={ResponsiveFonts.textualStyles.medium} 
            color={colors.black} 
          />
          <Label
            label={'$ ' + getTwoDecimalPlacesString(totalReceive) || 0}
            textAlign={"center"}
            color={colors.theme}
            ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
          />
        </View>
      )}
    </>
  );

  const renderDistanceTimeInfo = () => (
    <View style={styles.milesView}>
      <View style={styles.leftRightImageContainer}>
        <Image
          source={require('../../../assets/images/Rider-order-details-Asseets-08.png')}
          style={styles.BidImage}
          resizeMode={'contain'}
        />
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.rowSpaceBetween}>
          <Label
            label={"Est. Distance"}
            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
            textAlign={"center"}
            color={colors.black}
          />
          <Label
            label={selectedOrder?.TotalDistanceFrom}
            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
            textAlign={"center"}
            color={colors.theme}
          />
        </View>
        <Image
          source={require('../../../assets/images/ddfrf-01.png')}
          style={styles.middleImage}
          resizeMode={'contain'}
        />
        <View style={styles.rowSpaceBetween}>
          <Label
            label={"Est. Time"}
            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
            textAlign={"center"}
            color={colors.black}
          />
          <Label
            label={selectedOrder?.TotalDurationfrom == 'NAN' ? 0 : selectedOrder?.TotalDurationfrom}
            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
            textAlign={"center"}
            color={colors.theme}
          />
        </View>
      </View>
      <View style={styles.leftRightImageContainer1}>
        <Image
          source={require('../../../assets/images/Rider-order-details-Asseets-08.png')}
          style={styles.BidImage}
          resizeMode={'contain'}
        />
      </View>
    </View>
  );

  const renderActionButtons = () => (
    PlacingBid ? (
      <View style={styles.LoaderView}>
        <ActivityIndicator size={'large'} color={colors.theme} />
      </View>
    ) : (
      <View style={styles.row1}>
        <CustomButton
          text={"Ignore Job"}
          onPress={handleIgnoreJob}
          bgColor={colors.white}
          marginTop={5}
          width={"40%"}
          height={40}
          fgColor={colors.theme}
          borderColor={colors.theme}
          borderRadius={100}
        />
        <CustomButton
          text="Accept Job"
          onPress={handlePlaceBid}
          bgColor={colors.theme}
          marginTop={5}
          width={"40%"}
          height={40}
          fgColor={colors.white}
          borderRadius={100}
        />
      </View>
    )
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.bidHederContainer}>
          <View style={styles.row}>
            <View style={styles.imageContainer}>
              <Image 
                source={require('../../../assets/images/Rider-order-details-Asseets-01.png')} 
                style={styles.image} 
                resizeMode='contain' 
              />
            </View>
            <Text style={[styles.textorder, ResponsiveFonts.textualStyles.large]}>
              New Job Offers
            </Text>
          </View>

          <TouchableOpacity onPress={onBackButtonPress} style={styles.closeBtn}>
            <Image 
              source={require('../../../assets/images/close2.png')} 
              style={styles.closeBtnImage} 
              resizeMode='contain' 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.line} />

        <View style={{ width: '100%' }}>
          <ScrollView 
            contentContainerStyle={styles.horizontalScrollContent}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          >
            {orders.map((val, i) => (
              <BidSelectionBtn 
                key={i} 
                value={val} 
                setSelectedOrder={setSelectedOrder} 
                selected={selectedOrder} 
                setBidModalData={setBidModalData} 
              />
            ))}
          </ScrollView>
        </View>

        {renderOrderDetails()}
        <View style={styles.lineSeparator} />

        {selectedOrder?.riderNote && (
          <>
            <Label
              label={'Delivery Note'}
              color={colors.black}
              ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
              marginTop={8}
            />
            <Label
              label={selectedOrder?.riderNote}
              color={colors.theme}
              ResponsiveFonts={ResponsiveFonts.textualStyles.small}
              marginBottom={verticalScale(10)}
            />
          </>
        )}

        {renderPaymentDetails()}
        {renderDistanceTimeInfo()}
        <View style={styles.seperator} />
        {renderActionButtons()}
      </ScrollView>

      {(errorModal || innerModal || ErrorModel) && (
        <Modal visible={(errorModal || innerModal || ErrorModel)} transparent>
          <View style={styles.errorModalView}>
            <ModalPattern1
              setValue={seterrorModal}
              heading={modalMsg || ModalMessage || (innerModal ? 'Sorry! Order Cancel by user' : modalMsg)}
              btnTittle={"Okay"}
              OnPress={closeErrorModal}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    alignSelf: "center",
    borderRadius: moderateScale(15),
    backgroundColor: colors.white,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  bidHederContainer: { 
    flexDirection: 'row', 
    width: "100%", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 10, 
    paddingTop: 10 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  imageContainer: { 
    width: moderateScale(30), 
    height: moderateScale(25), 
    borderRadius: 50, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  image: { 
    width: '100%', 
    height: '100%' 
  },
  textorder: {
    color: colors.theme,
    margin: moderateScale(5),
    textAlign: "center"
  },
  closeBtn: { 
    width: moderateScale(25), 
    height: moderateScale(25), 
    backgroundColor: colors.theme, 
    borderRadius: 50, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  closeBtnImage: { 
    width: '80%', 
    height: '80%', 
    tintColor: colors.white 
  },
  line: { 
    width: '100%', 
    backgroundColor: colors.theme, 
    height: 1, 
    marginTop: 10 
  },
  horizontalScrollContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  addresscontainer: {
    paddingVertical: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    backgroundColor: 'white',
    elevation: 10,
    marginHorizontal: 10,
    marginTop: 5,
  },
  OrderVendorNameText: {
    flexDirection: 'row',
    height: verticalScale(30)
  },
  OrderVendorNameTextView: {
    width: '90%',
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5
  },
  smallIcon: {
    width: moderateScale(25), 
    height: moderateScale(25)
  },
  verticalLineImage: {
    width: moderateScale(30), 
    height: moderateScale(80)
  },
  viewImage: {
    width: '10%'
  },
  viewLabel: {
    width: '90%'
  },
  lineSeparator: {
    marginTop: verticalScale(10)
  },
  flexing: { 
    width: '90%', 
    justifyContent: 'space-between', 
    alignSelf: 'center' 
  },
  row1: {
    width: "98%",
    justifyContent: "space-around",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  LoaderView: {
    justifyContent: 'center',
    alignItems: "center",
    marginTop: 20
  },
  milesView: {
    width: '90%',
    backgroundColor: '#fff3f5',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 5,
    marginTop: 5
  },
  seperator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.theme,
    marginTop: 10
  },
  leftRightImageContainer: {
    width: '10%',
  },
  leftRightImageContainer1: {
    width: '10%',
    alignItems: 'flex-end'
  },
  middleContainer: {
    width: '80%',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  middleImage: {
    width: '100%',
    paddingVertical: verticalScale(5),
    alignSelf: 'center',
  },
  BidImage: {
    width: 20,
    height: 20
  },
  errorModalView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99999
  }
});

export default PlaceBidModal;