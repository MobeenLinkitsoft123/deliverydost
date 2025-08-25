import React, { useState, useEffect } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'

import { verticalScale, moderateScale } from '../../styles/responsiveSize'
import { ResponsiveFonts } from '../../constants/ResponsiveFonts'
import colors from '../../styles/colors'

const DISTANCE_BETWEEN_TABS = 25


function MyTabBar({ state, setSelectedType, selectedType }) {
    const [widths, setWidths] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(selectedType);
    const [activeLinePosition, setActiveLinePosition] = useState(new Animated.Value(0));

    const handleTabLayout = (event, index) => {
        const { width } = event.nativeEvent.layout;
        if (!isNaN(width)) {  // Only store valid widths
            setWidths(prevWidths => {
                const newWidths = [...prevWidths];
                newWidths[index] = width;
                return newWidths;
            });
        }
    };

    useEffect(() => {
        if (selectedType !== null && widths[selectedType] !== undefined && !isNaN(widths[selectedType])) {
            Animated.timing(activeLinePosition, {
                toValue: selectedType * (widths[selectedType] + DISTANCE_BETWEEN_TABS),
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [selectedIndex, widths, selectedType]);

    return (
        <View style={styles.row}>
            {state.map((route, index) => {
                const label = route.label;
                const isFocused = selectedType === index;
                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole='button'
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={() => {
                            setSelectedType(index);
                            setSelectedIndex(index);
                        }}
                        style={[isFocused ? styles.activeTab : styles.UnActiveTab]}
                        onLayout={(event) => handleTabLayout(event, index)}
                    >
                        <Animated.Text style={[styles.label, isFocused && styles.activeLabel]}>
                            {label}
                        </Animated.Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default ({ setSelectedType, selectedType, list }) => {
    return (
        <MyTabBar state={list} setSelectedType={setSelectedType} selectedType={selectedType} />
    );
};

const styles = StyleSheet.create({
    row: {
        width: "95%",
        alignSelf: 'center',
        flexDirection: 'row',
        marginVertical: verticalScale(15),
        justifyContent: "space-between"
    },
    label: {
        color: '#000',
        ...ResponsiveFonts.textualStyles.medium
    },
    activeLabel: {
        color: colors.white,
    },
    activeTab: {
        width: "32%",
        backgroundColor: colors.theme,
        justifyContent: "center",
        alignItems: "center",
        padding: moderateScale(10),
        borderRadius: moderateScale(20),
    },
    UnActiveTab: {
        width: "32%",
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
        padding: moderateScale(10),
        borderRadius: moderateScale(20),
        height: verticalScale(45),
        borderWidth: 1,
        borderColor: colors.grayLight,
    }
});