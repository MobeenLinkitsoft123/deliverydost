import { TouchableOpacity, Image, Platform, StyleSheet, View } from "react-native";
import React from "react";

import placeholder from "../../assets/images/uploadprofile.png";
import plus from '../../assets/images/plus.png'
import pencil from '../../assets/images/pencil.png'

import { moderateScale, moderateScaleVertical, verticalScale } from "../../styles/responsiveSize";
import colors from "../../styles/colors";


const ProfilePicker = (props) => {
    const { source, onPress, close } = props;


    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Image
                source={source?.uri != undefined ? {
                    uri: Platform.OS === "android" ? "file://" + source.uri : source.uri,
                }
                    : placeholder
                }
                style={styles.img}
                resizeMode={'cover'}
            />
            {!source?.uri ? (
                <Image source={plus} style={styles.imgicon} resizeMode={'contain'} />
            ) : null}
            {source?.uri ? (
                <View style={styles.imgicon1} >
                    <Image source={pencil} style={styles.imgicon2} resizeMode={'contain'} />
                </View>
            ) : null}
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
    },
    img: {
        width: 130,
        height: 130,
        resizeMode: "cover",
        margin: moderateScale(10),
        alignSelf: "center",
        borderRadius: 100
        // borderWidth: 2,
        // borderColor: "#d33d3f",
    },
    imgicon: {
        height: verticalScale(35),
        width: moderateScale(35),
        position: "absolute",
        top: 5,
        right: 10
    },
    imgicon1: {
        height: verticalScale(35),
        width: moderateScale(35),
        position: "absolute",
        top: 5,
        right: 10,
        backgroundColor: 'red',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgicon2: {
        height: verticalScale(20),
        width: moderateScale(20),
        tintColor: 'white',

    }
})

export default ProfilePicker;
