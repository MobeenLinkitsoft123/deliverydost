import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "../../../styles/responsiveSize";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF'
    },
    containerItem: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    containerItem2: {
        flexDirection: "row",
        width: "106%",
        alignItems: "center",
        justifyContent: "space-between",
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 80
    },
    text1: { fontFamily: "Avenir-Black", margin: 0, textAlign: "center" },
    text2: { color: "#888", margin: 0, textAlign: "center" },
    row: { justifyContent: "center", flexDirection: "row", top: -3 },
    text3: { color: "#ee535d", margin: 0, textAlign: "center" },
    row2: {
        justifyContent: "center",
        flexDirection: "row",
        top: -5,
    },
    row3: {
        justifyContent: "flex-end",
        flexDirection: "column",
        alignContent: "flex-end",
        alignItems: "flex-end",
        alignSelf: "flex-end",
    },
    row4: {
        justifyContent: "center",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        paddingRight: 6,
        marginBottom: 10,
    },
    row4: {
        justifyContent: "flex-end",
        flexDirection: "row",
        alignContent: "flex-end",
        alignItems: "flex-end",
        alignSelf: "flex-end",
        paddingRight: 6,
        marginBottom: 10,
    },
    text4: {
        textTransform: "uppercase",
        textAlign: "center",
        color: "#fff",
        width: '100%'
    },
    text5: {
        alignSelf: "center",
        textAlign: "center",
        color: "#fff",
    },
    tagView: {
        height: verticalScale(35),
        width: moderateScale(100),
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    row5:
    {
        justifyContent: "space-between",
        width: "104%",
        flexDirection: "row",
    },
    row6: {
        alignItems: "flex-start",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "center",
    },
    text6: {
        fontSize: 13,
        marginTop: 10,
        marginBottom: 3,
        fontFamily: "Avenir-Medium",
        color: "#ee535d",
    },
    text7: {
        textAlign: "left",
        fontSize: 10,
        marginBottom: 5,
        fontFamily: "Avenir-Medium",
        color: "black",
        // width: wp('30%'),
    },
    row7: {
        justifyContent: "space-between",
        width: "104%",
        flexDirection: "row",
    },
    text8: {
        alignSelf: "center",
        fontSize: 10,
        fontFamily: "Avenir-Black",
        color: "black",
    },
    text9: {
        alignSelf: "center",
        fontSize: 15,
        fontFamily: "Avenir-Black",
        color: "#ee535d",
    },
    text10: {
        alignSelf: "center",
        fontSize: 10,
        fontFamily: "Avenir-Black",
        color: "black",
    },
    text11: {
        alignSelf: "center",
        fontSize: 15,
        fontFamily: "Avenir-Black",
        color: "#ee535d",
    },
    text12: {
        alignSelf: "center",
        fontSize: 10,
        fontFamily: "Avenir-Black",
        color: "black",
    },
    text13: {
        alignSelf: "center",
        fontSize: 15,
        fontFamily: "Avenir-Black",
        color: "#ee535d",
    },
    row7Con: { flexDirection: "row", alignItems: "flex-end", top: 10 }

})

export default styles;