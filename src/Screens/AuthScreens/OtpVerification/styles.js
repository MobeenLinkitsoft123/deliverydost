import { StyleSheet } from "react-native"
import { moderateScale, StatusBarHeight, verticalScale } from "../../../styles/responsiveSize";

const OtpStyles = StyleSheet.create({
    HeaderImage: {
        height: 50,
        width: "50%",
    },
    InputView: {
        width: '60%',
        height: verticalScale(50),
        justifyContent: "center",
        backgroundColor: "#D1D2D3",
        marginBottom: moderateScale(20),
        alignSelf: "center",
        borderRadius: 10,
        alignItems: "center",
        elevation: 3,
    },
    circle: {
        height: (40),
        width: (40),
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'red',
        justifyContent: "center",
        alignItems: 'center'
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
        height: "50%",
        width: "70%",
        bottom: "38%",
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
    HeaderImage2: {
        height: verticalScale(20),
        width: moderateScale(20),
        tintColor: "red"
    },
    rowHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        top: StatusBarHeight,
        width: '95%',
        alignItems: "center"
    },
})

export default OtpStyles