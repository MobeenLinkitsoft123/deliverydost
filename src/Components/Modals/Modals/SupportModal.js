import { Linking, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { height, moderateScale, verticalScale, width } from '../../../styles/responsiveSize'
import imagePath from '../../../constants/imagePath'
import colors from '../../../styles/colors'
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts'
import TextLabel from '../../TextLabel/TextLable'
import CustomButton from '../../CustomButton/CustomButton'
import AnimatedModal from '../AnimatedModal'

const SupportModal = ({ support, setsupport, supportCondition, phoneNumber, distanceForRange, milesToMeters, setsupportCondition, OrderStatus }) => {
    return (
        <View style={styles.supportcon1}>
            <AnimatedModal visible={support} onClose={() => { setsupport(false) }} >
                <View style={styles.supportCon2}>
                    <View style={styles.suportCon3}>
                        <Image source={imagePath.AppLogoIcon} resizeMode="contain" style={styles.img} />
                    </View>
                    <View style={styles.w100}>
                        <TextLabel marginBottom={20} textAlign={'center'} color={colors.theme} ResponsiveFonts={ResponsiveFonts.textualStyles.medium} label={`You are not in ${(distanceForRange && milesToMeters(distanceForRange || 0)) || null} meters(s) of ${OrderStatus == 'startdelivery' ? 'Drop-off' : 'Pick-up'} location. Please reach to the ${OrderStatus == 'startdelivery' ? 'Drop-off' : 'Pick-up'} location and try again`} />
                        {/* <TextLabel marginBottom={10} textAlign={supportCondition ? 'left' : 'center'} color={colors.black} ResponsiveFonts={ResponsiveFonts.textualStyles.small} label={`Please reach to the ${OrderStatus == 'startdelivery' ? 'Drop-off' : 'Pick-up'} location and try again`} /> */}

                        {supportCondition && (<TextLabel marginBottom={20} ResponsiveFonts={ResponsiveFonts.textualStyles.small} label={`If you're unable to tap on the "I have arrived button", here are the most likely scenarios:`} />)}

                        {supportCondition && (
                            <>
                                <View style={styles.styloCon5}>
                                    <View style={styles.supportCon6}>
                                        <TextLabel ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold} label={'1'} color={colors.white} />
                                    </View>
                                    <View style={styles.w90}>
                                        <TextLabel ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold} label={`Please ensure that your device location services are enabled`} />
                                    </View>
                                </View>
                                <View style={styles.styloCon5}>
                                    <View style={styles.supportCon6}>
                                        <TextLabel ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold} label={'2'} color={colors.white} />
                                    </View>
                                    <View style={styles.w90}>
                                        <TextLabel ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold} label={'Please ensure that your internet connection is stable and functioning properly'} />
                                    </View>
                                </View>
                                <View style={styles.styloCon5}>
                                    <View style={styles.supportCon6}>
                                        <TextLabel ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold} label={'3'} color={colors.white} />
                                    </View>
                                    <View style={styles.w90}>
                                        <TextLabel ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold} label={'Please ensure you are in close proximity to the specified location'} />
                                    </View>
                                </View>
                            </>
                        )}
                    </View>

                    {supportCondition && (<TextLabel marginBottom={10} marginTop={10} ResponsiveFonts={ResponsiveFonts.textualStyles.small} label={`If the issue still persist after you've tried all the steps above, try getting help from our customer support.`} />)}

                    <View style={styles.supportCon9(supportCondition)}>
                        {supportCondition && <CustomButton
                            width={'48%'}
                            text={'Call Support'}
                            onPress={
                                () => { Linking.openURL(`tel:${phoneNumber?.number ? phoneNumber?.number : ''}`); setsupportCondition(false); setsupport(false) }
                            }
                            bgColor={colors.green1}
                            fgColor={colors.white}
                            marginTop={15}
                            marginBottom={5}
                            height={50}
                        />}
                        <CustomButton
                            width={'48%'}
                            text={'Okay'}
                            onPress={() => {
                                setsupport(false)
                            }}
                            bgColor={colors.theme}
                            fgColor={colors.white}
                            marginTop={15}
                            marginBottom={5}
                            height={50}
                        />
                    </View>

                    {!supportCondition && (<TouchableOpacity onPress={() => setsupportCondition(true)} style={styles.supportCon8}>
                        <Text style={styles.textSupport}>Need Help?</Text>
                    </TouchableOpacity>)}

                </View>
            </AnimatedModal>
        </View>
    )
}

export default SupportModal

const styles = StyleSheet.create({
    supportcon1: {
        width: width,
        height: height,
        position: 'absolute',
        zIndex: 8888888
    },
    supportCon2: {
        width: '90%',
        backgroundColor: colors.white,
        paddingVertical: moderateScale(10),
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(10)
    },
    suportCon3: {
        width: moderateScale(45),
        height: moderateScale(45),
        alignSelf: 'center',
        marginBottom: verticalScale(15)
    },
    img: {
        width: '100%',
        height: '100%'
    },
    styloCon4: {
        width: '100%',
        alignItems: 'flex-start'
    },
    styloCon5: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: verticalScale(10)
    },
    supportCon6: {
        width: moderateScale(25),
        height: moderateScale(25),
        borderRadius: width / 2,
        backgroundColor: colors.theme,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: moderateScale(5)
    },
    w90: {
        width: '90%'
    },
    w100: {
        width: '100%'
    },
    supportCon7: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    supportCon8: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: verticalScale(10)
    },
    textSupport: {
        ...ResponsiveFonts.textualStyles.smallBold,
        color: colors.theme,
        textDecorationLine: 'underline'
    },
    supportCon9: (supportCondition) => ({
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: supportCondition ? 'space-between' : 'center'
    })
})