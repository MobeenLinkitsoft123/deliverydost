import { Platform, StyleSheet } from 'react-native';
import colors from '../../../styles/colors';
import commonStyles from '../../../styles/commonStyles';
import fontFamily from '../../../styles/fontFamily';
import { moderateScale, moderateScaleVertical, verticalScale, scale } from '../../../styles/responsiveSize';

const LoginStyles = StyleSheet.create({
    container: {

        width: "80%",
        // marginTop: "0%",
        height: "40%",
        alignItems: "center",
        marginTop: moderateScale(20)

    },

    container1: {

        width: "80%",
        // marginTop: "0%",
        // height: "40%",
        alignItems: "center",
        marginTop: moderateScale(20)

    },
    ScrollContainer: {
        flexGrow: 1,
        alignItems: 'center'
    },
    containerMain: {
        flex: 1,
        backgroundColor: colors.white
    },
    experienceText: {
        ...commonStyles.fontSize18,
        fontFamily: fontFamily.medium,
        alignSelf: 'center',
        marginVertical: moderateScaleVertical(16)
    },
    btnStyle: {
        backgroundColor: colors.lighPink,
        alignSelf: 'center',
        marginTop: moderateScaleVertical(16)
    },
    headerStyle: {
        alignItems: 'center',
        paddingHorizontal: 0,
        marginBottom: moderateScaleVertical(24)
    },
    logo: { height: '40%', width: '60%', top: 20 },
    InputContaoner: {
        position: "relative",
        width: "100%",
        marginTop: 10,
        // alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    eyecontainer: {
        zIndex: 2,
        elevation: 2,
        position: "absolute",
        right: 20,
        padding: 10,
    },
    eye: {
        height: verticalScale(20),
        width: moderateScale(20)
    },
    Remcontainer: { flexDirection: "row", alignSelf: 'center', marginTop: 10, alignItems: "center" },
    RemText: {
        height: verticalScale(15), width: moderateScale(15), borderRadius: moderateScale(15), borderWidth: moderateScale(1),
        marginRight: 10,
    },
    Signup: {

        marginTop: moderateScale(10),
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        backfaceVisibility: "visible",
        elevation: moderateScale(10)
    },
    textsignup: {
        fontSize: scale(11),
        marginTop: "2%",
    },
    textsignup2: { textDecorationLine: 'underline', fontSize: scale(12) },
    textsignup3: {
        color: "#000",
        fontSize: scale(11),
        marginTop: "2%",
    },
    bottomIMage: {
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
        width: "90%",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 5
    },
    circleCheck: {
        height: (15),
        width: (15),
        borderRadius: (15),
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: "red"
    },
    circle: {
        height: (15),
        width: (15),
        borderRadius: (15),
        borderWidth: 1,
        borderColor: 'red'
    },
    genderrow: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: "center"
    },
    msg: { width: "70%", alignSelf: "center", justifyContent: "center", alignItems: "center", flexDirection: "row", marginTop: -5 },
    info: {
        height: 10,
        width: 10,
        marginTop: Platform.OS == 'android' ? verticalScale(5) : 2,
        marginRight: 3
    },
    infoText: { textAlign: "center", color: "#000", fontSize: 10, marginTop: 15 }

});

export default LoginStyles