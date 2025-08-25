import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

import { ResponsiveFonts } from '../../../constants/ResponsiveFonts'
import HeaderAuth from '../../../Components/HeaderAuth/HeaderAuth'
import colors from '../../../styles/colors'
import Label from '../../../Components/Label/Label'
import styles from './styles'
import { GET_METHOD } from '../../../utils/ApiCallingMachnisem'
import { moderateScale } from '../../../styles/responsiveSize'
import PolicyText from '../../../Components/PrivacyPolicy/PrivacyText'
import ModalPattern1 from '../../../Components/Modals/Modals/ModalPattern1'
import { LogOut } from '../../../Store/Reducers/AuthReducer/AuthReducer'
import Loader from '../../../Components/Modals/Modals/Loader'
import { DeleteAcc } from '../../../Store/Action/AuthFunctions'
import imagePath from '../../../constants/imagePath'
import AnimatedModal from '../../../Components/Modals/AnimatedModal'
import { returnUserDetailData } from '../../../utils/helperFunctions'
import { PaymentUpdate } from '../../../Components/PaymentView/PaymentView'
import { deleteTokenFCM } from '../../../services/NotificationServices/notificationHelper'

const Profile = () => {
    const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);

    const userDetailDecrypted = returnUserDetailData(UserDetail);

    const [radius, setRadius] = useState(0)
    const [errorModal, seterrorModal] = useState(false);
    const [errorModal1, seterrorModal1] = useState(false);
    const [modalMsg, setmodalmsg] = useState("");
    const [isBusy, setIsBusy] = useState(false);
    const isFocus = useIsFocused()
    const dispatch = useDispatch()
    const GetRadius = async () => {
        try {
            const radiusResponse = await GET_METHOD("api/DMSRiderAcc");
            if (radiusResponse && radiusResponse.value) {
                setRadius(radiusResponse.value);
            } else {
            }
        } catch (error) { }
    }
    useEffect(() => {
        GetRadius()

    }, [isFocus])
    const DeleteAccount = () => {
        const OnScuess = () => {
            dispatch(LogOut());
            deleteTokenFCM()
        };
        try {
            DeleteAcc(
                OnScuess,
                TokenId,
                userDetailDecrypted?.Id,
                setmodalmsg,
                seterrorModal,
                seterrorModal1,
                setIsBusy
            )
        } catch (error) {
            setIsBusy(false)
            setmodalmsg("Something went wrong");
            setTimeout(() => {
                seterrorModal(true);

            }, 800);
        }
    }
    return (
        <>
            <SafeAreaView style={styles.container}>
                <HeaderAuth label={'Profile'} />
                <ScrollView contentContainerStyle={styles.cont}>
                    <View style={styles.displayImage}>
                        <ActivityIndicator size={'small'} color={colors.theme} style={{ position: 'absolute' }} />
                        <FastImage style={styles.img} resizeMode={FastImage.resizeMode.cover}
                            source={userDetailDecrypted?.ProfileImageURL ? { uri: userDetailDecrypted?.ProfileImageURL } : imagePath.uploadprofile} />
                    </View>
                    <View style={styles.upperHeadingCon}>
                        <Label
                            label={`Covered radius is: ${radius} miles`}
                            color={colors.black}
                            textAlign={"center"}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                            marginTop={moderateScale(10)}
                        />
                        <View style={styles.notverf}>
                            {userDetailDecrypted?.isDisabled == 0 ? (
                                <Label
                                    label={userDetailDecrypted?.verificationStatus == 0 ? "Verified" : "Not Verified"}
                                    color={userDetailDecrypted?.verificationStatus == 0 ? colors.white : colors.white}
                                    textAlign={"center"}
                                    ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                                />
                            ) : (
                                <Label
                                    label={"Blocked"}
                                    color={colors.white}
                                    textAlign={"center"}
                                    ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                                />
                            )}
                        </View>
                    </View>
                    <View style={styles.infoCon}>
                        <View style={styles.infoConCenter}>
                            <Label
                                label={'Full Name'}
                                color={colors.black}
                                ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            />
                            <Label
                                label={userDetailDecrypted?.Firstname + " " + userDetailDecrypted?.Lastname}
                                color={colors.black}
                                ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                            />
                        </View>
                        <View style={styles.infoConCenter}>
                            <Label
                                label={'Phone Number'}
                                color={colors.black}
                                ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            />
                            <Label
                                label={userDetailDecrypted?.ContactNum}
                                color={colors.black}
                                ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                            />
                        </View>
                        <View style={styles.infoConCenter}>
                            <Label
                                label={'Email'}
                                color={colors.black}
                                ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            />
                            <Label
                                label={userDetailDecrypted?.Email}
                                color={colors.black}
                                ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                            />
                        </View>
                        <View style={styles.infoConCenter}>
                            <Label
                                label={'Driver type'}
                                color={colors.black}
                                ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            />
                            <Label
                                label={userDetailDecrypted.Type == null ? 'Freelance Driver' : userDetailDecrypted.Type == 0 ? 'Freelance Driver' : 'Hired Driver'}
                                color={colors.black}
                                ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                            />
                        </View>
                        <View style={styles.infoConCenter}>
                            <Label
                                label={'City'}
                                color={colors.black}
                                ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            />
                            <Label
                                label={userDetailDecrypted?.city?.length > 0 ? userDetailDecrypted?.city : 'Allow Location'}
                                color={colors.black}
                                ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                            />
                        </View>

                    </View>
                    <PolicyText />
                    <View style={styles.delBtn}>
                        <Text onPress={() => seterrorModal1(true)} style={[ResponsiveFonts.textualStyles.smallBold, styles.delBtnText]}>
                            Delete Account
                        </Text>
                    </View>
                </ScrollView>
                {/* <PaymentUpdate /> */}
                {isBusy && (
                    <View style={styles.modalBg}>
                        <Loader />
                    </View>
                )}

            </SafeAreaView>

            {errorModal && (
                <AnimatedModal visible={errorModal} onClose={() => { seterrorModal(false) }} >
                    <ModalPattern1
                        setValue={seterrorModal}
                        heading={modalMsg}
                        btnTittle={"Okay"}
                        OnPress={() => {
                            setmodalmsg("");
                            seterrorModal(false);
                        }}
                    />
                </AnimatedModal>
            )}

            {errorModal1 && (
                <AnimatedModal visible={errorModal1} onClose={() => { seterrorModal1(false) }} >
                    <ModalPattern1
                        setValue={seterrorModal1}
                        heading={'Please confirm you want to delete your account.\n\n(By pressing “Yes” your account will be permanently deleted)'}
                        btnTittle={"Yes"}
                        OnPress={() => {
                            DeleteAccount()
                        }}
                        noOp={() => seterrorModal1(false)}
                    />
                </AnimatedModal>
            )}
        </>
    )
}

export default Profile