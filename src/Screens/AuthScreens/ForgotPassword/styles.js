import { StyleSheet } from "react-native"
import { moderateScale, StatusBarHeight, verticalScale } from "../../../styles/responsiveSize";

const OtpStyles = StyleSheet.create({
    HeaderImage: {
        height: 50,
        width: "50%",
    },
    HeaderImage2: {
        height: verticalScale(20),
        width: moderateScale(20),
        tintColor: "red"
    },
    circle: {
        height: moderateScale(35),
        width: moderateScale(35),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'red',
        justifyContent: "center",
        alignItems: 'center'
    },
    rowHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        top: StatusBarHeight,
        width: '95%',
        alignItems: "center"
    },
    InputView: {
        width: '50%',
        height: verticalScale(50),
        justifyContent: "center",
        backgroundColor: "#D1D2D3",
        marginBottom: moderateScale(20),
        alignSelf: "center",
        borderRadius: 10,
        alignItems: "center",
        elevation: 3,
    },
    OtpInput: {
        padding: 10,
        width: '100%',
        // backgroundColor: "#333",
        fontFamily: "Avenir-Medium",
        textAlign: "center",
        color: "#000",
        letterSpacing: 20,
        fontSize: 14,
    },
    img1: {
        height: "70%",
        width: "70%",
        bottom: "50%",
        zIndex: -20,
        left: "10%",
    },
    img2: {
        height: "20%",
        bottom: 0,
        zIndex: -1,
        width: "100%",
        position: "absolute",
    },
    Phone: {
        margin: 10,
        fontFamily: "Avenir-Medium",
        elevation: 1,
        zIndex: 1,
        padding: 5,
        textAlign: "left",
        color: "#000",
        // fontSize: 12,
        backgroundColor: "#D1D2D3",
        borderRadius: 10,
        width: "70%",
        fontSize: 15
    },
})

export default OtpStyles