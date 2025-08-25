import React, { useEffect, useState } from 'react'
import { StyleSheet, Modal, View, Linking, TouchableOpacity, Image } from 'react-native'
import { moderateScale, moderateScaleVertical, width } from '../../../styles/responsiveSize';
import colors from '../../../styles/colors';
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts';
import TextLabel from '../../TextLabel/TextLable';


const MapModals = ({ setValue, latitude, longitude, value }) => {

    const latLng = `${latitude},${longitude}`;

    const [GoogleMapActive, setGoogleMapActive] = useState(false);
    const [AppleMapActive, setAppleMapActive] = useState(false);
    const [CityMapperActive, setCityMapperActive] = useState(false);
    const [WazeActive, setWazeActive] = useState(false);


    const CityMapperUrl = `citymapper://directions?endcoord=${latitude},${longitude}`
    const GoogleMapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    const WazeMapUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`
    const label = "Foodosti";

    useEffect(() => {
        Linking.canOpenURL(GoogleMapUrl).then((e) => {
            setGoogleMapActive(e)
        }).catch((e) => {
            setGoogleMapActive(false)
        });

        Linking.canOpenURL(`maps:0,0?q=${label}@${latLng}`).then((e) => {
            setAppleMapActive(e)
        }).catch((e) => {
            setAppleMapActive(false);
        });

        Linking.canOpenURL(CityMapperUrl).then((e) => {
            setCityMapperActive(e)
        }).catch((e) => {
            setCityMapperActive(false);
        })
        Linking.canOpenURL(WazeMapUrl).then((e) => {
            setWazeActive(e)
        }).catch((e) => {
            setWazeActive(false);
        })

    }, []);



    return (
        <Modal animationType='slide' visible={value} transparent onRequestClose={() => setValue(false)}>
            <TouchableOpacity onPress={() => setValue(false)} style={{ flex: 1 }}>
                <View style={styles.modalIos}>

                    <View style={styles.OptionContainer}>
                        {GoogleMapActive && (
                            <TouchableOpacity onPress={() => {
                                setValue(false)
                                Linking.openURL(GoogleMapUrl)

                            }} style={{ marginRight: '3%' }} >
                                <Image source={require('../../../assets/images/google-maps.png')} style={styles.Icon} />
                            </TouchableOpacity>
                        )}
                        {AppleMapActive && (
                            <TouchableOpacity onPress={() => {
                                setValue(false)
                                Linking.openURL(`maps:0,0?q=${label}@${latLng}`)
                            }} style={{ marginRight: '3%' }} >
                                <Image source={require('../../../assets/images/apple-maps.png')} style={styles.Icon} />
                            </TouchableOpacity>
                        )}
                        {WazeActive && (
                            <TouchableOpacity onPress={() => {
                                setValue(false)
                                Linking.openURL(WazeMapUrl)
                            }} style={{ marginRight: '3%' }} >
                                <Image source={require('../../../assets/images/wazemapper.png')} style={styles.Icon} />
                            </TouchableOpacity>
                        )}
                        {CityMapperActive && (
                            <TouchableOpacity onPress={() => {
                                setValue(false)
                                Linking.openURL(CityMapperUrl)
                            }} style={{ marginRight: '3%' }} >
                                <Image source={require('../../../assets/images/Cittymapper.png')} style={styles.Icon} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={() => setValue(false)}
                        style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            marginBottom: moderateScale(10),
                        }}>
                        <TextLabel label={'Cancel'} color={colors.black} ResponsiveFonts={ResponsiveFonts.textualStyles.large} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

export default MapModals


const styles = StyleSheet.create({
    container: {
        width: '90%',
        alignSelf: "center",
        // height: '75%',
        overflow: 'hidden',
        marginTop: moderateScale(20)

    },
    ImageBackground: {
        height: '55%',
        width: '100%',
    },
    sampleDetails: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: 15,
        // height: verticalScale(300),
        // position: "absolute",
        bottom: width * 0.05,
        padding: 15
    },
    arrowback: {
        height: moderateScale(38),
        width: moderateScale(38),
        marginLeft: moderateScale(10),
        // marginBottom: verticalScale(10),

        marginTop: -moderateScaleVertical(27)
    },
    modalIos: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: colors.white,
        paddingVertical: 10,
        borderTopWidth: 1,
    },
    mapOptionsText: {
        // fontFamily:  ResponsiveFonts.textualStyles.largeBold,
        color: colors.black,
    },
    mapOptionsText1: {
        // fontFamily: ResponsiveFonts.textualStyles.xlargeBold,
        color: colors.white
    },
    Icon: {
        height: moderateScale(65),
        width: moderateScale(65),
        borderRadius: 15
    },
    OptionContainer: {
        width: "95%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center',
        alignSelf: "center",
        marginBottom: 20,
        marginTop: 10,
        alignItems: "center",
        alignContent: "center",
        paddingLeft: 10,

    }
})



