import { StyleSheet, Dimensions, I18nManager } from 'react-native';
import colors from '../../../styles/colors';
import { moderateScale, verticalScale } from '../../../styles/responsiveSize';
// dimenstion
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    displayImage: {
        height: moderateScale(100),
        width: moderateScale(100),
        borderRadius: width / 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        alignSelf: 'center',
        marginTop: moderateScale(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        height: '100%',
        width: '100%',
        borderRadius: width / 2
    },
    cont: {
        flexGrow: 1
    },
    upperHeadingCon: {
        width: '100%',
        alignItems: 'center'
    },
    notverf: {
        marginTop: moderateScale(10),
        textAlign: "center",
        backgroundColor: colors.theme,
        width: "40%",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: moderateScale(5)
    },
    infoCon: {
        width: '90%',
        alignSelf: 'center',
        borderRadius: moderateScale(10),
        marginTop: moderateScale(20)
    },
    infoConCenter: {
        width: '90%',
        alignSelf: 'center',
        padding: moderateScale(5),
        borderColor: colors.theme,
        borderWidth: 1,
        borderRadius: moderateScale(5),
        marginBottom: moderateScale(10),
        height: verticalScale(55),
        backgroundColor: '#cccccc80'
    },
    delBtn: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(20)
    },
    delBtnText: {
        color: colors.theme,
        textDecorationLine: 'underline'
    },
    modalBg: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    row:{
        justifyContent:"space-between",
        alignItems:"center",
        width:"95%",
        flexDirection:"row",
        marginTop:verticalScale(15),
        alignSelf:"center"
    }
});