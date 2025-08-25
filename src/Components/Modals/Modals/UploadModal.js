import React from "react";
import { StyleSheet, Image, View } from "react-native";

import CustomButton from '../../CustomButton/CustomButton'
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import TextLabel from "../../TextLabel/TextLable";
import colors from "../../../styles/colors";
import { verticalScale, moderateScale } from "../../../styles/responsiveSize";
import imagePath from "../../../constants/imagePath";

export default function UploadMOdal({ setValue, OnCamera, OnGallery,onPdf }) {

    return (
        <View style={styles.container}>
            <Image source={imagePath.AppLogoIcon} resizeMode={'contain'} style={styles.image} />

            <TextLabel
                label={'Select file from'}
                ResponsiveFonts={ResponsiveFonts.textualStyles.mediumNormal}
                width={'70%'}
                color={colors.black}
                textAlign={'center'}
                marginTop={20}
                alignSelf={'center'} />

            <CustomButton
                text={'GALLERY'}
                width={'80%'}
                onPress={() => {
                    setValue && setValue(false)
                    setTimeout(() => {
                        OnGallery()
                    }, 600)
                }}
                bgColor={colors.theme}
                fgColor={colors.white}
                marginTop={40}
                marginBottom={10}
            />

            <CustomButton
                text={'CAMERA'}
                width={'80%'}
                onPress={() => {
                    setValue && setValue(false)
                    setTimeout(() => {
                        OnCamera()
                    }, 600)
                }}
                bgColor={colors.theme}
                fgColor={colors.white}
                marginBottom={10}
            />
            {onPdf&&<CustomButton
                text={'PDF'}
                width={'80%'}
                onPress={() => {
                    setValue && setValue(false)
                    setTimeout(() => {
                        onPdf()
                    }, 600)
                }}
                bgColor={colors.theme}
                fgColor={colors.white}
                marginBottom={10}
            />}
            <CustomButton
                text={'Cancel'}
                width={'80%'}
                onPress={() => {
                    setValue && setValue(false)
                }}
                bgColor={colors.black}
                fgColor={colors.white}
                marginBottom={35}
            />
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