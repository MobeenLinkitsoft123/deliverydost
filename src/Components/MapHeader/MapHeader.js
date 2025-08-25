import React from "react";
import {
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles, whole } from "../../assets/styling/stylesheet";
import { StatusBarHeight, verticalScale } from "../../styles/responsiveSize";
import imagePath from "../../constants/imagePath";


function MapHeader({ animateLocation }) {

    const navigation = useNavigation()


    return (
        <ImageBackground style={HeaderStyles.container} imageStyle={{ height: 300 }} source={require("../../assets/images/whitg.png")} >
            <View style={[whole.Actionbartrans]}>

                <View style={whole.actionbarleft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={HeaderStyles.back}>
                        <Image source={require('../../assets/images/Back.png')} style={HeaderStyles.icon} />
                    </TouchableOpacity>
                </View>

                <View style={whole.actionbarcenter}>
                    <TouchableOpacity>
                        <Image style={{ width: 80, height: 55 }} resizeMode='contain' source={require("../../assets/images/icon18.png")} />
                    </TouchableOpacity>
                </View>

                <View style={[whole.actionbarright]}>
                    {/* <TouchableOpacity
                        onPress={() => animateLocation && animateLocation()}
                        style={{
                            zIndex: 999,
                            width: 40,
                            alignItems: "center",
                            height: 40,
                            backgroundColor: 'white',
                            elevation: 10,
                            borderRadius: 50,
                            justifyContent: 'center'
                        }}>
                        <Image source={imagePath.Ordermappoint} style={HeaderStyles.icon} />
                    </TouchableOpacity> */}
                </View>
            </View>
        </ImageBackground>
    )
}

export default MapHeader;

const HeaderStyles = StyleSheet.create({
    container: {
        width: "100%",
        // height: verticalScale(120),
        paddingTop: StatusBarHeight,
        // flex: 1,
        zIndex: 10,
        marginTop: -50,
        zIndex: 99999,
    },
    back: {
        zIndex: 999,
        width: 40,
        alignItems: "center",
        height: 40,
        backgroundColor: 'white',
        elevation: 10,
        borderRadius: 50,
        justifyContent: 'center'
    },
    icon: { height: 25, width: 25, tintColor: '#e54e5b' },
    marker: {
        zIndex: 999,
        width: 100,
        alignItems: "flex-end",
        padding: 10,
        height: 50,
    },


})