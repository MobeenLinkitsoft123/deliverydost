import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";
import { moderateScale, verticalScale, width } from "../../../styles/responsiveSize";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF'
    },
    container2: {
        flex: 1,
        backgroundColor: '#FFFF',
        alignItems: "center",
        marginTop: verticalScale(40)
    },
    TextArea: {
        minHeight: '40%',
        backgroundColor: colors.white,
        borderColor: colors.theme,
        width: "90%",
        alignSelf: "center",
        padding: 20,
        textAlign: 'justify',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 20,
        letterSpacing: 2,
        fontWeight: "500",
        color: '#000'
    },
    btn: {
        width: "60%",
        backgroundColor: colors.theme,
        marginTop: verticalScale(40),
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center"
    },
    textsignup3: {
        color: '#fff'
    },
    icon: {
        tintColor: "#fff",
        height: verticalScale(30),
        width: verticalScale(30)
    },
    textwarn: {
        letterSpacing: 2,
        textAlign: "right",
        width: '90%',
        alignSelf: "center",
        marginRight: 20,
        marginBottom: 10
    },
    mihmax: { minHeight: 250, maxHeight: 251 },
    con: {
        width: width * 0.9,
        borderWidth: 1,
        borderColor: '#D1D2D3',
        alignSelf: 'center',
        marginVertical: verticalScale(20)
    },
    con1: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
    },
    imgCon: {
        height: moderateScale(20),
        width: moderateScale(20)
    },
    img: {
        width: '100%',
        height: '100%',
        tintColor: colors?.theme
    },
    text1: {
        textAlign: 'center',
        marginTop: verticalScale(5),
        color: colors.theme,
        width: '95%',
    },
    callMsgCon: {
        flexDirection: 'row',
        width: width * 0.4,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: verticalScale(10)
    },
    phoneCallCon: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(20)
    },
    imgCon1: {
        width: width * 0.1,
        height: width * 0.1
    },
    img1: {
        width: '100%',
        height: '100%',
        tintColor: colors?.theme
    },
    text2: {
        textAlign: 'center',
        marginTop: verticalScale(5),
        color: colors.theme,
    },
    con3: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(15),
        paddingVertical: verticalScale(20)
    }
})

export default styles;