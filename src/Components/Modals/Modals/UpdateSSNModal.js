import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import CustomModalFixed from '../CustomModalFixed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts';
import TextLabel from '../../TextLabel/TextLable';
import Label from '../../Label/Label';
import MaskInput from 'react-native-mask-input';
import colors from '../../../styles/colors';
import { useDispatch, useSelector } from 'react-redux';
import { updateSSN } from '../../../Store/Action/AuthFunctions';
import { moderateScale, verticalScale, width } from '../../../styles/responsiveSize';
import AnimatedModal from '../AnimatedModal';
import { returnUserDetailData } from '../../../utils/helperFunctions';

const UpdateSSNModal = ({ updateSSNModal, setUpdateSSNModal }) => {

    const SSNumberMask = [" ", [/\d/], [/\d/], [/\d/], "-", [/\d/], [/\d/], "-", /\d/, /\d/, /\d/, /\d/]
    const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);

    const userDetailDecrypted = returnUserDetailData(UserDetail);

    const dispatch = useDispatch()
    const ssnRef = useRef();
    const ssnRef1 = useRef();
    const [ssnNumber, setssnNumber] = useState('')
    const [confirmssnNumber, setconfirmssnNumber] = useState('')
    const [modalmsg1, setmodalmsg1] = useState('');
    const [loading1, setLoading1] = useState(false);

    // Update SSN NUMBER
    const handleUpdate = () => {
        updateSSN(setLoading1, ssnNumber, TokenId, userDetailDecrypted?.Id, setmodalmsg1, dispatch, confirmssnNumber, setUpdateSSNModal)
    };

    return (
        <AnimatedModal
            visible={updateSSNModal}
            onClose={() => setUpdateSSNModal()}
            HideOnBackDropPress={false}
        >
            <KeyboardAwareScrollView
                nestedScrollEnabled
                style={styles.newCon1}
                contentContainerStyle={styles.keyboardCon}>
                <View style={styles.newCon2}>
                    <TextLabel marginBottom={15} color={colors.theme} ResponsiveFonts={ResponsiveFonts.textualStyles.largeBold} label={"Please enter SSN to continue"} />
                    <Label ResponsiveFonts={ResponsiveFonts.textualStyles.medium} label={'Social Security Number (SSN)*'} color={colors.blackOpacity60} alignSelf={'flex-start'} marginLeft={10} marginTop={10} />
                    <MaskInput
                        ref={ssnRef}
                        onSubmitEditing={() => ssnRef1.current.focus()}
                        value={ssnNumber}
                        maxLength={12}
                        mask={SSNumberMask}
                        keyboardType="number-pad"
                        style={[styles.Inputtxtlighter, ResponsiveFonts.textualStyles.TextInputFonts]}
                        showObfuscatedValue
                        obfuscationCharacter="*"
                        onChangeText={(masked, unmasked, obfuscated) => {
                            setssnNumber(unmasked); // you can use the masked value as well
                        }}
                    />

                    <Label ResponsiveFonts={ResponsiveFonts.textualStyles.medium} label={'Confirm Social Security Number (SSN)*'} color={colors.blackOpacity60} alignSelf={'flex-start'} marginLeft={10} marginTop={10} />
                    <MaskInput
                        ref={ssnRef1}
                        value={confirmssnNumber}
                        mask={SSNumberMask}
                        maxLength={12}
                        keyboardType="number-pad"
                        style={[styles.Inputtxtlighter, ResponsiveFonts.textualStyles.TextInputFonts]}
                        showObfuscatedValue
                        obfuscationCharacter="*"
                        onChangeText={(masked, unmasked, obfuscated) => {
                            setconfirmssnNumber(unmasked); // you can use the masked value as well
                        }}
                    />
                    {modalmsg1.length > 0 &&
                        <TextLabel width={'90%'} marginBottom={10} color={colors.theme} ResponsiveFonts={ResponsiveFonts.textualStyles.microBold} label={modalmsg1} />
                    }
                    <TouchableOpacity
                        onPress={handleUpdate}
                        disabled={loading1}
                        style={styles.newCon3}>
                        {loading1 ? <ActivityIndicator color={colors.white} size={'small'} /> : (
                            <TextLabel color={colors.white} ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold} label={"Submit"} />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </AnimatedModal>
    )
}

export default UpdateSSNModal

const styles = StyleSheet.create({
    Inputtxtlighter: {
        margin: 10,
        elevation: 1,
        zIndex: 1,
        padding: 15,
        textAlign: "left",
        color: "#000",
        fontSize: 12,
        backgroundColor: "#D1D2D3",
        borderRadius: 10,
        width: "90%",
        height: 60
    },
    newCon1: {
        flex: 1,
        width: width,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    newCon2: {
        width: '90%',
        paddingVertical: verticalScale(20),
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    newCon3: {
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.theme,
        paddingVertical: verticalScale(15),
        borderRadius: moderateScale(10)
    },
    keyboardCon: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})