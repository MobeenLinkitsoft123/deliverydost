//import liraries
import React, { useState, useRef, useEffect } from 'react';
import { Text, KeyboardAvoidingView, View, Image, TextInput, TouchableOpacity, ScrollView, Pressable, Alert, Keyboard, StyleSheet } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

import { styles, whole, text } from "../../../assets/styling/stylesheet";
import LoginStyles from './styles';
import HeaderAuth from '../../../Components/HeaderAuth/HeaderAuth';
import Label from '../../../Components/Label/Label';
import imagePath from '../../../constants/imagePath';
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts';
import ModalPattern1 from '../../../Components/Modals/Modals/ModalPattern1';
import Loader from '../../../Components/Modals/Modals/Loader';
import { SignUpUser } from '../../../Store/Action/AuthFunctions';
import AnimatedModal from '../../../Components/AnimtedModal/AnimatedModal';
import MaskInput, { Masks } from 'react-native-mask-input';
import { GetLocationAndAddress } from '../../../Store/Action/HelperActions';
import { checkNotificationPermissionStatus } from '../../../services/NotificationServices/notificationHelper';
import { useDispatch } from 'react-redux';


const SSNumberMask = [" ", [/\d/], [/\d/], [/\d/], "-", [/\d/], [/\d/], "-", /\d/, /\d/, /\d/, /\d/];


const Step5 = () => {
    const RouteState = useRoute();
    const ssnRef1 = useRef();
    const IsFocus = useIsFocused()
    const dispatch = useDispatch()

    const [ssnNumber, setssnNumber] = useState('')
    const [confirmssnNumber, setconfirmssnNumber] = useState('')
    const [showModal, setshowModal] = useState(false);
    const [modalmsg, setmodalmsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [addressData, setAddressData] = useState();
    const [token, setToken] = useState("");

    const handledSignUp = () => {

        // Step 3: Validate SSN
        if (!ssnNumber?.trim()) {
            setmodalmsg('Social Security Number is required');
            setshowModal(true);
            return;
        } else if (ssnNumber?.length < 9) {
            setmodalmsg('Please enter a valid Social Security Number');
            setshowModal(true);
            return;
        }

        // Step 4: Validate confirm SSN
        if (!confirmssnNumber?.trim()) {
            setmodalmsg('Please confirm your Social Security Number');
            setshowModal(true);
            return;
        } else if (ssnNumber !== confirmssnNumber) {
            setmodalmsg('SSN and Confirm SSN do not match');
            setshowModal(true);
            return;
        }

        if (addressData) {
            NEXT()
        } else {
            Alert.alert('Info', 'Please allow location permission to access your current location', [
                {
                    text: 'Refresh',
                    onPress: () => {
                        setLoading(true)
                        GetLocationAndAddress(setAddressData, setLoading)
                    },
                    style: 'cancel',
                },
                { text: 'Cancel', onPress: () => { } },
            ]);
        }
    }


    useEffect(() => {
        GetLocationAndAddress(setAddressData, setLoading);
        IsFocus && checkNotificationPermissionStatus(setToken);
    }, [IsFocus]);

    const NEXT = () => {
        Keyboard.dismiss();

        setLoading(true);

        SignUpUser(
            RouteState?.params?.ProfileImageUrl,
            RouteState?.params?.LicenseImageFrontUrl,
            RouteState?.params?.LicenseImageBackUrl,
            RouteState?.params?.InsuranceImageFrontUrl,
            RouteState?.params?.InsuranceImageFrontUrl,
            RouteState?.params?.licenseFrontImageExpiry,
            RouteState?.params?.insuranceFrontImageExpiry,
            RouteState?.params?.RouteData,
            setLoading,
            setmodalmsg,
            setshowModal,
            addressData,
            RouteState?.params?.selectPermission,
            token,
            dispatch
        );

    };


    return (
        <>
            <View style={LoginStyles.containerMain}>
                <KeyboardAvoidingView behavior='height' enabled style={whole.container} keyboardVerticalOffset={0}>
                    <HeaderAuth label='Become a Driver' />

                    <ScrollView style={{ flex: 1 }} contentContainerStyle={LoginStyles.ScrollContainer} keyboardShouldPersistTaps={'handled'}>

                        <Label label={'Step 5'} fontWeight={'bold'} color={'#000'} marginBottom={10} ResponsiveFonts={ResponsiveFonts.textualStyles.xlarge} marginTop={40} />
                        <Label label={'Please enter your Social Security Number (SSN)'} color={"#888"} marginBottom={10} ResponsiveFonts={ResponsiveFonts.textualStyles.medium} />

                        <View style={LoginStyles.container}>

                            <Label ResponsiveFonts={ResponsiveFonts.textualStyles.medium} label={'Social Security Number (SSN)*'} color={"#d33d3f"} alignSelf={'flex-start'} marginLeft={10} marginTop={10} />
                            <MaskInput
                                onSubmitEditing={() => ssnRef1.current.focus()}
                                value={ssnNumber}
                                maxLength={12}
                                mask={SSNumberMask}
                                keyboardType="number-pad"
                                style={[text.Inputtxtlighter, ResponsiveFonts.textualStyles.TextInputFonts]}
                                showObfuscatedValue
                                obfuscationCharacter="*"
                                onChangeText={(masked, unmasked, obfuscated) => {
                                    setssnNumber(unmasked); // you can use the masked value as well

                                }}
                            />


                            <Label ResponsiveFonts={ResponsiveFonts.textualStyles.medium} label={'Confirm Social Security Number (SSN)*'} color={"#d33d3f"} alignSelf={'flex-start'} marginLeft={10} marginTop={10} />
                            <MaskInput
                                ref={ssnRef1}
                                value={confirmssnNumber}
                                mask={SSNumberMask}
                                maxLength={12}
                                keyboardType="number-pad"
                                style={[text.Inputtxtlighter, ResponsiveFonts.textualStyles.TextInputFonts]}
                                showObfuscatedValue
                                obfuscationCharacter="*"
                                onChangeText={(masked, unmasked, obfuscated) => {
                                    setconfirmssnNumber(unmasked); // you can use the masked value as well
                                }}
                            />
                            <View style={[LoginStyles.msg, { marginBottom: 10, }]}>
                                <Image style={LoginStyles.info} source={imagePath.InfoIcon} resizeMode={"contain"} />
                                <Text style={LoginStyles.infoText}>
                                    Your Social Security Number is encrypted and securely stored to protect your privacy.
                                </Text>
                            </View>


                            <TouchableOpacity
                                style={[styles.ButtonImportant, { marginTop: "10%", marginTop: '10%' }]}
                                onPress={handledSignUp}>
                                <Text style={[{ color: "white" }, ResponsiveFonts.textualStyles.medium]}>{" "}Signup{" "}</Text>
                            </TouchableOpacity>

                        </View>

                        <Image
                            style={LoginStyles.bottomIMage}
                            resizeMethod='resize'
                            resizeMode='stretch'
                            source={imagePath.FooterDesginImage}
                        />
                    </ScrollView>

                </KeyboardAvoidingView>
            </View>

            {showModal && (<AnimatedModal visible={showModal} onClose={() => { setshowModal(false) }} >
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

            {loading && (<AnimatedModal visible={loading} onClose={() => { setLoading(false) }} >
                <Loader />
            </AnimatedModal >)}

        </>
    );
};


export default Step5;
