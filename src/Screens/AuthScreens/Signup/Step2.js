import React, { useState, useRef, useEffect } from "react";
import { Text, KeyboardAvoidingView, View, Image, TextInput, TouchableOpacity, ScrollView, Platform, Keyboard } from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";

import { styles, whole, text } from "../../../assets/styling/stylesheet";
import LoginStyles from "./styles";
import HeaderAuth from "../../../Components/HeaderAuth/HeaderAuth";
import Label from "../../../Components/Label/Label";
import imagePath from "../../../constants/imagePath";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import { CreateAccountStep3 } from "../../../Store/Action/AuthFunctions";
import ModalPattern1 from "../../../Components/Modals/Modals/ModalPattern1";
import Loader from "../../../Components/Modals/Modals/Loader";
import { verticalScale } from "../../../styles/responsiveSize";
import AnimatedModal from "../../../Components/AnimtedModal/AnimatedModal";

const Step1 = () => {

  const PassRef = useRef();
  const PassRef2 = useRef();
  const navigation = useNavigation();
  const RouteState = useRoute();
  const IsFocus = useIsFocused()

  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [pass1, setpass1] = useState("");
  const [showpass, setshowpass] = useState(true);
  const [showpass2, setshowpass2] = useState(true);

  const [showModal, setshowModal] = useState(false);
  const [modalmsg, setmodalmsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (IsFocus == true) {
      setLoading(false);
      setTimeout(() => {
        setmodalmsg("Please ensure you enter your registered PayPal email to sign up. If you don't have a PayPal account, please sign up first, as your earnings will be deposited there.");
        setshowModal(true)
      }, 600)
    }
  }, [IsFocus])

  let RouteData = {
    email: email?.trim(),
    pass,
    ...RouteState?.params?.data,
  };

  const NEXT = () => {
    Keyboard.dismiss();

    CreateAccountStep3(
      navigation,
      email?.trim(),
      pass,
      pass1,
      setshowModal,
      setmodalmsg,
      RouteData,
      setLoading
    );
  };


  return (
    <>
      <View style={LoginStyles.containerMain}>
        <KeyboardAvoidingView behavior="height" enabled style={whole.container} keyboardVerticalOffset={0}>
          <HeaderAuth label="Become a Driver" />

          <ScrollView style={{ flex: 1 }} contentContainerStyle={LoginStyles.ScrollContainer} keyboardShouldPersistTaps={'handled'}>

            <Label
              label={"Step 3"}
              color={"#000"}
              marginBottom={10}
              ResponsiveFonts={ResponsiveFonts.textualStyles.xlarge}
              marginTop={40}
            />
            <Label
              label={"Setup Your Account"}
              color={"#888"}
              marginBottom={10}
              ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
            />

            <View style={LoginStyles.container1}>
              <Label
                label={"Email Address*"}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                color={"#d33d3f"}
                marginTop={10}
                alignSelf={"flex-start"}
                marginLeft={10}
                marginBottom={7}
              />
              <TextInput
                onChangeText={(text) => setemail(text)}
                value={email}
                style={[
                  text.Inputtxtlighter,
                  { marginBottom: 0 },
                  ResponsiveFonts.textualStyles.TextInputFonts,
                ]}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                returnKeyType={"next"}
                onSubmitEditing={() => PassRef.current.focus()}
                autoCapitalize='none'
                maxLength={40}
              />

              <View style={[LoginStyles.msg, { marginBottom: 10 }]}>
                <Image style={LoginStyles.info} source={imagePath.InfoIcon} resizeMode={"contain"} />
                <Text style={LoginStyles.infoText}>
                  Please input your PayPal email address above, this will be used for payouts and to access your Foodosti Driver account.
                </Text>
              </View>

              <Label
                label={"Password*"}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                color={"#d33d3f"}
                marginTop={10}
                alignSelf={"flex-start"}
                marginLeft={10}
              />
              <View style={LoginStyles.InputContaoner}>
                <TextInput
                  ref={PassRef}
                  style={[text.Inputtxtlighter, ResponsiveFonts.textualStyles.TextInputFonts, { margin: 0 }]}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  onChangeText={(ptext) => setpass(ptext)}
                  value={pass}
                  returnKeyType={"next"}
                  secureTextEntry={showpass}
                  onSubmitEditing={() => PassRef2.current.focus()}
                  autoCapitalize='none'
                />
                <TouchableOpacity
                  style={LoginStyles.eyecontainer}
                  onPress={() => setshowpass(!showpass)}>
                  <Image source={showpass ? imagePath.EyeClose : imagePath.EyeOpen} style={LoginStyles.eye}
                  />
                </TouchableOpacity>
              </View>

              <Label
                label={"Confirm Password*"}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                color={"#d33d3f"}
                marginTop={10}
                alignSelf={"flex-start"}
                marginLeft={10}
              />
              <View style={LoginStyles.InputContaoner}>
                <TextInput
                  ref={PassRef2}
                  style={[
                    text.Inputtxtlighter,
                    ResponsiveFonts.textualStyles.TextInputFonts,
                    { margin: 0 },
                  ]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#888"
                  onChangeText={(ptext) => setpass1(ptext)}
                  value={pass1}
                  textContentType="password"
                  secureTextEntry={showpass2}
                  autoCapitalize='none'
                />
                <TouchableOpacity style={LoginStyles.eyecontainer}
                  onPress={() => setshowpass2(!showpass2)}>
                  <Image source={showpass2 ? imagePath.EyeClose : imagePath.EyeOpen} style={LoginStyles.eye} />
                </TouchableOpacity>
              </View>

              <View style={[LoginStyles.msg, { marginBottom: 10 }]}>
                <Image
                  style={[LoginStyles.info, { marginTop: Platform.OS == 'ios' ? verticalScale(5) : verticalScale(15) }]}
                  source={imagePath.InfoIcon}
                  resizeMode={"contain"}
                />
                <Text style={LoginStyles.infoText}>
                  Password must have an uppercase letter (A-Z), lowercase letter(a-z), numeric digit, and a special character
                </Text>
              </View>

              <TouchableOpacity style={[styles.ButtonImportant, { marginTop: "10%" }]} onPress={() => NEXT()}>
                <Text style={[{ color: "white" }, ResponsiveFonts.textualStyles.medium,]}>
                  {" "}NEXT{" "}
                </Text>
              </TouchableOpacity>
            </View>

            <Image style={LoginStyles.bottomIMage} resizeMethod="resize" resizeMode="stretch" source={imagePath.FooterDesginImage} />
          </ScrollView>


        </KeyboardAvoidingView>
      </View>
      {showModal && (<AnimatedModal visible={showModal} onClose={() => { setshowModal(false) }} >
        <ModalPattern1 setValue={setshowModal} heading={modalmsg} btnTittle={"Okay"}
          OnPress={() => {
            setmodalmsg("");
            setshowModal(false);
          }}
        />
      </AnimatedModal>
      )}

      {loading && <AnimatedModal visible={loading} onClose={() => { setLoading(false) }} >
        <Loader />
      </AnimatedModal>
      }
    </>
  );
};

export default Step1;
