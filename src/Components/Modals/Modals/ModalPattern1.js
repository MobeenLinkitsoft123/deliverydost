import React from "react";
import { StyleSheet, Image, View } from "react-native";

import CustomButton from '../../CustomButton/CustomButton'
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import TextLabel from "../../TextLabel/TextLable";
import colors from "../../../styles/colors";
import { verticalScale, moderateScale } from "../../../styles/responsiveSize";
import imagePath from "../../../constants/imagePath";

export default function ModalPattern1({ setValue, heading, msg, OnPress, btnTittle, icon, tintColor, noOp, noOpTitle }) {

    return (
        <View style={styles.container}>
            <Image source={imagePath.AppLogoIcon} resizeMode={'contain'} style={styles.image} />

            {icon &&
                <Image source={icon} style={[styles.icon, tintColor ? { tintColor } : null]} resizeMode={'contain'} />
            }

            {heading && <TextLabel
                label={heading}
                width={noOp ? '80%' : '70%'}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                textAlign={'center'}
                marginTop={30}
                color={colors.black}
                alignSelf={'center'} />}

            {msg && <TextLabel
                label={msg}
                ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                width={'70%'}
                color={colors.black}
                textAlign={'center'}
                marginTop={20}
                alignSelf={'center'} />}
            {noOp ? (
                <View style={{
                    width: '85%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 40
                }}>

                    <CustomButton
                        text={btnTittle}
                        onPress={() => {
                            setValue && setValue(false)
                            OnPress && OnPress()
                        }}
                        bgColor={colors.theme}
                        fgColor={colors.white}
                        // marginTop={40}
                        marginBottom={35}
                        width={'45%'}
                    />
                    <CustomButton
                        text={noOpTitle ? noOpTitle : 'No'}
                        onPress={() => noOp()}
                        bgColor={noOpTitle ? colors.blackOpacity80 : colors.theme}
                        fgColor={colors.white}
                        // marginTop={40}
                        marginBottom={35}
                        width={'45%'}
                    />
                </View>

            ) : (
                <CustomButton
                    text={btnTittle}
                    onPress={() => {
                        setValue && setValue(false)
                        OnPress && OnPress()
                    }}
                    bgColor={colors.theme}
                    fgColor={colors.white}
                    marginTop={40}
                    marginBottom={35}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        alignSelf: 'center',
        borderRadius: moderateScale(15),
        backgroundColor: colors.white,
        overflow: "hidden"
    },
    image: {
        width: "50%",
        height: verticalScale(50),
        marginTop: verticalScale(20),
        alignSelf: "center"
    },
    icon: {
        width: "40%",
        height: verticalScale(100),
        alignSelf: "center",
        // tintColor: colors.AppRed
    }
})