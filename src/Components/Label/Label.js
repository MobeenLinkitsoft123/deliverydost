import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import { scale } from '../../styles/responsiveSize';


const Label = ({
    label,
    fontSize,
    color,
    marginTop,
    paddingHorizontal,
    fontFamily,
    marginLeft,
    alignSelf,
    marginBottom,
    textAlign,
    width,
    fontWeight,
    ResponsiveFonts,
    numberOfLines,
    steric
}) => {
    return (
        <View
            style={[
                Styles.containers,
                paddingHorizontal ? { paddingHorizontal } : { paddingHorizontal: 10 },
                marginTop ? { marginTop } : { marginTop: 0 },
                alignSelf ? { alignSelf } : {},
                // steric && { flexDirection: 'row' }
            ]}>
            <Text
                allowFontScaling={false}
                numberOfLines={numberOfLines}
                style={[
                    ResponsiveFonts ? ResponsiveFonts : {},
                    // fontFamily ? { fontFamily } : { fontFamily: 'Futura' },
                    // fontSize ? { fontSize: scale(fontSize) } : { fontSize: scale(17) },
                    color ? { color } : { color: colors.white },
                    marginLeft ? { marginLeft } : {},

                    alignSelf ? { alignSelf } : {},
                    marginBottom ? { marginBottom } : {},
                    textAlign ? { textAlign } : {},
                    width ? { width } : {},
                    fontWeight ? { fontWeight } : { fontWeight: '600' },
                ]}>
                {label}{steric && (
                    <Text style={[
                        ResponsiveFonts ? ResponsiveFonts : {},
                        // fontFamily ? { fontFamily } : { fontFamily: 'Futura' },
                        // fontSize ? { fontSize: scale(fontSize) } : { fontSize: scale(17) },
                        { color: colors.theme },
                        marginLeft ? { marginLeft } : {},

                        alignSelf ? { alignSelf } : {},
                        marginBottom ? { marginBottom } : {},
                        textAlign ? { textAlign } : {},
                        width ? { width } : {},
                        fontWeight ? { fontWeight } : { fontWeight: '600' },
                    ]}>
                        {' *'}
                    </Text>
                )}
            </Text>
        </View>
    );
};

export default Label;

const Styles = StyleSheet.create({
    containers: {
        // justifyContent: 'flex-start',
        // alignItems: 'flex-start',
    },
    Text: {
        fontStyle: 'normal',
    },
});