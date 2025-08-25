import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "../../../styles/responsiveSize";
import colors from "../../../styles/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF'
    },
    tagtext: {
        // fontSize: 12,
        color: "#fff",
    },
    tagtextView: {
        // padding: 10,
        height: verticalScale(35),
        width: '33%',
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    datetext: { fontSize: 12, color: "#999" },
    itemcontainer: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    ordertext: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#e54e5b",
        fontFamily: "Avenir-Black",
    },
    bidcon: {
        flexDirection: "row",
        padding: 10,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#e54e5b",
        borderRadius: 5,
        marginVertical: 10,
        justifyContent: "space-between",
        alignItems: "center",
    },
    text1: {
        fontSize: 18,
        fontWeight: "700"
    },
    tipView: {
        width: '30%',
        paddingVertical: verticalScale(7),
        backgroundColor: colors.themeLight,
        position: 'absolute',
        top: verticalScale(20),
        right: 0,
        borderTopLeftRadius: moderateScale(15),
        borderBottomLeftRadius: moderateScale(15),
        alignItems: 'center',
        justifyContent: 'center'
        // paddingLeft: moderateScale(10)
    }

})

export default styles;