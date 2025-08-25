import { StyleSheet } from "react-native";
import { StatusBarHeight, height, moderateScale, verticalScale, width } from "../../../styles/responsiveSize";
import colors from "../../../styles/colors";

const styles = StyleSheet.create({
  subtitle: {
    color: "#000",
    fontSize: 15,
    marginTop: 10,
    maxWidth: "70%",
    textAlign: "center",
    lineHeight: 23,
  },
  title: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  image: {
    height: "100%",
    width: "100%",
    // resizeMode: 'contain'
  },
  indicator_container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  indicator: {
    height: 8,
    width: 8,
    backgroundColor: "#FFB6B6",
    marginHorizontal: 3,
    borderRadius: 8,
    opacity: 0.6,
  },
  footer: {
    // marginTop: -100,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    // paddingHorizontal: 20,
  },
  footerrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginBottom: verticalScale(15),
    marginTop: verticalScale(15)
  },
  next: {
    width: 150,
    height: 100,
  },
  btn: {
    width: moderateScale(150),
    backgroundColor: colors.theme,
    height: verticalScale(40),
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "white"
  },
  slideCon: {
    alignItems: "center",
    width: width,
    height: height - verticalScale(80),
    paddingTop: StatusBarHeight
  },
  img: {
    width: "100%",
    height: '100%'
  },
  w40: {
    width: 40
  },
  con: {
    flex: 6,
    backgroundColor: "#fff"
  }
});

export default styles;
