import { StyleSheet } from "react-native";
import { verticalScale, moderateScale } from "../../../styles/responsiveSize";
import colors from "../../../styles/colors";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    rowDate:{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: "80%", alignSelf: "center" },
    totalContainer: {
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        marginTop: verticalScale(30),
        width: '95%',
        alignSelf: 'center',
        // height: verticalScale(160),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
    extraPadding: {
        padding: moderateScale(10)
    },
    moneyIcon: {
        height: verticalScale(50),
        width: verticalScale(50)
    },
    moneyIcon2: {
        height: verticalScale(50),
        width: verticalScale(50),
        position:"absolute",
        top: verticalScale(0),
        right: verticalScale(10),
    },
    fixedline: {
        position: "absolute",
        top: verticalScale(13),
        height: verticalScale(55),
        width: verticalScale(4),
        borderRadius: 20,
    },
    fixedline2: {
        position: "absolute",
        top: verticalScale(13),
        height: verticalScale(90),
        width: verticalScale(4),
        borderRadius: 20,
    },
    moneyContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "92%",
        backgroundColor: colors.white,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        marginTop: verticalScale(10),
        padding: moderateScale(3),
        paddingHorizontal: verticalScale(20),
        borderRadius: moderateScale(10),
        minHeight: verticalScale(80),
    },
    textRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        marginTop: verticalScale(10),
        width: "33%"
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: "100%",
        marginVertical: verticalScale(10)
    },
    paymentCard: {
        width: '100%',
        alignSelf: "center",
        height: verticalScale(200),
        justifyContent: "center",
        alignItems: "center"
    },
    PayOutIcons: {
        height: verticalScale(25),
        width: verticalScale(25),
    },
    image: {
        height: verticalScale(15),
        width: verticalScale(15)
    },
    paymentamount: {
        color: colors.theme,
    },
    paymentDetails: {
        color: colors.black,
    },
    payouthistory: {
        color: colors.theme,
        marginLeft: moderateScale(20),
        marginTop: verticalScale(20),
        marginBottom: verticalScale(10)
    },
    lines: {
        width: '90%',
        height: 1,
        alignSelf: "center",
        backgroundColor: colors.grayLight,
    },
    list: {
        flex: 1,
    },
    contentContainerStyle: {
        paddingBottom: verticalScale(20),
    },
    nodatatext: {
        color: colors.grayLight,
        textAlign: "center",
        marginTop: verticalScale(50)
    },
    FixedView: {
        // position: 'absolute',
        // bottom: '30%',
        // justifyContent: "center",
        // alignItems: "center",
        // alignSelf: "center",
    },
    contentContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    close: {
        alignSelf: "center",
        fontSize: 16
    },
});

export default Styles;