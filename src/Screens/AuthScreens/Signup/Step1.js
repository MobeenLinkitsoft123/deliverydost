//import liraries
import React, { useState, useRef } from 'react';
import { Text, KeyboardAvoidingView, View, Image, TextInput, TouchableOpacity, ScrollView, Pressable, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles, whole, text } from "../../../assets/styling/stylesheet";
import LoginStyles from './styles';
import HeaderAuth from '../../../Components/HeaderAuth/HeaderAuth';
import Label from '../../../Components/Label/Label';
import colors from '../../../styles/colors';
import imagePath from '../../../constants/imagePath';
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts';
import ModalPattern1 from '../../../Components/Modals/Modals/ModalPattern1';
import Loader from '../../../Components/Modals/Modals/Loader';
import { CreateAccountStep1 } from '../../../Store/Action/AuthFunctions';
import AnimatedModal from '../../../Components/AnimtedModal/AnimatedModal';
import PhoneInputField from '../../../Components/PhoneInput';
import { PhoneData } from '../../../utils/usData';
import CountryPicker from '../../../Components/CountryPicker';


const Step1 = () => {

    const lastnameRef = useRef();
    const ssnRef = useRef();
    const navigation = useNavigation()
    const phoneRef = useRef();

    const [firstname, setfirstname] = useState()
    const [lastname, setlastname] = useState()
    const [ssnNumber, setssnNumber] = useState('')
    const [gender, setgender] = useState('Male');
    const [showModal, setshowModal] = useState(false);
    const [modalmsg, setmodalmsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [countryCodeISO, setCountryCodeISO] = useState('PK');
    const [phoneNumber, setphoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState(PhoneData)
    const [showCountryPicker, setShowCountryPicker] = useState(false)

    const NEXT = () => {
        Keyboard.dismiss();

        // Step 1: Validate first name
        if (!firstname?.trim()) {
            setmodalmsg('First Name is required');
            setshowModal(true);
            return;
        }

        // Step 2: Validate last name
        if (!lastname?.trim()) {
            setmodalmsg('Last Name is required');
            setshowModal(true);
            return;
        }

        // Step 5: Validate phone number
        if (!phoneNumber?.trim()) {
            setmodalmsg('Phone number is required');
            setshowModal(true);
            return;
        } else if (phoneNumber?.length < 10) {
            setmodalmsg('Please enter complete phone number');
            setshowModal(true);
            return;
        } else if (phoneNumber?.startsWith(0)) {
            setmodalmsg('Please enter correct Phone number');
            setshowModal(true);
            return;
        }

        // If all validations pass, proceed with account creation
        const phoneNumberFinal = `${countryCode ? countryCode?.phone[0].replace('+', '') : "1"}${phoneNumber}`;

        const OnSuccess = () => {
            const data = {
                type: 'signup',
                firstname: firstname?.trim(),
                lastname: lastname?.trim(),
                phoneNumber: phoneNumberFinal,
                gender: gender,
            };
            navigation.navigate('otpVerification', { ...data });
        };

        CreateAccountStep1(setLoading, firstname, lastname, phoneNumberFinal, ssnNumber, setshowModal, setmodalmsg, gender, OnSuccess);
    };


    const handleChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setphoneNumber(numericText);
    };


    return (
        <>
            <View style={LoginStyles.containerMain}>
                <KeyboardAvoidingView behavior='height' enabled style={whole.container} keyboardVerticalOffset={0}>
                    <HeaderAuth label='Become a Driver' />

                    <ScrollView style={{ flex: 1 }} contentContainerStyle={LoginStyles.ScrollContainer} keyboardShouldPersistTaps={'handled'}>

                        <Label label={'Step 1'} fontWeight={'bold'} color={'#000'} marginBottom={10} ResponsiveFonts={ResponsiveFonts.textualStyles.xlarge} marginTop={40} />
                        <Label label={'Please fill your basic details'} color={"#888"} marginBottom={10} ResponsiveFonts={ResponsiveFonts.textualStyles.medium} />

                        <View style={LoginStyles.container}>
                            <Label ResponsiveFonts={ResponsiveFonts.textualStyles.medium} label={'First Name*'} color={"#d33d3f"} alignSelf={'flex-start'} marginLeft={10} />
                            <TextInput
                                blurOnSubmit={false}
                                returnKeyType={"next"}
                                onSubmitEditing={() => lastnameRef.current.focus()}
                                style={[text.Inputtxtlighter, ResponsiveFonts.textualStyles.TextInputFonts]}
                                maxLength={30}
                                placeholder='First Name'
                                placeholderTextColor='#888'
                                onChangeText={(text) => setfirstname(text)}
                                value={firstname}
                            />
                            <Label ResponsiveFonts={ResponsiveFonts.textualStyles.medium} label={'Last Name*'} color={"#d33d3f"} alignSelf={'flex-start'} marginLeft={10} marginTop={10} />
                            <TextInput
                                ref={lastnameRef}
                                blurOnSubmit={false}
                                // onSubmitEditing={() => ssnRef.current.focus()}
                                style={[text.Inputtxtlighter, ResponsiveFonts.textualStyles.TextInputFonts]}
                                maxLength={30}
                                placeholder='Last Name'
                                placeholderTextColor='#888'
                                onChangeText={(text) => setlastname(text)}
                                value={lastname}
                            />

                            <Label ResponsiveFonts={ResponsiveFonts.textualStyles.medium} label={'Mobile No*'} color={"#d33d3f"} alignSelf={'flex-start'} marginLeft={10} marginTop={10} />
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
                            />

                            <Label ResponsiveFonts={ResponsiveFonts.textualStyles.medium} label={'Gender'} color={"#d33d3f"} alignSelf={'flex-start'} marginLeft={10} marginTop={10} marginBottom={5} />
                            <View style={[LoginStyles.row, { alignSelf: "flex-start", marginLeft: '8%', width: '80%' }]}>
                                {['Male', 'Female', 'Other'].map((value, index) => {
                                    return (
                                        <Pressable key={index} style={LoginStyles.genderrow} onPress={() => setgender(value)}>
                                            <View style={value == gender ? LoginStyles.circleCheck : LoginStyles.circle} />
                                            <Label label={value} color={colors.black} fontSize={15} fontFamily={'Avenir-Light'} />
                                        </Pressable>
                                    )
                                })}
                            </View>

                            <TouchableOpacity
                                style={[styles.ButtonImportant, { marginTop: "10%" }]}
                                onPress={NEXT}>
                                <Text style={[{ color: "white" }, ResponsiveFonts.textualStyles.medium]}> NEXT </Text>
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
                {showCountryPicker && <CountryPicker onClose={() => setShowCountryPicker(false)} setCountry={setCountryCode} />}
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


export default Step1;
