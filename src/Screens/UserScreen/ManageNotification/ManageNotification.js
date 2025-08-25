import { Switch, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

import styles from './styles'
import HeaderAuth from '../../../Components/HeaderAuth/HeaderAuth'
import colors from '../../../styles/colors'
import Label from '../../../Components/Label/Label'
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts'
import { moderateScale, } from '../../../styles/responsiveSize'
import ModalPattern1 from '../../../Components/Modals/Modals/ModalPattern1'
import Loader from '../../../Components/Modals/Modals/Loader'
import AnimatedModal from '../../../Components/Modals/AnimatedModal'
import { UPDATE_NOTIFICATION_STATUS } from '../../../Store/Action/AppFunctions'
import { returnUserDetailData } from '../../../utils/helperFunctions'

const ManageNotification = () => {

    const TokenId = useSelector((state) => state?.AuthReducer?.TokenId);
    const UserDetail = useSelector((state) => state?.AuthReducer?.UserDetail);

    const userDetailDecrypted = returnUserDetailData(UserDetail);

    const isFocus = useIsFocused()
    const dispatch = useDispatch();

    const [errorModal, seterrorModal] = useState(false);
    const [modalMsg, setmodalmsg] = useState("");
    const [isBusy, setIsBusy] = useState(false);
    const [isAnnouncement, setIsAnnouncement] = useState(userDetailDecrypted?.isSubscribed);
    // const [isSMS, setIsSMS] = useState(userDetailDecrypted?.isMsgSubscribed)


    const toggleSwitchAnn = () => setIsAnnouncement(previousState => !previousState);


    useEffect(() => {
        if (isFocus) {
            setIsAnnouncement(userDetailDecrypted?.isSubscribed);
            // setIsSMS(userDetailDecrypted?.isMsgSubscribed)
        }
    }, [isFocus]);

    const handleStatus = (url, onSuccess, type, value) => {
        UPDATE_NOTIFICATION_STATUS(url, onSuccess, setIsBusy, seterrorModal, setmodalmsg, TokenId, userDetailDecrypted, dispatch, type, value)

    }

    return (
        <View style={styles.container}>
            <HeaderAuth label={'Manage Notification'} />

            <View style={styles.row}>
                <Label
                    label={`Turn On/Off announcements notification`}
                    color={colors.black}
                    ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                />
                <Switch
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    trackColor={{ false: "#f4f3f4", true: "#f4f3f4" }}
                    thumbColor={isAnnouncement ? colors.theme : colors.blackOpacity50}
                    ios_backgroundColor="#f4f3f4"
                    onValueChange={(e) => handleStatus(`api/DMSRiderAcc?rId=${userDetailDecrypted?.Id}&isSubscribe=${e == true ? 1 : 0}`, toggleSwitchAnn, 1, e == true ? 1 : 0)}
                    value={isAnnouncement == 1 || isAnnouncement == true ? true : false}
                />
            </View>

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
            {isBusy && (
                <View style={styles.modalBg}>
                    <Loader />
                </View>
            )}
        </View>

    )
}

export default ManageNotification