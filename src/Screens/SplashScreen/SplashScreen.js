import React from "react";
import { View, Image, StyleSheet } from "react-native";
import imagePath from "../../constants/imagePath";

function SplashScreen() {
    return (
        <View style={styles.conatiner}>
            <Image
                style={styles.image}
                resizeMethod='resize'
                resizeMode='contain'
                source={imagePath.AppLogo}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        justifyContent: "center",
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    image: { height: 150, width: 150, }
})
export default SplashScreen
