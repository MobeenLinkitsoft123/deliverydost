import { StyleSheet } from 'react-native';
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
        height: (15), width: (15), borderRadius: (17), borderWidth: moderateScale(1),
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


});

export default LoginStyles