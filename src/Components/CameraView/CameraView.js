import React, { useRef, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import { CameraType, Camera } from 'react-native-camera-kit';
import { moderateScale, width } from '../../styles/responsiveSize';
import colors from '../../styles/colors';
import imagePath from '../../constants/imagePath';

const CameraView = ({ CameraSelect, setCameraModal, index }) => {
    const CameraRef = useRef()
    const [camState, setCamState] = useState(false)
    const [flash, setFlash] = useState(false)
    const [loading, setLoading] = useState(false)

    const captureImg = async () => {
        setLoading(true)
        const name = await CameraRef.current.capture();
        CameraSelect(name, setLoading)
    }

    const flip = () => {
        setFlash(false)
        setCamState(!camState)
    }

    return (
        <>
            <View style={styles.container}>

                <Camera
                    ref={CameraRef}
                    cameraType={camState ? CameraType.Front : CameraType.Back} // front/back(default)
                    style={styles.Camera}
                    torchMode={flash ? 'on' : 'off'}
                />

                <TouchableOpacity activeOpacity={0.5} onPress={() => setCameraModal(false)} style={styles.closeBtn}>
                    <Image source={require('../../assets/images/close.png')} resizeMode="contain" style={styles.closeBtnImg} />
                </TouchableOpacity>

                <View style={styles.bottomCon}>

                    <TouchableOpacity activeOpacity={0.5} onPress={() => setFlash(!flash)} style={styles.flashIcon}>
                        <Image source={flash ? require('../../assets/images/flash.png') : require('../../assets/images/flash-off.png')} resizeMode="contain" style={styles.cameraFlipImg} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.5} onPress={captureImg} style={styles.captureBtn}>
                        <Image source={imagePath.cameraImage} resizeMode="contain" style={styles.captureBtnImg} />
                    </TouchableOpacity>

                    {index == 0 ? <TouchableOpacity activeOpacity={0.5} onPress={flip} style={styles.cameraFlip}>
                        <Image source={imagePath.flip} resizeMode="contain" style={styles.cameraFlipImg} />
                    </TouchableOpacity> : (<View style={styles.khaliCon} />)}

                </View>

                {(camState == true && flash == true && loading) && (
                    <View style={styles.frontFlash} >
                        <View style={styles.frontFlashCon}>
                            <Image source={require('../../assets/images/flash.png')} resizeMode="contain" style={styles.frontFlashImg} />
                        </View>
                    </View>
                )}
            </View>
        </>
    )
}

export default CameraView

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: 'red'
    },
    Camera: {
        height: '100%',
        width: '100%'
    },
    closeBtn: {
        width: width * 0.1,
        height: width * 0.1,
        position: 'absolute',
        right: moderateScale(10),
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        borderRadius: width / 2,
        top: moderateScale(50),
        alignSelf: 'center',
        justifyContent: "center",
        alignItems: "center"
    },
    closeBtnImg: {
        height: '100%',
        width: "100%",
        tintColor: 'white'
    },
    bottomCon: {
        width: '100%',
        position: 'absolute',
        bottom: moderateScale(40),
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingVertical: 10
    },
    captureBtn: {
        width: width * 0.2,
        height: width * 0.2,
        alignSelf: 'center',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: width / 2,
        backgroundColor: colors.theme,
    },
    captureBtnImg: {
        height: 30,
        width: 30,
        tintColor: 'white'
    },
    cameraFlip: {
        width: width * 0.15,
        height: width * 0.15,
        alignSelf: 'center',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: width / 2,
        backgroundColor: 'rgba(128, 128, 128, 0.3)',
        right: moderateScale(10)
    },
    cameraFlipImg: {
        height: 25,
        width: 25,
        tintColor: 'white'
    },
    khaliCon: {
        width: width * 0.15,
        height: width * 0.15,
        alignSelf: 'center',
        justifyContent: "center",
        alignItems: "center",
        right: moderateScale(10)
    },
    frontFlash: {
        height: '100%',
        width: "100%",
        position: 'absolute',
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    frontFlashCon: {
        width: width * 0.15,
        height: width * 0.15
    },
    frontFlashImg: {
        height: '100%',
        width: '100%',
        tintColor: colors.theme
    },
    flashIcon: {
        width: width * 0.15,
        height: width * 0.15,
        alignSelf: 'center',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: width / 2,
        backgroundColor: 'rgba(128, 128, 128, 0.3)',
        left: moderateScale(10)
    }

})