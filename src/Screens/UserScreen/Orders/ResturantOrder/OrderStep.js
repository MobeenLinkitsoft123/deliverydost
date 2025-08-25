import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { moderateScale, textScale, verticalScale } from "../../../../styles/responsiveSize";
import colors from "../../../../styles/colors";
import { ResponsiveFonts } from "../../../../constants/ResponsiveFonts";
import imagePath from "../../../../constants/imagePath";
import LottieView from "lottie-react-native";

const Triangle = ({ style }) => {
    return <View style={[styles.triangle, style]} />;
};

const Step = ({ stepNumber, label, isActive, isFirst, borderWidth, isCompleted, waiting, isCurrentStep }) => {
    return (
        <View style={[styles.step, { borderLeftWidth: borderWidth ? 1 : 0 }]}>

            {!isFirst && <Triangle style={styles.triangleLeft} />}

            {isCurrentStep ?
                <LottieView
                    source={imagePath.Loader}
                    loop={true}
                    autoPlay={true}
                    style={{ height: verticalScale(25), width: verticalScale(25), marginRight: moderateScale(2), }}
                    speed={1}
                />
                :
                isCompleted ?
                    <Image source={imagePath.CheckIcon} resizeMode={'contain'} style={{ height: verticalScale(25), width: verticalScale(25), marginRight: moderateScale(6), }} />
                    :
                    <Text style={[styles.stepNumber, ResponsiveFonts.textualStyles.largeBold, isActive && styles.active]}>{stepNumber}</Text>
            }

            <Text style={[styles.stepLabel, ResponsiveFonts.textualStyles.micro, isActive && styles.active,]}>{label}</Text>
        </View>
    );
};

const OrderStep = ({ OrderStatus }) => {

    const stepStatuses = {
        step1: ["startride"],
        step2: ["wdispatch"],
        step3: ["startdelivery"],
        step4: ["fnshride"]
    };

    const getStepCompletionStatus = (step) => {
        if (OrderStatus === "startride") {
            return step < 2
        }
        if (OrderStatus === "startride" || OrderStatus === "wdispatch" || OrderStatus === "odispateched") {
            return step < 3
        }
        if (OrderStatus === "startride" || OrderStatus === "wdispatch" || OrderStatus === "startdelivery") {
            return step < 4
        }

        if (OrderStatus === "fnshride") {
            return step < 5;
        }
        return stepStatuses[`step${step}`].includes(OrderStatus);
    };

    const getCurrentActiveStep = (step) => {

        if (OrderStatus == "startride-start" && step == 1) {
            return true
        }
        if ((OrderStatus == "startride" || OrderStatus === "wdispatch") && step == 2) {
            return true
        }
        if ((OrderStatus == "odispateched" || OrderStatus == "startdelivery") && step == 3) {
            return true
        }

        if ((OrderStatus === "fnshride") && step == 4) {
            return true
        }

        return false
    }

    return (
        <View style={styles.container}>
            <Step stepNumber="1" label="Start" isActive isFirst isCompleted={getStepCompletionStatus(1)} isCurrentStep={getCurrentActiveStep(1)} />
            <Step stepNumber="2" label="Pickup" isActive borderWidth waiting={OrderStatus} isCompleted={getStepCompletionStatus(2)} isCurrentStep={getCurrentActiveStep(2)} />
            <Step stepNumber="3" label="Drop Off" borderWidth isCompleted={getStepCompletionStatus(3)} isCurrentStep={getCurrentActiveStep(3)} />
            <Step stepNumber="4" label="Finish" isLast borderWidth isCompleted={getStepCompletionStatus(4)} isCurrentStep={getCurrentActiveStep(4)} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "95%",
        alignSelf: "center",
        marginTop: verticalScale(20),
        borderWidth: 1,
        borderColor: colors.blackOpacity25,
        overflow: "hidden",
        borderRadius: 5
    },
    step: {
        width: "25%",
        height: verticalScale(50),
        borderRadius: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderColor: colors.blackOpacity25,
    },
    triangle: {
        width: verticalScale(18),
        height: verticalScale(18),
        backgroundColor: "#fff",
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderColor: colors.blackOpacity25,
        position: "absolute",
    },
    triangleLeft: {
        transform: [{ rotate: "134deg" }],
        left: -moderateScale(8),
    },
    stepNumber: {
        fontWeight: "bold",
        fontSize: textScale(14),
        color: colors.gray,
        marginRight: moderateScale(8),
    },
    stepLabel: {
        fontSize: textScale(10),
        color: colors.gray,
    },
    active: {
        color: "black",
    },
});

export default OrderStep;
