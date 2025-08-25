import { StyleSheet } from "react-native";
import {
  verticalScale,
  moderateScale,
  scale,
  width,
  height,
} from "../../../styles/responsiveSize";

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#e54e5b",
    height: height,
    // marginTop: 30
  },
  con2: { zIndex: 9999, marginTop: 70, },
  ImageView: {
    height: verticalScale(100),
    textAlign: "center",
    width: "40%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "18%",

  },
  profile: { height: 100, width: 100, borderRadius: 100, alignSelf: "center" },
  usercon: {
    marginTop: 10,
    textAlign: "center",
    width: "40%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "18%",
  },
  notverf: {
    marginTop: 10,
    textAlign: "center",
    backgroundColor: "#fff",
    width: "40%",
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "18%",
  },
  Item: {
    flexDirection: "row",
    marginLeft: "15%",
    marginTop: "5%",
    alignItems: "center",
    width: '100%',
    // backgroundColor: 'black',
    paddingVertical: width * 0.02
  },
  icon: {
    height: verticalScale(20),
    width: moderateScale(20),
    tintColor: "#fff",
  },
  VersionView: {
    flexDirection: "row",
    marginLeft: "15%",
    marginTop: "10%",
  },
});

export default styles;
