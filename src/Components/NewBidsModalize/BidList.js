import React from 'react'
import { verticalScale, moderateScale } from '../../styles/responsiveSize';
import { Animated, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import colors from '../../styles/colors';

function BidList({ item }) {
    return (<View styles={styles.container}>

    </View>
    )
}

export default BidList

const styles = StyleSheet.create({

    container: {
        width: 300,
        height: verticalScale(200),
        alignSelf: "center",
        backgroundColor: 'red',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 8,

    },

});

