import { Modal, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { height, moderateScale, moderateScaleVertical, verticalScale, width } from '../../styles/responsiveSize'
import colors from '../../styles/colors'
import imagePath from '../../constants/imagePath'
import Pdf from "react-native-pdf";

const PdfViewModal = ({ showPdfFull, setShowPdfFull, source }) => {
    return (
        <Modal
            visible={showPdfFull}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowPdfFull(false)}
        >
            <View style={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0,0, 0.5)'
            }}>
                <View style={styles.container}>
                    <Pdf
                        trustAllCerts={false}
                        source={{
                            uri: source,
                            cache: true,
                        }}
                        onLoadComplete={(numberOfPages, filePath) => {

                        }}
                        onPageChanged={(page, numberOfPages) => {

                        }}
                        onError={error => {
                            console.log(error);
                        }}
                        onPressLink={uri => {

                        }}
                        style={{ height: '100%', width: '100%' }}
                    />
                    <TouchableOpacity onPress={() => setShowPdfFull(false)} style={styles.CrossIconCross}>
                        <Image source={imagePath?.closeIcon} style={styles.crossIcon} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default PdfViewModal

const styles = StyleSheet.create({
    container: {
        height: height / 1.2,
        width: '90%',
        backgroundColor: colors.white,
        borderRadius: 10,
        alignSelf: "center",
        padding: moderateScaleVertical(10),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    crossIcon: {
        height: '60%',
        width: '60%',
        tintColor: colors.white
    },
    CrossIconCross: {
        height: verticalScale(50),
        width: moderateScale(50),
        backgroundColor: colors.theme,
        position: "absolute",
        top: -15,
        right: -15,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: moderateScaleVertical(25)
    }
})