import React, { useState, useRef } from "react";
import { Text, View, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Pressable, Keyboard, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { styles, whole, text } from "../../../assets/styling/stylesheet";
import OtpStyles from "./styles";
import LoginStyles from "../Signup/styles";
import imagePath from "../../../constants/imagePath";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import ModalPattern1 from '../../../Components/Modals/Modals/ModalPattern1';
import Loader from '../../../Components/Modals/Modals/Loader';
import { CreateNewPassword } from "../../../Store/Action/AuthFunctions";
import { useDispatch } from "react-redux";
import { validatePassword } from "../../../utils/helperFunctions";
import AnimatedModal from "../../../Components/AnimtedModal/AnimatedModal";


const CreateNewPasswords = () => {

    const PassRef = useRef();
    const PassRef2 = useRef();
    const keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 0;

    const navigation = useNavigation();
    const RouteState = useRoute()
    const [pass, setpass] = useState('');
    const [pass1, setpass1] = useState('');
    const [showpass, setshowpass] = useState(true);
    const [showpass2, setshowpass2] = useState(true);
    const [SucessModal, setSucessModal] = useState(false);
    const [showModal, setshowModal] = useState(false);
    const [modalmsg, setmodalmsg] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()

    const handleNavigation = () => {
        setTimeout(() => {
            setSucessModal(true)
        }, 600)
    }

    const handleChangeNewPassword = () => {
        Keyboard.dismiss();

        const isPasswordCorrect = validatePassword(pass);
        if (!isPasswordCorrect) {
            setmodalmsg('Password must have an uppercase letter (A-Z), lowercase letter (a-z), numeric digit, and a special character')
            setshowModal(true)
            return false;
        } else {
            CreateNewPassword(RouteState?.params?.data, pass, pass1, handleNavigation, setLoading, setshowModal, setmodalmsg, dispatch)
        }
    }

    return (
        <>
            <KeyboardAvoidingView behavior="height" style={whole.container} keyboardVerticalOffset={keyboardVerticalOffset} >

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>

                    <View style={[{ height: "100%" }]}>

                        <View style={[OtpStyles.rowHeader, { alignSelf: "center" }]}>
                            <Pressable onPress={() => navigation.goBack()} style={OtpStyles.circle}>
                                <Image style={OtpStyles.HeaderImage2}
                                    resizeMethod="resize"
                                    resizeMode="contain"
                                    source={imagePath.BackCircle} />
                            </Pressable>
                            <Image style={[OtpStyles.HeaderImage]}
                                resizeMethod="resize"
                                resizeMode="contain"
                                source={imagePath.Header2Circle} />
                        </View>

                        <View style={[whole.alignitemcentervert, { height: "100%", width: '80%', alignSelf: "center" }]}>

                            <Text style={[whole.cardEmphasis, { color: "#000" }, ResponsiveFonts.textualStyles.large]}>
                                CREATE NEW PASSWORD
                            </Text>

                            <View style={LoginStyles.InputContaoner}>
                                <TextInput
                                    ref={PassRef}
                                    style={[text.Inputtxtlighter, { margin: 0 }, ResponsiveFonts.textualStyles.TextInputFonts]}
                                    placeholder='Password'
                                    placeholderTextColor='#888'
                                    onChangeText={(ptext) => setpass(ptext)}
                                    value={pass}
                                    returnKeyType={"next"}
                                    textContentType='password'
                                    secureTextEntry={showpass}
                                    onSubmitEditing={() => {
                                        PassRef2.current.focus();
                                    }}
                                    autoCapitalize='none'
                                />
                                <TouchableOpacity
                                    style={LoginStyles.eyecontainer}
                                    onPress={() => {
                                        setshowpass(!showpass);
                                    }}>
                                    <Image source={showpass ? imagePath.EyeClose : imagePath.EyeOpen} style={LoginStyles.eye} />
                                </TouchableOpacity>
                            </View>


                            <View style={LoginStyles.InputContaoner}>
                                <TextInput
                                    ref={PassRef2}
                                    style={[text.Inputtxtlighter, { margin: 0 }, ResponsiveFonts.textualStyles.TextInputFonts]}
                                    placeholder='Confirm Password'
                                    placeholderTextColor='#888'
                                    onChangeText={(ptext) => setpass1(ptext)}
                                    value={pass1}
                                    textContentType='password'
                                    secureTextEntry={showpass2}
                                    autoCapitalize='none'
                                />
                                <TouchableOpacity
                                    style={LoginStyles.eyecontainer}
                                    onPress={() => setshowpass2(!showpass2)}>
                                    <Image source={showpass2 ? imagePath.EyeClose : imagePath.EyeOpen} style={LoginStyles.eye} />
                                </TouchableOpacity>
                            </View>

                            <View style={[LoginStyles.msg, { marginBottom: 10 }]}>
                                <Image
                                    style={LoginStyles.info}
                                    source={imagePath.InfoIcon}
                                    resizeMode={"contain"}
                                />
                                <Text style={LoginStyles.infoText}>
                                    Password must have an uppercase letter (A-Z), lowercase letter (a-z), numeric digit, and a special character
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.ButtonImportant, { marginTop: 20 }]}
                                onPress={handleChangeNewPassword}>
                                <Text style={[{ color: "white" }, ResponsiveFonts.textualStyles.smallBlodBlack]}> Confirm </Text>
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

                    </View>

                </ScrollView>

            </KeyboardAvoidingView>

            {SucessModal && (
                <AnimatedModal visible={SucessModal} onClose={() => { setSucessModal(false) }} >
                    <ModalPattern1
                        setValue={setSucessModal}
                        heading={'Password Reset Successfully'}
                        msg={'You have successfully reset your password. Please use your new password when signing in.'}
                        btnTittle={'Sign in'}
                        OnPress={() => navigation.navigate("login")} />
                </AnimatedModal>
            )}

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

            {loading && (
                <AnimatedModal visible={loading} onClose={() => { setLoading(false) }} >
                    <Loader />
                </AnimatedModal>
            )}
        </>
    );
};


export default CreateNewPasswords;
