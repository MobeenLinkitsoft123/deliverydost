import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, ScrollView, Linking, Image } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import StylesReport from "./Styles";
import HeaderAuth from "../../../Components/HeaderAuth/HeaderAuth";
import { whole } from "../../../assets/styling/stylesheet";
import colors from "../../../styles/colors";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import Loader from "../../../Components/Modals/Modals/Loader";
import { GetSupport, SumbitanIssues } from "../../../Store/Action/AppFunctions";
import ModalPattern1 from "../../../Components/Modals/Modals/ModalPattern1";
import { useIsFocused } from "@react-navigation/native";
import styles from "./Styles";
import imagePath from "../../../constants/imagePath";
import AnimatedModal from "../../../Components/AnimtedModal/AnimatedModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { returnUserDetailData } from "../../../utils/helperFunctions";

function Report() {
  const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);

  const userDetailDecrypted = returnUserDetailData(UserDetail);

  const [issue, Setissue] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalMsg, setmodalmsg] = useState("");
  const [errorModal, seterrorModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const IsFocus = useIsFocused();
  const navigation = useNavigation()

  useEffect(() => {
    IsFocus && GetSupport(setPhoneNumber, setLoading)
  }, [IsFocus])

  return (
    <>
      <View style={StylesReport.container}>
        <HeaderAuth label={"HELP/SUPPORT"} />

        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={StylesReport.container2}>
            <Text style={[StylesReport.textwarn, ResponsiveFonts.textualStyles.microBold]}>
              {`(${issue?.length} / 500)`}
            </Text>
            <TextInput
              value={issue}
              style={[StylesReport.TextArea, ResponsiveFonts.textualStyles.TextInputFonts, styles.mihmax]}
              placeholder={"We are here to support you , please write down your issue here..."}
              placeholderTextColor={colors.black}
              textAlignVertical={"top"}
              maxLength={500}
              multiline={true}
              onChangeText={(e) => Setissue(e)}
            />

            <TouchableOpacity
              style={StylesReport.btn}
              onPress={() =>
                SumbitanIssues(
                  setLoading,
                  userDetailDecrypted,
                  issue,
                  Setissue,
                  TokenId,
                  setmodalmsg,
                  seterrorModal
                )
              }
            >
              <Text style={[whole.cardEmphasis, StylesReport.textsignup3, ResponsiveFonts.textualStyles.medium]}>
                SUBMIT
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.con} />
          <View style={styles.con1}>
            <View style={styles.imgCon}>
              <Image source={imagePath.InfoIcon} resizeMode='contain' style={styles.img} />
            </View>
            <Text style={[styles.text1, ResponsiveFonts.textualStyles.smallBold]}>
              {`We're here for you! Call us between ${phoneNumber?.content} Eastern Standard Time or email us anytime at ${phoneNumber?.email} for 24/7 support.`}
            </Text>
          </View>
          <View style={styles.callMsgCon}>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${phoneNumber?.number ? phoneNumber?.number : ''}`)}
              style={styles.phoneCallCon}>
              <View style={styles.imgCon1}>
                <Image source={imagePath.phone} resizeMode='contain' style={styles.img1} />
              </View>
              <Text style={[styles.text2, ResponsiveFonts.textualStyles.smallBold]}>
                Call
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${phoneNumber?.email ? phoneNumber?.email : ''}`)} style={styles.con3}>
              <View style={styles.imgCon1}>
                <Image source={imagePath.email} resizeMode='contain' style={styles.img1} />
              </View>
              <Text style={[styles.text2, ResponsiveFonts.textualStyles.smallBold]}>
                Email
              </Text>
            </TouchableOpacity>

          </View>
        </KeyboardAwareScrollView>


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
              if (modalMsg == "Success. We have received your request.Our help desk team will respond as quickly as possible.") {
                navigation.goBack()
              }
            }}
          />
        </AnimatedModal>
      )}

      {loading && (
        <AnimatedModal visible={loading} onClose={() => { setLoading(false) }} >
          <Loader />
        </AnimatedModal>
      )}
    </>
  );
}

export default Report;
