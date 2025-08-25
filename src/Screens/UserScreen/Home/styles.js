import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";
import { moderateScale, verticalScale } from "../../../styles/responsiveSize";

const styles = StyleSheet.create({
    container: { flex: 1, },
    maincontainer2: {
        borderRadius: 5,
        marginTop: "-10%",
        paddingTop: "10%",
        paddingBottom: "-10%",
        marginBottom: "-10%",
    },
    menuicon: {
        height: verticalScale(25),
        width: moderateScale(25),
        tintColor: colors.theme
    },
    icon: {
        height: verticalScale(80),
        width: moderateScale(80),
    },
    onlinecontainer: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.62,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 5,
        flexDirection: "row",
        alignItems: 'center'
    },
    onlineicon: {
        height: verticalScale(15),
        width: moderateScale(15),
    },
    itemicon: {
        height: verticalScale(30),
        width: moderateScale(30),
    },
    whiteroundcard: {
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        width: '90%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scrollview: {
        // backgroundColor: 'black',
        // height: '100%',
        flex: 1
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    row2: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemimage: {
        flex: 1,
        margin: 10,
        width: 80,
        height: 80,
    },
    itemimage1: {
        width: 60,
        height: 60,
    },
    leftMenuCon: {
        flexDirection: "row",
        alignItems: "center",
    }
});

export default styles