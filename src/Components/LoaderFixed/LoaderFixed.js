import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import colors from '../../styles/colors'
import { height, width } from '../../styles/responsiveSize'

const LoaderFixed = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator animating={true} color={colors.AppRed} size={'large'} />
        </View>
    )
}

export default LoaderFixed

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        flex: 1,
        backgroundColor: colors.blackOpacity20,
        height: height,
        width: width,
        justifyContent: "center",
        alignItems: "center"
    }
})