import React, { useState, useRef, useEffect } from "react";
import { Text, View, Image, TextInput, TouchableOpacity, Pressable } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import PolicyText from "../../../Components/PrivacyPolicy/PrivacyText";
import { styles, whole, text } from "../../../assets/styling/stylesheet";
import LoginStyles from "./styles";
import imagePath from "../../../constants/imagePath";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import { Auth_Login } from "../../../Store/Action/AuthFunctions";
import ModalPattern1 from "../../../Components/Modals/Modals/ModalPattern1";
import Loader from "../../../Components/Modals/Modals/Loader";
// import { REQUEST_NOTIFICATION_PERMISSION } from "../../../utils/NotificationServices";
import AnimatedModal from "../../../Components/AnimtedModal/AnimatedModal";
import { checkNotificationPermissionStatus } from "../../../services/NotificationServices/notificationHelper";

const Login = () => {

  const PassRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const IsFocus = useIsFocused();
  const RemamberUser = useSelector((state) => state?.AuthReducer?.RemamberUser);

  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [showpass, setshowpass] = useState(false);

  const [LoginRemember, setLoginRemember] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [modalmsg, setmodalmsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (RemamberUser?.email != undefined && RemamberUser?.email != null) {
      setemail(RemamberUser?.email?.trim());
      setpass(RemamberUser?.password);
      setLoginRemember(true);
    }
    IsFocus && checkNotificationPermissionStatus(setToken);
    // REQUEST_NOTIFICATION_PERMISSION(setToken);
  }, [RemamberUser, IsFocus]);

  return (
    <>
      <View style={whole.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
          <View>
            <Image style={styles.authLogo} resizeMethod="resize" resizeMode="contain" source={imagePath.AppLogo} />

            <View style={{ alignItems: "center" }}>
              <TextInput
                blurOnSubmit={false}
                returnKeyType={"next"}
                onSubmitEditing={() => PassRef.current.focus()}
                style={[text.Inputtxtlighter, ResponsiveFonts.textualStyles.TextInputFonts]}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType={"email-address"}
                onChangeText={(text) => setemail(text)}
                value={email}
                textContentType="emailAddress"
                autoCapitalize='none'
                maxLength={40}
              />

              <View style={LoginStyles.InputContaoner}>
                <TextInput
                  ref={PassRef}
                  style={[
                    text.Inputtxtlighter,
                    { margin: 0 },
                    ResponsiveFonts.textualStyles.TextInputFonts,
                  ]}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  onChangeText={(ptext) => setpass(ptext)}
                  value={pass}
                  textContentType="password"
                  secureTextEntry={!showpass}
                  autoCapitalize='none'
                  onSubmitEditing={() => Auth_Login(pass, email?.trim(), LoginRemember, setshowModal, setmodalmsg, setLoading, dispatch, token)}
                />

                <TouchableOpacity style={LoginStyles.eyecontainer} onPress={() => setshowpass(!showpass)}>
                  <Image source={!showpass ? imagePath.EyeClose : imagePath.EyeOpen} style={LoginStyles.eye} />
                </TouchableOpacity>

              </View>

              <Pressable style={LoginStyles.Remcontainer} onPress={() => setLoginRemember(!LoginRemember)}>
                <View style={[LoginStyles.RemText, { borderColor: LoginRemember == false ? "#000" : "red", backgroundColor: LoginRemember == false ? "#fff" : "red" }]} />
                <Text style={[{ color: LoginRemember == false ? "#000" : "red" }, ResponsiveFonts.textualStyles.medium,]}>
                  Remember me{" "}
                </Text>
              </Pressable>

              <View style={LoginStyles.Signup} >
                <Text style={[whole.cardEmphasis, LoginStyles.textsignup, ResponsiveFonts.textualStyles.smallBold]}>
                  {" "}Don't have an account ?
                  {/* <TouchableOpacity> */}
                  <Text onPress={() => navigation.navigate("SignupStep1")} style={[LoginStyles.textsignup2, ResponsiveFonts.textualStyles.smallBold]} >
                    {" "}Become a Driver.
                  </Text>
                  {/* </TouchableOpacity> */}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.ButtonImportant, { marginTop: "10%" }]}
                onPress={() => Auth_Login(pass, email?.trim(), LoginRemember, setshowModal, setmodalmsg, setLoading, dispatch, token)}>
                <Text style={[{ color: "white" }, ResponsiveFonts.textualStyles.medium]}>
                  {" "}Login{" "}
                </Text>
              </TouchableOpacity>

              <PolicyText label="Login" />

              <TouchableOpacity onPress={() => navigation.navigate("forgotPassword", { type: "Forgot_Pass", })}>
                <Text style={[whole.cardEmphasis, LoginStyles.textsignup3, ResponsiveFonts.textualStyles.medium]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </KeyboardAwareScrollView>
        <Image style={[LoginStyles.bottomIMage, { height: 120 }]} resizeMode="stretch" source={imagePath.FooterDesginImage} />

      </View>

      {showModal && (<AnimatedModal visible={showModal} onClose={() => { setshowModal(false) }} >
        <ModalPattern1 setValue={setshowModal} heading={modalmsg} btnTittle={"Okay"}
          OnPress={() => {
            setmodalmsg("");
            setshowModal(false);
          }} />
      </AnimatedModal>)}

      {loading && (<AnimatedModal visible={loading} onClose={() => { setLoading(false) }} >
        <Loader />
      </AnimatedModal>)}

    </>
  );
};

export default Login;
