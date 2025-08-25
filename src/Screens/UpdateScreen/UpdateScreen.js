import React from 'react'
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Platform } from 'react-native'
import { Linking } from 'react-native'

import colors from '../../styles/colors'
import { width } from '../../styles/responsiveSize'
import { ResponsiveFonts } from '../../constants/ResponsiveFonts'
import imagePath from '../../constants/imagePath'

const UpdateScreen = () => {

    const OpenApp = () => {
        if (Platform.OS == 'ios') {
            Linking.openURL('https://apps.apple.com/us/app/FoodostiDriver/id1602964934')
        } else {
            Linking.openURL('https://play.google.com/store/apps/details?id=com.deliverydost&pli=1')
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.innerContainerHeader}>
                    <View style={styles.innerContainerImg}>
                        <Image
                            source={imagePath?.AppLogo}
                            style={styles.img}
                            resizeMode='contain'
                        />
                    </View>
                </View>
                <View style={styles.innerContainer1}>
                    <Text style={[ResponsiveFonts.textualStyles.largeBold, { marginBottom: width * 0.03 }]}>New Update Available</Text>
                    <Text style={[ResponsiveFonts.textualStyles.mediumBold, { textAlign: 'center' }]}>Please update the app to the latest version.</Text>
                </View>
                <TouchableOpacity style={styles.btn} onPress={OpenApp}>
                    <Text style={[ResponsiveFonts.textualStyles.smallBold, { color: colors.white }]}>Update</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default UpdateScreen

const styles = StyleSheet.create({
    container: {
        position: 'absolute',

        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    },
    innerContainer: {
        width: '85%',
        backgroundColor: colors.white,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'

    },
    innerContainer1: {
        alignItems: 'center',
        marginVertical: width * 0.1
    },
    btn: {
        width: '50%',
        backgroundColor: colors.theme,
        borderRadius: width * 0.02,
        alignItems: 'center',
        paddingVertical: width * 0.04,
        marginBottom: width * 0.04
    },
    innerContainerImg: {
        width: width * 0.35,
        height: width * 0.15,
    },
    img: {
        width: '100%',
        height: '100%',
    },
    innerContainerHeader: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        height: width * 0.2,
    }
})