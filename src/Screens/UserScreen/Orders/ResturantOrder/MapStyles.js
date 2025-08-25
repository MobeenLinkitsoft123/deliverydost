import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "../../../../styles/responsiveSize";

const MapStyles = StyleSheet.create({

    container: { flexDirection: "column", flex: 1, zIndex: 99 },
    lodercontainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff'
    },
    // OrderTrail
    container1: {
        position: "absolute",
        zIndex: 99,
        top: "32%",
        right: 10,
    },
    img: {
        height: 20,
        width: 20,
    },
    con2: {
        position: "absolute",
        zIndex: 99,
        top: "17%",
        right: 10,
    },
    con3: {
        position: "absolute",
        zIndex: 99999,
        top: "10%",
        right: 10,
    },
    con4: {
        position: "absolute",
        zIndex: 99,
        right: 10,
    },
    img1: {
        width: 25,
        height: 25,
        tintColor: "#e54e5b"
    },
    img2: {
        width: 24,
        height: 24,
        tintColor: "#e54e5b"
    },
    bg: {
        backgroundColor: "#fff",
    },
    textColor: {
        color: "#e54e5b",
    },
    tWhite: { tintColor: "#e54e5b" },
    imageBackgroundStyle: {
        width: "100%",
        marginBottom: -10
    },
    imageBackgroundStyleImg: { transform: [{ rotate: "180deg" }] },
    con5: {
        flexDirection: "column",
        justifyContent: "flex-start",
        top: 0,
    },
    con6: {
        flexDirection: "column",
    },
    text2: {
        color: "#e54e5b",
        marginTop: 0
    },
    text3: {
        color: "black",
        marginTop: 10
    },
    loaderView: {
        height: 160,
        width: 160
    },
    w100: {
        width: "100%"
    },
    text4: {
        textAlign: "center",
        color: "#e54e5b"
    },
    con7: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    textWhite: { color: "white" },
    con8: {
        width: '85%',
        alignSelf: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    alignTextCenter: { textAlign: "center" },
    img3: {
        width: moderateScale(80),
        height: moderateScale(80),
    },
    img4: {
        width: '100%',
        height: '100%'
    },
    text5: {
        color: "#e54e5b",
        marginTop: verticalScale(5)
    },
    mt20w100: { marginTop: 20, width: "100%" },
    w35h35: { width: 35, height: 35 },
    h30w90: { height: 30, width: 90 },

});


export default MapStyles