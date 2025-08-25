import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "../../../../styles/responsiveSize";
import { ResponsiveFonts } from "../../../../constants/ResponsiveFonts";
import colors from "../../../../styles/colors";

const OrderTrailsStyles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 99,
    top: verticalScale(100),
    width: '100%',
    justifyContent: "center",
    alignItems: "center"
  },
  ackModal: {
    backgroundColor: colors.white,
    borderRadius: verticalScale(10),
    width: '90%',
    overflow: 'hidden',
    minHeight: '30%'
  },
  closeBtnView: {
    position: "absolute",
    top: verticalScale(5),
    right: moderateScale(4)
  },
  fixedLoader: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.blackOpacity50
  },
  closeIocn: {
    height: verticalScale(40),
    width: verticalScale(40)
  },
  orderConfirm: {
    color: colors.theme,
    textAlign: "center",
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(25),
    // borderBottomWidth: 1,
    // borderColor: colors.gray,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: colors.theme,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  activeTab: {
    backgroundColor: colors.theme,
    paddingVertical: verticalScale(5)
  },
  activeTab2: {
    backgroundColor: colors.orange,
    paddingVertical: verticalScale(5)
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    color: '#333333',
  },
  BtnImg: { width: 20, height: 20, marginRight: 5 },
  scrollView: {
    flex: 1,
    zIndex: 9,
    marginTop: 70,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
  },
  orderWaitingImage: {
    width: moderateScale(150),
    height: verticalScale(150),
  },
  orderLineImage: {
    width: '100%',
    height: 30,
  },
  waitingText: {
    ...ResponsiveFonts.textualStyles.large,
    color: '#d33d3f',
    paddingVertical: 10,
  },
  infoContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#d33d3f',
    borderRadius: 10,
    padding: 10,
  },
  infoContainer2: {
    width: '90%',
    alignSelf: "center",
    borderWidth: 1,
    borderColor: '#d33d3f',
    borderRadius: 10,
    padding: 10,
  },
  restaurantName: {
    ...ResponsiveFonts.textualStyles.medium,
    color: '#000',
    paddingBottom: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  addressContainer2: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  mapIcon: {
    width: moderateScale(30),
    height: verticalScale(75),
  },
  mapIcon2: {
    width: moderateScale(30),
    height: verticalScale(84),
  },
  addressTitle: {
    ...ResponsiveFonts.textualStyles.smallBold,
    color: '#000',
    paddingBottom: 5,
  },
  address: {
    ...ResponsiveFonts.textualStyles.small,
    color: '#000',
  },
  address2: {
    ...ResponsiveFonts.textualStyles.small,
    color: colors.blackOpacity40,
  },
  row: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 20,
  },
  leftColumn: {
    width: '70%',
  },
  rightColumn: {
    width: '30%',
  },
  commissionText: {
    ...ResponsiveFonts.textualStyles.mediumNormal,
    color: '#000',
  },
  tipText: {
    ...ResponsiveFonts.textualStyles.mediumNormal,
    color: '#000',
    marginTop: 5,
  },
  amountText: {
    ...ResponsiveFonts.textualStyles.mediumNormal,
    textAlign: 'right',
    color: '#d33d3f',
  },
  distanceContainer: {
    backgroundColor: '#fff3f5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    borderRadius: 15,
    paddingVertical: 10,
    marginVertical: 20,
  },
  distanceItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  distance: {
    ...ResponsiveFonts.textualStyles.medium,
    color: '#000',
    marginTop: 5,
  },
  distanceLabel: {
    ...ResponsiveFonts.textualStyles.mediumNormal,
    color: 'gray',
    marginTop: 5,
  },
  totalText: {
    ...ResponsiveFonts.textualStyles.medium,
    color: '#000',
    marginTop: 5,
  },
  totalAmount: {
    ...ResponsiveFonts.textualStyles.largeBold,
    color: '#d33d3f',
    marginTop: 5,
  },
});

export default OrderTrailsStyles
