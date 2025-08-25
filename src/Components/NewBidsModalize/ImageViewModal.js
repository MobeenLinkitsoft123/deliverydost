import { Modal, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { height, width } from '../../styles/responsiveSize'
import colors from '../../styles/colors'
import imagePath from '../../constants/imagePath'
import FastImage from 'react-native-fast-image'
import Pdf from 'react-native-pdf'

const ImageViewModal = ({ showImageFull, setShowImageFull, showImageFullPath }) => {
    const imageUrl = {
        uri: showImageFullPath.uri?showImageFullPath?.uri:showImageFullPath,
        priority: FastImage.priority.high,
    }
    
    return (
        <Modal
            visible={showImageFull}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowImageFull(false)}
        >
            <View style={styles.modalImgCon}>
                <View style={styles.modalImgCon1}>
                    
                    {showImageFullPath?.name?<Pdf
                        trustAllCerts={false}
                        source={{
                            uri: showImageFullPath?.fileCopyUri,
                            cache: false,
                        }}
                        onLoadProgress={(percent) => {
                            // setTimeout(() => {
                            //     setShowClose(true)
                            // }, 5000)
                        }}
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`Number of pages`);
                            // setShowClose(true)
                        }}
                        onPageChanged={(page, numberOfPages) => {
                        }}
                        onError={error => {
                            console.log(error);
                        }}
                        onPressLink={uri => {
                        }}
                        style={{ height: '100%', width: '100%' }}
                    />:(
                        <>
                        <ActivityIndicator size={'large'} color={colors.theme} style={styles.loaderContainer} />
                    <FastImage style={styles.modalImgCon2} source={imageUrl} resizeMode={FastImage.resizeMode.contain} />
                        </>
                    )}
                </View>
                <TouchableOpacity onPress={() => setShowImageFull(false)} style={styles.modalImgCon3}>
                    <Image source={imagePath?.closeIcon} style={styles.modalImgCon4} />
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default ImageViewModal

const styles = StyleSheet.create({
    modalImgCon: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    modalImgCon1: {
        height: height,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blackOpacity70
    },
    modalImgCon2: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',

    },
    modalImgCon3: {
        height: width * 0.10,
        width: width * 0.10,
        position: 'absolute',
        top: width * 0.1,
        right: width * 0.05,
        backgroundColor: colors.theme,
        borderRadius: 100,
        padding: 4
    },
    modalImgCon4: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
        tintColor: colors.white
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
})