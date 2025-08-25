import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import colors from '../../styles/colors';

const CustomModalFixed = ({ children, visible, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => onClose && onClose()}>
            <View style={styles.centeredView}>
                {children}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 22,
        backgroundColor: colors.blackOpacity40
    },
});

export default CustomModalFixed;