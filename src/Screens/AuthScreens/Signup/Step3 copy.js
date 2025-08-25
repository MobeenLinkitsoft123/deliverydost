import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Linking,
  PermissionsAndroid,
  Modal,
  ActivityIndicator
} from "react-native";
import Toast from "react-native-toast-message";

import DocumentPicker from "react-native-document-picker";
import { useNavigation, useRoute } from "@react-navigation/core";
import { styles, whole, text } from "../../../assets/styling/stylesheet";
import ImagePicker from "react-native-image-picker";
import LoginStyles from "./styles";
import HeaderAuth from "../../../Components/HeaderAuth/HeaderAuth";
import Label from "../../../Components/Label/Label";
import ProfilePicker from "../../../Components/ProfilePicker/ProfilePicker";
import { moderateScale, verticalScale } from "../../../styles/responsiveSize";
import PolicyText from "../../../Components/PrivacyPolicy/PrivacyText";
import imagePath from "../../../constants/imagePath";
import colors from "../../../styles/colors";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import { CameraPermission } from "../../../utils/permissions";
import { UPLOAD_FILE, SignUpUser } from "../../../Store/Action/AuthFunctions";
import CustomModal from "../../../Components/Modals/CustomModa";
import ModalPattern1 from "../../../Components/Modals/Modals/ModalPattern1";
import UploadMOdal from "../../../Components/Modals/Modals/UploadModal";
import Loader from "../../../Components/Modals/Modals/Loader";
import TextLabel from "../../../Components/TextLabel/TextLable";
import { StaticMethods } from "../../../utils/StaticMethods";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Pdf from "react-native-pdf";
import ImageViewModal from "../../../Components/NewBidsModalize/ImageViewModal";
import PdfViewModal from "../../../Components/NewBidsModalize/PdfViewModal";

const { height, width } = Dimensions.get("screen");

const keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 0;

const Step3 = (props) => {
  const RouteData = useRoute();
  const navigation = useNavigation();
  const [profile, setprofile] = useState();
  const [licenseFrontImage, setLicenseFrontImage] = useState(null);
  const [licenseBackImage, setLicenseBackImage] = useState(null);
  const [insuranceFrontImage, setInsuranceFrontImage] = useState(null);
  const [insuranceBackImage, setInsuranceBackImage] = useState(null);
  const [licenseFrontImageExpiry, setLicenseFrontImageExpiry] = useState(null);
  const [licenseBackImageExpiry, setLicenseBackImageExpiry] = useState(null);
  const [insuranceFrontImageExpiry, setInsuranceFrontImageExpiry] =
    useState(null);
  const [insuranceBackImageExpiry, setInsuranceBackImageExpiry] =
    useState(null);
  const [backgroundCheckExpiry, setBackgroundCheckExpiry] = useState(null);
  const [singleFile, setSingleFile] = useState();
  const [singleFile2, setSingleFile2] = useState();
  const [singleFile3, setSingleFile3] = useState();

  const [showModal, setshowModal] = useState(false);
  const [modalmsg, setmodalmsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [expiryFor, setExpiryFor] = useState(0);
  const [UploadModal, setUploadModal] = useState(false);
  const [INDEX, SetINDEX] = useState(9)
  const [showImageFull, setShowImageFull] = useState(false)
  const [showImageFullPath, setShowImageFullPath] = useState('')
  const [showPdfFull, setShowPdfFull] = useState(false)
  const [showPdfFullPath, setShowPdfFullPath] = useState('')

  const dateTimeToday = new Date();
  const today = new Date();
  const previousDay = new Date(today);
  previousDay.setDate(today.getDate() + 1);
  useEffect(() => {
    if (Platform.OS == 'ios') {
      CameraPermission();
    }

  }, []);


  const OpenGallery = async () => {
    const result = await launchImageLibrary(options);
    const imageSizeLimit = 5 * 1024 * 1024
    if (result?.assets[0].fileSize <= imageSizeLimit) {
      if (result?.assets) {
        if (INDEX == 1) {
          setLicenseFrontImage(result?.assets[0]);
        } else if (INDEX == 2) {
          setLicenseBackImage(result?.assets[0]);
        } else if (INDEX == 3) {
          setInsuranceFrontImage(result?.assets[0]);
        } else if (INDEX == 4) {
          setInsuranceBackImage(result?.assets[0]);
        } else {
          setprofile(result?.assets[0]);
        }
      }
    } else {
      setmodalmsg("File size should be less than 5mb.");
      setshowModal(true);
    }




  }

  const OpenCamera = async () => {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted === true) {
          const result = await launchCamera(options);
          const imageSizeLimit = 5 * 1024 * 1024
          if (result?.assets[0].fileSize <= imageSizeLimit) {

            if (result?.assets) {
              if (INDEX == 1) {
                setLicenseFrontImage(result?.assets[0]);
              } else if (INDEX == 2) {
                setLicenseBackImage(result?.assets[0]);
              } else if (INDEX == 3) {
                setInsuranceFrontImage(result?.assets[0]);
              } else if (INDEX == 4) {
                setInsuranceBackImage(result?.assets[0]);
              } else {
                setprofile(result?.assets[0]);
              }
            }
          } else {
            setmodalmsg("File size should be less than 5mb.");
            setshowModal(true);
          }
        } else {
          Alert.alert('Permission Refused', 'Kindly allow permission from app setting.', [
            {
              text: 'Cancel',
              onPress: () => { },
              style: 'cancel',
            },
            { text: 'Go to settings', onPress: () => Linking.openSettings() },
          ]);

        }
      } catch (error) {
        console.error('Error checking camera permission:', error);
      }
    } else {
      const result = await launchCamera(options);

      if (result?.assets) {
        if (INDEX == 1) {
          setLicenseFrontImage(result?.assets[0]);
        } else if (INDEX == 2) {
          setLicenseBackImage(result?.assets[0]);
        } else if (INDEX == 3) {
          setInsuranceFrontImage(result?.assets[0]);
        } else if (INDEX == 4) {
          setInsuranceBackImage(result?.assets[0]);
        } else {
          setprofile(result?.assets[0]);
        }
      }

    }

  }

  const Signup = async () => {
    if (
      profile?.type != undefined &&
      // singleFile?.type != undefined &&
      // singleFile2?.type != undefined &&
      licenseFrontImage?.type != undefined &&
      licenseBackImage?.type != undefined &&
      insuranceFrontImage?.type != undefined &&
      // insuranceBackImage?.type != undefined &&
      singleFile3?.type != undefined
    ) {
      if (
        licenseFrontImageExpiry &&
        insuranceFrontImageExpiry
      ) {
        Toast.show({
          type: "info",
          text1: "It will take few minutes, please stay with us",
          position: "bottom",
        });
        setLoading(true);
        try {
          const [
            ProfileImageUrl,
            LicenseImageFrontUrl,
            LicenseImageBackUrl,
            InsuranceImageFrontUrl,
            PoliceImageUrl,
          ] = await Promise.all([
            await UPLOAD_FILE(profile, false, RouteData?.params?.RouteState?.phoneNumber, 0),
            await UPLOAD_FILE(licenseFrontImage, false, RouteData?.params?.RouteState?.phoneNumber, 1),
            await UPLOAD_FILE(licenseBackImage, false, RouteData?.params?.RouteState?.phoneNumber, 1),
            await UPLOAD_FILE(insuranceFrontImage, false, RouteData?.params?.RouteState?.phoneNumber, 1),
            await UPLOAD_FILE(singleFile3, true, RouteData?.params?.RouteState?.phoneNumber, 1),
          ]);

          SignUpUser(
            ProfileImageUrl,
            LicenseImageFrontUrl,
            LicenseImageBackUrl,
            InsuranceImageFrontUrl,
            InsuranceImageFrontUrl,
            PoliceImageUrl,
            licenseFrontImageExpiry,
            insuranceFrontImageExpiry,
            RouteData,
            setLoading,
            setmodalmsg,
            setshowModal
          );
        } catch (error) {
          setLoading(false);
          setTimeout(() => {
            setshowModal(true);
            setmodalmsg("Documents upload fail try again");
          }, 600);
          console.log(error);
        }
      } else {
        setshowModal(true);
        setmodalmsg(
          "Kindly select expiry date for license and insurance documents."
        );
      }
    } else {
      setshowModal(true);
      setmodalmsg("Profile image and all four documents are required.");
    }
  };
  const selectFile = async (e) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        copyTo: "cachesDirectory",
      });
      const pdfSize = 5 * 1024 * 1024
      if (res[0]?.size <= pdfSize) {
        if (e == 1) {
          setSingleFile(res[0]);
        }
        if (e == 2) {
          setSingleFile2(res[0]);
        }
        if (e == 3) {
          setSingleFile3(res[0]);
        }
      } else {
        setmodalmsg("File size should be less than 5mb.");
        setshowModal(true);
      }

    } catch (err) {

    }
  };

  const options = {
    title: "Select profile image",
    storageOptions: {
      skipBackup: true,
      path: "images",
    },
  };

  const selectImage = async (index) => {

    const OnConfirm = () => {
      SetINDEX(index)
      setUploadModal(true)
    }

    if (Platform.OS == 'ios') {
      CameraPermission(OnConfirm);
    } else {
      CameraPermission(OnConfirm);
      OnConfirm(index)
    }

  };

  const setExpiry = (value) => {
    if (expiryFor == 1) {
      setLicenseFrontImageExpiry(value);
    } else if (expiryFor == 2) {
      // setLicenseBackImageExpiry(value);
    } else if (expiryFor == 3) {
      setInsuranceFrontImageExpiry(value);
    } else if (expiryFor == 4) {
      // setInsuranceBackImageExpiry(value);
    } else {
      setBackgroundCheckExpiry(value);
    }
    setIsDatePickerVisible(false);
  };

  const openDateModal = (index) => {
    setExpiryFor(index);
    setIsDatePickerVisible(true);
  };


  const isModalMessage = modalmsg &&
    modalmsg.toLowerCase() ==
    "Your account has been successfully created. The admin will approve the account once your uploaded documents are verified. We will contact you if further clarification is needed.".toLowerCase()

  return (
    <View style={LoginStyles.containerMain}>
      <KeyboardAvoidingView
        behavior="height"
        enabled
        style={whole.container}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <HeaderAuth label="Become a Driver" />

        <View style={[StyledDocuemnts.uploadMainView, { flex: 1 }]}>
          <View style={[StyledDocuemnts.uploadDocumentsView, { flex: 1 }]}>
            <Label
              label={"Step 4"}
              marginBottom={10}
              ResponsiveFonts={ResponsiveFonts.textualStyles.xlarge}
              marginTop={10}
              color={colors.black}
            />
            <Label
              label={"Let us know your details for verification"}
              color={"#888"}
              marginBottom={10}
              ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
            />

            <ProfilePicker
              source={{
                uri: Platform.OS == "ios" ? profile?.uri : profile?.uri,
              }}
              onPress={() => {
                selectImage(0);
              }}
              close={() => setprofile(null)}
            />
            <TextLabel
              label={"Upload Profile Image*"}
              textAlign={"center"}
              ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
              marginBottom={10}
              marginTop={-20}
              color={'#7b1e1f'}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={StyledDocuemnts.uploadDocumentBtn}>
                <TouchableOpacity
                  activeOpacity={licenseFrontImage?.uri ? 0.2 : 0.8}
                  onPress={licenseFrontImage?.uri ? () => {
                    setShowImageFullPath(licenseFrontImage?.uri)
                    setShowImageFull(true)
                  } : () => { }}
                  style={{
                    flex: 1,
                  }}
                >
                  <Image
                    style={{
                      width: moderateScale(60),
                      height: verticalScale(60),
                      borderRadius: licenseFrontImage?.uri ? width * 0.02 : 0
                    }}
                    source={licenseFrontImage?.fileName ? { uri: licenseFrontImage?.uri } : require("../../../assets/images/imagefile.png")}
                    resizeMode={licenseFrontImage?.fileName ? 'cover' : "contain"}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    alignItems: "center",
                    flex: 5,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text
                    style={[
                      StyledDocuemnts.uploadDocumentBtnText,
                      ResponsiveFonts.textualStyles.medium,
                      { textAlign: "center" },
                    ]}
                  >
                    Upload License Front Image*
                  </Text>
                  {licenseFrontImage && (
                    <Text
                      style={[
                        StyledDocuemnts.listOfDocumentsText,
                        ResponsiveFonts.textualStyles.microBold,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {licenseFrontImage?.fileName == null ||
                        licenseFrontImage?.fileName == undefined
                        ? "File Selected"
                        : "File Selected"}
                    </Text>
                  )}
                  {licenseFrontImage && (
                    <Text
                      style={[
                        StyledDocuemnts.listOfDocumentsText,
                        ResponsiveFonts.textualStyles.microBold,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {licenseFrontImage?.fileName == null ||
                        licenseFrontImage?.fileName == undefined
                        ? licenseFrontImage?.uri.split('/').pop().split('-').pop()
                        : licenseFrontImage?.uri.split('/').pop().split('-').pop()}
                    </Text>
                  )}
                  <Text
                    style={[
                      StyledDocuemnts.listOfDocumentsText,
                      ResponsiveFonts.textualStyles.microBold,
                    ]}
                  >
                    {"Expiry: " +
                      (licenseFrontImageExpiry
                        ? StaticMethods.GetDateMonthYearString(
                          licenseFrontImageExpiry
                        )
                        : "--/--/----")}
                  </Text>
                  <View style={[StyledDocuemnts.row]}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: licenseFrontImage ? "#005E82" : colors.theme,
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        paddingVertical: 5,
                      }}
                      onPress={() => selectImage(1)}
                    >
                      <TextLabel
                        label={"Select File"}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        // color={"#3366CC"}
                        color={"#fff"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: licenseFrontImageExpiry ? "#005E82" : colors.theme,
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        paddingVertical: 5,
                        marginLeft: 5,
                      }}
                      onPress={() => openDateModal(1)}
                    >
                      <TextLabel
                        label={"Set Expiry"}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={"#fff"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={StyledDocuemnts.uploadDocumentBtn}>
                <TouchableOpacity
                  activeOpacity={licenseBackImage?.uri ? 0.2 : 0.8}
                  onPress={licenseBackImage?.uri ? () => {
                    setShowImageFullPath(licenseBackImage?.uri)
                    setShowImageFull(true)
                  } : () => { }}
                  style={{
                    flex: 1,
                  }}
                >
                  <Image
                    style={{
                      width: moderateScale(60),
                      height: verticalScale(60),
                      borderRadius: licenseBackImage?.uri ? width * 0.02 : 0
                    }}
                    source={licenseBackImage?.uri ? { uri: licenseBackImage?.uri } : require("../../../assets/images/imagefile.png")}
                    resizeMode={licenseBackImage?.uri ? "cover" : 'contain'}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    alignItems: "center",
                    flex: 5,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text
                    style={[
                      StyledDocuemnts.uploadDocumentBtnText,
                      ResponsiveFonts.textualStyles.medium,
                      { textAlign: "center" },
                    ]}
                  >
                    Upload License Back Image*
                  </Text>
                  {licenseBackImage && (
                    <Text
                      style={[
                        StyledDocuemnts.listOfDocumentsText,
                        ResponsiveFonts.textualStyles.microBold,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {licenseBackImage?.fileName == null ||
                        licenseBackImage?.fileName == undefined
                        ? "File Selected"
                        : "File Selected"}
                    </Text>
                  )}
                  {licenseBackImage && (
                    <Text
                      style={[
                        StyledDocuemnts.listOfDocumentsText,
                        ResponsiveFonts.textualStyles.microBold,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {licenseBackImage?.fileName == null ||
                        licenseBackImage?.fileName == undefined
                        ? licenseBackImage?.uri.split('/').pop().split('-').pop()
                        : licenseBackImage?.uri.split('/').pop().split('-').pop()}
                    </Text>
                  )}
                  <Text
                    style={[
                      StyledDocuemnts.listOfDocumentsText,
                      ResponsiveFonts.textualStyles.microBold,
                    ]}
                  >
                    {"Expiry: " +
                      (licenseFrontImageExpiry
                        ? StaticMethods.GetDateMonthYearString(
                          licenseFrontImageExpiry
                        )
                        : "--/--/----")}
                  </Text>
                  <View style={[StyledDocuemnts.row]}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: licenseBackImage ? "#005E82" : colors.theme,
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        paddingVertical: 5,
                      }}
                      onPress={() => selectImage(2)}
                    >
                      <TextLabel
                        label={"Select File"}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        // color={"#3366CC"}
                        color={"#fff"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={StyledDocuemnts.uploadDocumentBtn}>
                <TouchableOpacity
                  activeOpacity={insuranceFrontImage?.uri ? 0.2 : 0.8}
                  onPress={insuranceFrontImage?.uri ? () => {
                    setShowImageFullPath(insuranceFrontImage?.uri)
                    setShowImageFull(true)
                  } : () => {

                  }}
                  style={{
                    flex: 1,
                  }}
                >
                  <Image
                    style={{
                      width: moderateScale(60),
                      height: verticalScale(60),
                      borderRadius: insuranceFrontImage?.fileName ? width * 0.02 : 0
                    }}
                    source={insuranceFrontImage?.fileName ? { uri: insuranceFrontImage?.uri } : require("../../../assets/images/imagefile.png")}
                    resizeMode={insuranceFrontImage?.fileName ? 'cover' : "contain"}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    alignItems: "center",
                    flex: 5,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text
                    style={[
                      StyledDocuemnts.uploadDocumentBtnText,
                      ResponsiveFonts.textualStyles.medium,
                      { textAlign: "center" },
                    ]}
                  >
                    Upload Vehicle Insurance Image*
                  </Text>
                  {insuranceFrontImage && (
                    <Text
                      style={[
                        StyledDocuemnts.listOfDocumentsText,
                        ResponsiveFonts.textualStyles.microBold,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {insuranceFrontImage?.fileName == null ||
                        insuranceFrontImage?.fileName == undefined
                        ? "File Selected"
                        : "File Selected"}
                    </Text>
                  )}
                  {insuranceFrontImage && (
                    <Text
                      style={[
                        StyledDocuemnts.listOfDocumentsText,
                        ResponsiveFonts.textualStyles.microBold,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {insuranceFrontImage?.fileName == null ||
                        insuranceFrontImage?.fileName == undefined
                        ? insuranceFrontImage.uri.split('/').pop().split('-').pop()
                        : insuranceFrontImage.uri.split('/').pop().split('-').pop()}
                    </Text>
                  )}
                  <Text
                    style={[
                      StyledDocuemnts.listOfDocumentsText,
                      ResponsiveFonts.textualStyles.microBold,
                    ]}
                  >
                    {"Expiry: " +
                      (insuranceFrontImageExpiry
                        ? StaticMethods.GetDateMonthYearString(
                          insuranceFrontImageExpiry
                        )
                        : "--/--/----")}
                  </Text>
                  <View style={[StyledDocuemnts.row]}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: insuranceFrontImage ? "#005E82" : colors.theme,
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        paddingVertical: 5,
                      }}
                      onPress={() => selectImage(3)}
                    >
                      <TextLabel
                        label={"Select File"}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        // color={"#3366CC"}
                        color={"#fff"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: insuranceFrontImageExpiry ? "#005E82" : colors.theme,
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        paddingVertical: 5,
                        marginLeft: 5,
                      }}
                      onPress={() => openDateModal(3)}
                    >
                      <TextLabel
                        label={"Set Expiry"}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={"#fff"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={StyledDocuemnts.uploadDocumentBtn}>
                <TouchableOpacity
                  activeOpacity={singleFile3?.name ? 0.2 : 0.8}

                  onPress={singleFile3?.name ? () => {
                    // setShowImageFullPath(singleFile3?.fileCopyUri)
                    setShowPdfFull(true)
                  } : () => {
                  }}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: 'green'
                  }}
                >
                  <Image
                    style={{
                      width: moderateScale(60),
                      height: moderateScale(60),
                      // backgroundColor: 'red'
                    }}
                    source={singleFile3?.name ? imagePath.pdf_ext : imagePath.FileIcon}
                    resizeMode="contain"
                  />
                  {singleFile3?.name && (
                    <Text
                      style={[
                        ResponsiveFonts.textualStyles.smallBold,
                        { color: colors.theme, marginTop: verticalScale(5) },
                      ]}
                    >
                      View
                    </Text>

                  )}
                </TouchableOpacity>

                <View
                  style={{
                    alignItems: "center",
                    flex: 5,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text
                    style={[
                      StyledDocuemnts.uploadDocumentBtnText,
                      ResponsiveFonts.textualStyles.medium,
                      { textAlign: "center" },
                    ]}
                  >
                    Upload Background Check - PDF*
                  </Text>
                  {singleFile3 && (
                    <Text
                      style={[
                        StyledDocuemnts.listOfDocumentsText,
                        ResponsiveFonts.textualStyles.microBold,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {singleFile3?.name == null ||
                        singleFile3?.name == undefined
                        ? "File Selected"
                        : singleFile3?.name}
                    </Text>
                  )}

                  <View style={[StyledDocuemnts.row]}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: singleFile3 ? "#005E82" : colors.theme,
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        paddingVertical: 5,
                      }}
                      onPress={() => selectFile(3)}
                    >
                      <TextLabel
                        label={"Select File"}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        // color={"#3366CC"}
                        color={"#fff"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <PolicyText label="Signup" navigate={navigation} />

              <TouchableOpacity
                style={[styles.ButtonImportant, { marginTop: -5 }]}
                onPress={() => Signup()}
              >
                <Text
                  style={[
                    { color: "white" },
                    ResponsiveFonts.textualStyles.medium,
                  ]}
                >
                  {" "}
                  Signup{" "}
                </Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>

        <Image
          style={LoginStyles.bottomIMage}
          resizeMethod="resize"
          resizeMode="stretch"
          source={imagePath.FooterDesginImage}
        />

        <DateTimePickerModal
          minimumDate={previousDay}
          date={previousDay}
          display={Platform.OS == 'android' ? 'default' : 'inline'}
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={setExpiry}
          onCancel={() => {
            setIsDatePickerVisible(false);
          }}
        />

        <CustomModal
          value={showModal}
          setValue={setshowModal}
          HideOnBackDropPress={false}
        >
          <ModalPattern1
            setValue={setshowModal}
            heading={!isModalMessage ? modalmsg : "Welcome To Foodosti"}
            msg={isModalMessage ? modalmsg : undefined}
            btnTittle={isModalMessage ? 'Sign in' : "OK"}
            OnPress={() => {
              if (isModalMessage) {
                navigation.navigate("login");
              } else {
                setmodalmsg("");
                setshowModal(false);
              }
            }}
          />
        </CustomModal>

        <CustomModal
          value={loading}
          setValue={setLoading}
          HideOnBackDropPress={false}
        >
          <Loader />
        </CustomModal>

        <CustomModal
          value={UploadModal}
          setValue={setUploadModal}
          HideOnBackDropPress={true}
        >
          <UploadMOdal setValue={setUploadModal} OnCamera={() => OpenCamera()} OnGallery={() => OpenGallery()} />
        </CustomModal>
        <ImageViewModal
          showImageFull={showImageFull}
          setShowImageFull={setShowImageFull}
          showImageFullPath={showImageFullPath}
        />
        <PdfViewModal
          showPdfFull={showPdfFull}
          setShowPdfFull={setShowPdfFull}
          source={singleFile3?.fileCopyUri}
        />



      </KeyboardAvoidingView>
    </View>
  );
};

const StyledDocuemnts = StyleSheet.create({
  uploadMainView: {
    display: "flex",
    flexDirection: "column",
    // height: height - 70,
  },
  modalImgCon: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalImgCon1: {
    height: height,
    width: width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalImgCon2: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain'
  },
  modalImgCon3: {
    height: width * 0.08,
    width: width * 0.08,
    position: 'absolute',
    top: width * 0.1,
    right: width * 0.05
  },
  modalImgCon4: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    tintColor: colors.theme
  },

  modalPdfCon: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalPdfCon1: {
    height: height * 0.8,
    width: width * 0.95,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.05
  },
  modalPdfCon2: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.05
  },
  modalPdfCon3: {
    height: width * 0.10,
    width: width * 0.10,
    position: 'absolute',
    top: 0,
    right: 0
  },
  modalPdfCon4: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    tintColor: colors.theme
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  uploadDocumentsView: {
    display: "flex",
    flexDirection: "column",
    // height: "85%",
    alignItems: "center",
  },
  documentsView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  uploadDocumentTextView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadDocumentText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#000",
    fontFamily: "Poppins-Light",
    fontWeight: "bold",
  },
  listOfDocumentsText: {
    fontFamily: "Poppins-Light",
    fontSize: 12,
    color: "#8e8e8e",
    fontWeight: "bold",
  },
  uploadDocumentBtn: {
    shadowColor: "#000",
    shadowOffset: {
      width: 12,
      height: 0,
    },
    elevation: 5,
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 20,
    // minHeight: 60,
    display: "flex",
    flexDirection: "row",
    // justifyContent: "center",
    width: width - 60,
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 5,
  },
  uploadDocumentBtnText: {
    marginLeft: 20,
    color: "#7b1e1f",
    fontFamily: "Poppins-Light",
  },
  documentsLengthView: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    // width: width - 100,
    marginTop: 15,
    color: "#333",
  },
  documentFormatText: {
    // fontSize: (8),
    fontStyle: "italic",
    // fontFamily: "Poppins-Light",
    color: "#333",
    marginLeft: verticalScale(10),
  },
  documentsLengthText: { fontSize: 8, fontFamily: "Poppins-Light" },
  uploadedDocumentsView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 60,
    marginTop: 10,
    alignItems: "center",
    color: "#333",
  },
  documentNameView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  documentImageView: {
    backgroundColor: "#fff",
    padding: 6,
    width: 30,
    height: 30,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 12,
      height: 0,
    },
    elevation: 5,
  },
  documentViewImage: { width: 15, height: 15 },
  eyeImage: { width: 20, height: 20 },
  cancelImage: { width: 15, height: 15, marginLeft: 20 },
  bottomBorderView: {
    borderBottomWidth: 1,
    marginTop: 15,
    borderBottomColor: "lightgrey",
  },
  uploadNextBtnView: {
    backgroundColor: "#f02424",
    display: "flex",
    justifyContent: "center",
    width: 150,
    padding: 15,
    alignItems: "center",
    borderRadius: 30,
    shadowColor: "#f02424",
    shadowOffset: {
      width: 12,
      height: 0,
    },
    // position: "absolute",
    // bottom: 0,
    marginTop: moderateScale(20),
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f02424",
    marginBottom: 30,
  },
  nextBtnText: {
    color: "#fff",
    fontFamily: "Poppins-Light",
    fontSize: 14,
  },
});

export default Step3;
