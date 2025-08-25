import React, { useEffect, useState } from 'react'
import { StyleSheet, Animated, BackHandler } from 'react-native'
import { height, verticalScale, width } from '../../styles/responsiveSize';

const AnimatedModal = ({ children, visible, onClose, HideOnBackDropPress }) => {
    const [opacity] = useState(new Animated.Value(1));
    useEffect(() => {
        if (!visible) {
            const exitAnimation = Animated.timing(opacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            });
            exitAnimation.start(() => {
                onClose();
            });
            return () => {
                exitAnimation.stop();
            };
        }
    }, [visible]);
    useEffect(() => {
        const handleBackPress = () => {
            if (HideOnBackDropPress) {
                onClose();
                return true; // This will prevent the default back button action
            }
            return false; // Let the default back button action happen
        };
        if (HideOnBackDropPress) {
            BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        }
        return () => {
            if (HideOnBackDropPress) {
                BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            }
        };
    }, [HideOnBackDropPress, onClose]);
    return (
        <Animated.View style={[styles.container, { opacity }]}>
            {children}
        </Animated.View>
    )
}
export default AnimatedModal
const styles = StyleSheet.create({
    container: {
        height: height + verticalScale(30),
        width: width,
        position: "absolute",
        backgroundColor: 'rgba(000,000,000,0.6)',
        justifyContent: "center",
        alignItems: "center"
    }
})