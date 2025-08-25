import React from "react";
import { StyleSheet, Image, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import CustomButton from '../../CustomButton/CustomButton'
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import TextLabel from "../../TextLabel/TextLable";
import colors from "../../../styles/colors";
import { verticalScale, moderateScale } from "../../../styles/responsiveSize";
import imagePath from "../../../constants/imagePath";
import { FirstLogin } from "../../../Store/Reducers/AppReducer/AppReducer";

export default function ModalPattern2({ setValue }) {

    const navigation = useNavigation();
    const dispatch = useDispatch()

    return (
        <View style={styles.container}>

            <Image source={imagePath.AppLogoIcon} resizeMode={'contain'} style={styles.image} />

            <TextLabel
                label={"Do you want to see the Tutorial?"}
                width={'70%'}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                textAlign={'center'}
                marginTop={30}
                color={colors.black}
                alignSelf={'center'} />


            <View style={styles.row}>
                <CustomButton
                    text={'YES'}
                    onPress={() => {
                        dispatch(FirstLogin(false))
                        navigation.navigate('Tutorial')
                        setValue && setValue(false);

                    }}
                    bgColor={colors.theme}
                    fgColor={colors.white}
                    width={'45%'}
                />

                <CustomButton
                    text={'NO'}
                    onPress={() => {
                        dispatch(FirstLogin(false))
                        setValue && setValue(false)
                    }}
                    bgColor={colors.black}
                    fgColor={colors.white}
                    width={'45%'}
                />
            </View>
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
    },
    row: {
        width: "80%",
        alignItems: "center",
        justifyContent: "space-around",
        alignSelf: "center",
        flexDirection: "row",
        marginBottom: verticalScale(30),
        marginTop: verticalScale(30)
    }
})