import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { Modalize } from 'react-native-modalize';

import TextLabel from '../TextLabel/TextLable';
import { ResponsiveFonts } from '../../constants/ResponsiveFonts';
import imagePath from '../../constants/imagePath';
import { moderateScale, verticalScale } from '../../styles/responsiveSize';
import colors from '../../styles/colors';
import CustomButton from '../CustomButton/CustomButton';


export const PaymentUpdate = () => {

    const modalizeRef = useRef(null);
    const accountRef = useRef(null);

    const [routingNumber, setRoutingNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    useEffect(() => {
        onOpen();
    }, [])

    return (
        <Modalize ref={modalizeRef} closeOnOverlayTap={false} adjustToContentHeight modalStyle={styles.modalStyle}>
            <View style={styles.headerRow}>
                <TextLabel label={"Payment Update"} ResponsiveFonts={ResponsiveFonts.textualStyles.large} color={colors.white} />
                <TouchableOpacity onPress={() => modalizeRef.current?.close()}>
                    <Image source={imagePath.close} resizeMode='contain' style={styles.closeIcon} />
                </TouchableOpacity>
            </View>

            <Image source={imagePath.RiderPayment} resizeMode='contain' style={styles.RiderPayment} />

            <TextLabel label={"Routing Number"} ResponsiveFonts={ResponsiveFonts.textualStyles.medium} color={colors.theme} marginLeft={20} />
            <TextInput
                blurOnSubmit={false}
                returnKeyType={"next"}
                onSubmitEditing={() => accountRef.current.focus()}
                style={[styles.Inputtxtlighter, ResponsiveFonts.textualStyles.TextInputFonts]}
                placeholder="Enter Routing Number"
                placeholderTextColor="#888"
                keyboardType={"decimal-pad"}
                onChangeText={(text) => setRoutingNumber(text)}
                value={routingNumber}
                textContentType="emailAddress"
                autoCapitalize='none'
                maxLength={40}
            />

            <TextLabel label={"Account Number"} ResponsiveFonts={ResponsiveFonts.textualStyles.medium} color={colors.theme} marginLeft={20} />
            <TextInput
                ref={accountRef}
                blurOnSubmit={false}
                returnKeyType={"next"}
                style={[styles.Inputtxtlighter, ResponsiveFonts.textualStyles.TextInputFonts]}
                placeholder="Enter Account Number"
                placeholderTextColor="#888"
                keyboardType={"decimal-pad"}
                onChangeText={(text) => setAccountNumber(text)}
                value={accountNumber}
                textContentType="emailAddress"
                autoCapitalize='none'
                maxLength={40}
            />

            <CustomButton
                text={'SAVE'}
                onPress={() => modalizeRef.current?.close()}
                bgColor={colors.theme}
                fgColor={colors.white}
                width={'50%'}
                isSecondary
                marginBottom={20}
                marginTop={20}
            />

        </Modalize>
    );
}

const styles = StyleSheet.create({
    closeIcon: {
        height: verticalScale(20),
        width: verticalScale(20),
        alignSelf: 'flex-end'
    },
    headerRow: {
        backgroundColor: colors.theme,
        flexDirection: 'row',
        justifyContent: "space-between",
        height: verticalScale(55),
        alignItems: "center",
        paddingHorizontal: moderateScale(20)
    },
    modalStyle: {
        borderTopLeftRadius: verticalScale(20),
        borderTopRightRadius: verticalScale(20),
        overflow: 'hidden',
        height: verticalScale(400)
    },
    RiderPayment: {
        height: verticalScale(90),
        width: verticalScale(90),
        alignSelf: "center",
        marginTop: verticalScale(20)
    },
    Inputtxtlighter: {
        margin: moderateScale(10),
        elevation: 1,
        zIndex: 1,
        padding: moderateScale(10),
        textAlign: "left",
        color: "#000",
        fontSize: 12,
        backgroundColor: "#fff",
        borderRadius: 10,
        width: "90%",
        height: verticalScale(60),
        alignSelf: "center",
        borderWidth: 1,
        borderColor: colors.theme
    },
})