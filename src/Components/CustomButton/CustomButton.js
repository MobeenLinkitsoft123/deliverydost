import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { verticalScale } from '../../styles/responsiveSize'
import colors from '../../styles/colors'

const CustomButton = ({ onPress, text, bgColor, fgColor, width, marginTop, Icon, marginLeft, fontSize, height, marginBottom, borderColor, disabled, borderRadius }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled == true ? true : false}
            style={[
                styles.container,
                bgColor ? { backgroundColor: bgColor } : {},
                width ? { width, } : {},
                marginTop ? { marginTop } : {},
                Icon ? { flexDirection: 'row', justifyContent: 'space-between' } : {},
                marginLeft ? { marginLeft } : {},
                height ? { height } : {},
                marginBottom ? { marginBottom } : {},
                borderColor ? { borderColor: borderColor, borderWidth: 1 } : {},
                borderRadius ? { borderRadius: borderRadius } : {}
            ]}>
            {Icon ?
                <Image source={Icon} style={{ height: 30, width: 30, tintColor: '#fff' }} />
                : null}
            <Text
                style={[
                    styles.text,
                    fgColor ? { color: fgColor } : {},
                    { fontWeight: 'bold' }

                ]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: verticalScale(60),
        width: '55%',
        alignSelf: 'center',

    },

    text: {
        color: colors.black,
    },


});

export default CustomButton;