import React, { useEffect, useState } from "react";
import { Text, View, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackgroundTimer from 'react-native-background-timer';

import { styles, whole } from "../../../assets/styling/stylesheet";
import OtpStyles from "./styles";
import imagePath from "../../../constants/imagePath";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import { CheckPhoneNumber, VerifyOtp } from "../../../Store/Action/AuthFunctions";
import ModalPattern1 from '../../../Components/Modals/Modals/ModalPattern1';
import Loader from '../../../Components/Modals/Modals/Loader';
import Label from "../../../Components/Label/Label";
import AnimatedModal from "../../../Components/AnimtedModal/AnimatedModal";

const OtpVerification = () => {

    const navigation = useNavigation();
    const RouteState = useRoute();

    const [otp, setotp] = useState('');
    const [intervalSeconds, setIntervalSeconds] = useState(60);
    const [intervalID, setIntervalID] = useState(0);
    const [showModal, setshowModal] = useState(false);
    const [modalmsg, setmodalmsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [keyBoardIsOpen, setkeyBoardIsOpen] = useState(false)

    const checkKeyboard = () => {
        const keyboardShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setkeyBoardIsOpen(true)
            }
        );
        const keyboardHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setkeyBoardIsOpen(false)
            }
        );

    }

    const handleNavigation = () => {
        if (RouteState?.params?.type == 'signup') {
            navigation.navigate('SignupStep2', { data: RouteState?.params })
        }
        else {
            navigation.navigate('CreateNewPassword', { data: RouteState?.params })
        }
    }

    const startTimer = () => {
        const intervalId = BackgroundTimer.setInterval(() => {
            setIntervalSeconds((previousValue) => {
                return previousValue - 1;
            });
        }, 1000);
        setIntervalID(intervalId);
    };

    const resendOTP = async () => {
        Keyboard.dismiss();
        setotp()
        const navigate = () => { };
        CheckPhoneNumber(RouteState?.params?.phoneNumber, navigate, setLoading, setshowModal, setmodalmsg, RouteState?.params?.type)
        setIntervalSeconds(60);
    };

    const validateOtp = () => {
        // Check if OTP is 6 digits
        if (!otp || otp.length !== 6) {
            setshowModal(true)
            setmodalmsg('Please enter a valid 6-digit OTP.');
            return false;
        }
        return true;
    };

    const handleVerifyOtp = () => {
        // Perform validation before OTP verification
        if (validateOtp()) {
            VerifyOtp(RouteState?.params?.phoneNumber, otp, handleNavigation, setLoading, setshowModal, setmodalmsg, setotp);
        }
    };

    useEffect(() => {
        checkKeyboard()
    }, []);

    useEffect(() => {
        startTimer();
        return () => {
            if (intervalID) {
                BackgroundTimer.clearInterval(intervalID);
            }
        };
    }, []);

    const handleChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setotp(numericText);
    };



    return (
        <>
            <KeyboardAvoidingView behavior="height" style={whole.container} keyboardVerticalOffset={0} >
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>

                    <View style={[whole.alignitemcentervert, { height: "100%" }]}>

                        <View style={OtpStyles.rowHeader}>
                            <Pressable onPress={() => navigation.goBack()} style={OtpStyles.circle}>
                                <Image style={OtpStyles.HeaderImage2} resizeMethod="resize" resizeMode="contain" source={imagePath.BackCircle} />
                            </Pressable>
                            <Image style={OtpStyles.HeaderImage} resizeMethod="resize" resizeMode="contain" source={imagePath.Header2Circle} />
                        </View>

                        {RouteState?.params?.type == 'signup' && <Label label={'Step 2'} fontWeight={'bold'} color={'#000'} marginBottom={10} ResponsiveFonts={ResponsiveFonts.textualStyles.xlarge} />}

                        <Text style={[whole.cardEmphasis, { color: "#000" }, ResponsiveFonts.textualStyles.large]}>
                            SECURITY CODE
                        </Text>
                        <Text style={[whole.cardSubEmphasis, { padding: 10, textAlign: "center", color: "#888" }, ResponsiveFonts.textualStyles.smallBold]}>
                            Enter 6-digit code that has been sent to
                        </Text>
                        <Text style={[whole.cardSubEmphasis, { padding: 10, textAlign: "center", color: "#888", marginTop: -20 }, ResponsiveFonts.textualStyles.smallBold]}>
                            +{RouteState?.params?.phoneNumber}
                        </Text>

                        <View style={OtpStyles.InputView}>
                            <TextInput
                                placeholder="000000"
                                keyboardType="numeric"
                                onChangeText={handleChange}
                                maxLength={6}
                                style={[OtpStyles.OtpInput, ResponsiveFonts.textualStyles.TextInputFonts,]}
                                placeholderTextColor="#888"
                                value={otp}
                            />
                        </View>

                        <TouchableOpacity style={[styles.ButtonImportant, { marginTop: 20 }]}
                            onPress={handleVerifyOtp}>
                            <Text style={[{ color: "white" }, ResponsiveFonts.textualStyles.medium]}> Verify </Text>
                        </TouchableOpacity>

                        <View style={styles.resendOTPView}>
                            <Text style={[styles.notReceivedOTPText, ResponsiveFonts.textualStyles.small]}>
                                Didn't received the OTP?
                            </Text>
                            {intervalSeconds > 0 ?
                                <Text style={[styles.notReceivedOTPText, ResponsiveFonts.textualStyles.small]}>
                                    {' Wait ' + intervalSeconds + ' seconds'}
                                </Text>
                                :
                                <TouchableOpacity style={styles.resendTouchableOpacity} onPress={() => resendOTP()} disabled={intervalSeconds > 1}>
                                    <Text style={[styles.resendOTPText, ResponsiveFonts.textualStyles.small]}>
                                        {" Resend OTP"}
                                    </Text>
                                </TouchableOpacity>
                            }
                        </View>

                    </View>

                    {keyBoardIsOpen == false && <>
                        <Image style={OtpStyles.img1} resizeMethod="resize" resizeMode="contain" source={imagePath.BagIcon} />
                        <Image style={OtpStyles.img2} resizeMethod="resize" resizeMode="stretch" source={imagePath.FooterDesginImage} />
                    </>}

                </ScrollView>
            </KeyboardAvoidingView>


            {showModal && (
                <AnimatedModal visible={showModal} onClose={() => { setshowModal(false) }} >
                    <ModalPattern1 setValue={setshowModal} heading={modalmsg} btnTittle={'Okay'}
                        OnPress={() => {
                            setmodalmsg('')
                            setshowModal(false);
                        }} />
                </AnimatedModal>
            )}

            {loading && (
                <AnimatedModal visible={loading} onClose={() => { setLoading(false) }} >
                    <Loader />
                </AnimatedModal>
            )}
        </>
    );
};

export default OtpVerification;
