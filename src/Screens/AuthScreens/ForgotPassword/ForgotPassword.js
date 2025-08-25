import React, { useRef, useState } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard, Alert, Platform, } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { styles, whole } from "../../../assets/styling/stylesheet";
import OtpStyles from "./styles";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import imagePath from "../../../constants/imagePath";
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts'
import { CheckPhoneNumber } from "../../../Store/Action/AuthFunctions";
import ModalPattern1 from '../../../Components/Modals/Modals/ModalPattern1';
import Loader from '../../../Components/Modals/Modals/Loader';
import AnimatedModal from "../../../Components/AnimtedModal/AnimatedModal";
import PhoneInputField from "../../../Components/PhoneInput";
import { PhoneData } from "../../../utils/usData";
import CountryPicker from "../../../Components/CountryPicker";


const OtpVerification = () => {

    const navigation = useNavigation();
    const RouteState = useRoute();
    const keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 0;
    const phoneRef = useRef()

    const [showModal, setshowModal] = useState(false);
    const [modalmsg, setmodalmsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [countryCodeISO, setCountryCodeISO] = useState('PK');
    const [phoneNumber, setphoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState(PhoneData)
    const [showCountryPicker, setShowCountryPicker] = useState(false)


    const navigate = (UserId) => {
        const phoneNumberFinal = `${countryCode ? countryCode?.phone[0].replace('+', '') : "1"}${phoneNumber}`;

        navigation.navigate('otpVerification',
            {
                type: RouteState?.params?.type,
                phoneNumber: phoneNumberFinal,
                UserId: UserId || ''
            });

    }

    const SendOTP = () => {
        Keyboard.dismiss();

        if (phoneNumber?.length != undefined && phoneNumber?.length > 0) {
            const phoneNumberFinal = `${countryCode ? countryCode?.phone[0].replace('+', '') : "1"}${phoneNumber}`;
            if (phoneNumber?.length < 10) {
                setmodalmsg('Please enter complete phone number');
                setshowModal(true);
            } else if (phoneNumber?.startsWith(0)) {
                setmodalmsg('Please enter correct Phone number');
                setshowModal(true);
            } else {
                CheckPhoneNumber(phoneNumberFinal, navigate, setLoading, setshowModal, setmodalmsg, RouteState?.params?.type)
            }
        } else {
            setLoading(false);
            if (setshowModal && setmodalmsg) {
                setmodalmsg('Phone number is required');
                setshowModal(true);
            } else {
                Alert.alert('Alert', 'Phone number is required');
            }
        }
    }

    const handleChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setphoneNumber(numericText);
    };


    return (
        <>
            <KeyboardAvoidingView behavior="height" style={whole.container} keyboardVerticalOffset={keyboardVerticalOffset} >

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>

                    <View style={[whole.alignitemcentervert, { height: "100%" }]}>

                        <View style={OtpStyles.rowHeader}>
                            <Pressable onPress={() => navigation.goBack()} style={OtpStyles.circle}>
                                <Image style={OtpStyles.HeaderImage2}
                                    resizeMethod="resize"
                                    resizeMode="contain"
                                    source={imagePath.BackCircle} />
                            </Pressable>
                            <Image style={OtpStyles.HeaderImage}
                                resizeMethod="resize"
                                resizeMode="contain"
                                source={imagePath.Header2Circle} />
                        </View>

                        <Text style={[whole.cardEmphasis, { color: "#000" }, ResponsiveFonts.textualStyles.large]}>
                            FORGOT PASSWORD
                        </Text>
                        <Text style={[whole.cardSubEmphasis, { padding: 10, textAlign: "center", color: "#888" }, ResponsiveFonts.textualStyles.smallBold]}>
                            Please enter your phone number for verification
                        </Text>
                        <Text style={[whole.cardSubEmphasis, ResponsiveFonts.textualStyles.smallBold, { padding: 10, textAlign: "center", color: "#888", marginTop: -20 },]}>
                            {RouteState?.params?.Phone}
                        </Text>

                        {/* <PhoneInput
                            style={OtpStyles.Phone}
                            updateCodeISO={(countryCodeISO) => { }
                            }
                            CodeISO={"US"}
                            value={phone}
                            onChange={(mobile) => setphone(mobile)}
                        /> */}

                        <PhoneInputField
                            updateCodeISO={countryCodeISO => setCountryCodeISO(countryCodeISO)}
                            CodeISO={countryCodeISO}
                            value={phoneNumber}
                            onChange={handleChange}
                            reff={phoneRef}
                            countryCode={countryCode}
                            setCountryCode={setCountryCode}
                            onSubmitEditing={() => { }}
                            showCountryPicker={setShowCountryPicker}
                            width={'70%'}
                        />

                        <TouchableOpacity
                            style={[styles.ButtonImportant, { marginTop: 20 }]}
                            onPress={() => SendOTP()}>
                            <Text style={[{ color: "white" }, ResponsiveFonts.textualStyles.medium]}> NEXT </Text>
                        </TouchableOpacity>

                    </View>

                    <Image
                        style={OtpStyles.img1}
                        resizeMethod="resize"
                        resizeMode="contain"
                        source={imagePath.BagIcon}
                    />

                    <Image
                        style={OtpStyles.img2}
                        resizeMethod="resize"
                        resizeMode="stretch"
                        source={imagePath.FooterDesginImage}
                    />
                </ScrollView>


            </KeyboardAvoidingView>


            {showModal && (
                <AnimatedModal visible={showModal} onClose={() => { setshowModal(false) }} >
                    <ModalPattern1
                        setValue={setshowModal}
                        heading={modalmsg}
                        btnTittle={'Okay'}
                        OnPress={() => {
                            setmodalmsg('')
                            setshowModal(false);
                        }} />
                </AnimatedModal>
            )}
            {showCountryPicker && <CountryPicker onClose={() => setShowCountryPicker(false)} setCountry={setCountryCode} />}
            {loading && (
                <AnimatedModal visible={loading} onClose={() => { setLoading(false) }} >
                    <Loader />
                </AnimatedModal>
            )}

        </>
    );
};


export default OtpVerification;
