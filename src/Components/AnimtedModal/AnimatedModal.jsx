import React, { useEffect, useState } from 'react'
import { StyleSheet, Animated } from 'react-native'
import { height, verticalScale, width} from '../../styles/responsiveSize';

const AnimatedModal = ({ children, visible, onClose }) => {

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