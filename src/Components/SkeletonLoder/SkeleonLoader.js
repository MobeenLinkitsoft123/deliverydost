import { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "../../styles/responsiveSize";
import colors from "../../styles/colors";

const SkeletonLoader = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;
    const inputBg = colors.theme;
    const Bg = { backgroundColor: inputBg };

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.skeletonBox, Bg, { opacity, width: moderateScale(200), height: 15 }]} />
            <View style={styles.separator} />
            <Animated.View style={[styles.skeletonBox, Bg, { opacity, width: moderateScale(150), height: 15 }]} />
            <Animated.View style={[styles.buttonSkeleton, Bg, { opacity }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    skeletonBox: {
        borderRadius: 8,
        margin: 20
    },
    separator: {
        width: "100%",
        height: 1,
        backgroundColor: "black",
    },
    buttonSkeleton: {
        width: "90%",
        height: verticalScale(40),
        borderRadius: 10,
        marginVertical: 30,
        marginHorizontal: 20
    },
});

export default SkeletonLoader;