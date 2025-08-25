import { Image, Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from "react-native-reanimated";

import { moderateScale, verticalScale, width } from '../../styles/responsiveSize';
import TextLabel from '../TextLabel/TextLable';

import { ResponsiveFonts } from '../../constants/ResponsiveFonts';


import colors from '../../styles/colors';
import CustomButton from '../CustomButton/CustomButton';

const NotificationPermissionModal = ({ OnPress }) => {
    return (
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.container}>
            <Image source={require('../../assets/images/notification-Bell.png')} resizeMode='contain' style={styles.notificationBell} />
            <TextLabel label={'Please Allow Notifications'} fontFamily={ResponsiveFonts.textualStyles.largeBold} marginTop={20} textAlign={'center'} color={colors.black} />
            <TextLabel label={"Stay in the loop with Foodosti! Enable notifications to get updates on new restaurants, offers, and bids so you can decide how much to pay for your delivery."} fontFamily={ResponsiveFonts.textualStyles.medium} marginTop={10}
                marginBottom={30} textAlign={'center'} width={'80%'} alignSelf={'center'} />


            <CustomButton
                text={'Turn On Notifications'}
                onPress={() => {
                    Platform.OS == 'ios' ? Linking.openURL('App-Prefs:NOTIFICATIONS_ID&path=com.linkitsoft.deliverydost')
                        : Linking.openSettings();
                    OnPress()
                }}
                bgColor={colors.theme}
                fgColor={colors.white}
                width={'50%'}
                isSecondary
            />

            <TouchableOpacity onPress={() => OnPress()}>
                <TextLabel label={"Not now"} fontFamily={ResponsiveFonts.textualStyles.medium} marginTop={10}
                    marginBottom={30} textAlign={'center'} width={'80%'} alignSelf={'center'} color={colors.GRAY} />
            </TouchableOpacity>
        </Animated.View>
    )
}

export default NotificationPermissionModal

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.white,
        padding: moderateScale(25),
        borderColor: colors.grey,
        marginTop: verticalScale(25),
        borderRadius: moderateScale(40),
        alignSelf: "center",
        position: "absolute",
        bottom: verticalScale(10),
        // height: verticalScale(300)
    },
    item: {
        width: "65%",
    },
    AppIcon: {
        height: verticalScale(80),
        width: moderateScale(80),
        alignSelf: "center",
    },
    rowItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: moderateScale(2),
        marginBottom: verticalScale(10)
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "98%",
        alignSelf: "center",
        borderBottomWidth: 1,
        borderColor: colors.grey1,
        paddingBottom: verticalScale(5)
    },
    OrderViewDetails: {
        height: '100%',
        width: '100%'
    },
    notificationBell: {
        height: verticalScale(100),
        width: moderateScale(100),
        alignSelf: "center"
    }
})