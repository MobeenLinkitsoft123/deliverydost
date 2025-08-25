import React, { useState, useEffect, } from "react";
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
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from '@react-navigation/native';
import { useNavigation, useRoute } from "@react-navigation/core";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from "react-native-document-picker"

import { styles, whole } from "../../../assets/styling/stylesheet";
import LoginStyles from "./styles";
import HeaderAuth from "../../../Components/HeaderAuth/HeaderAuth";
import Label from "../../../Components/Label/Label";
import ProfilePicker from "../../../Components/ProfilePicker/ProfilePicker";
import { moderateScale, verticalScale } from "../../../styles/responsiveSize";
import PolicyText from "../../../Components/PrivacyPolicy/PrivacyText";
import imagePath from "../../../constants/imagePath";
import colors from "../../../styles/colors";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import { CameraPermission, confirmMediaPermission } from "../../../utils/permissions";
import { UPLOAD_FILE, SignUpUser } from "../../../Store/Action/AuthFunctions";
import ModalPattern1 from "../../../Components/Modals/Modals/ModalPattern1";
import UploadMOdal from "../../../Components/Modals/Modals/UploadModal";
import Loader from "../../../Components/Modals/Modals/Loader";
import TextLabel from "../../../Components/TextLabel/TextLable";
import { StaticMethods } from "../../../utils/StaticMethods";
import ImageViewModal from "../../../Components/NewBidsModalize/ImageViewModal";
import CameraView from "../../../Components/CameraView/CameraView";
import { GetLocationAndAddress } from "../../../Store/Action/HelperActions";
import AnimatedModal from "../../../Components/AnimtedModal/AnimatedModal";
// import { REQUEST_NOTIFICATION_PERMISSION } from "../../../utils/NotificationServices";
import { compressImg } from "../../../utils/helperFunctions";
import LoaderGif from '../../../assets/images/neworderflow/signupLoader.gif';
import { checkNotificationPermissionStatus } from "../../../services/NotificationServices/notificationHelper";


const { height, width } = Dimensions.get("screen");

const keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 0;

const Step3 = (props) => {
  const RouteData = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const IsUserAllowPermission = useSelector((state) => state?.AuthReducer?.isMediaPermissionAllowed);

  const [profile, setprofile] = useState();
  const [licenseFrontImage, setLicenseFrontImage] = useState(null);
  const [licenseBackImage, setLicenseBackImage] = useState(null);
  const [insuranceFrontImage, setInsuranceFrontImage] = useState(null);
  const [insuranceBackImage, setInsuranceBackImage] = useState(null);
  const [licenseFrontImageExpiry, setLicenseFrontImageExpiry] = useState(null);
  const [insuranceFrontImageExpiry, setInsuranceFrontImageExpiry] =
    useState(null);
  const [backgroundCheckExpiry, setBackgroundCheckExpiry] = useState(null);
  const [addressData, setAddressData] = useState();

  const [showModal, setshowModal] = useState(false);
  const [modalmsg, setmodalmsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [expiryFor, setExpiryFor] = useState(0);
  const [UploadModal, setUploadModal] = useState(false);
  const [INDEX, SetINDEX] = useState(9)
  const [showImageFull, setShowImageFull] = useState(false)
  const [showImageFullPath, setShowImageFullPath] = useState('')
  const [cameraModal, setCameraModal] = useState(false);
  const [selectPermission, setSelectPermission] = useState(false);
  const [token, setToken] = useState("");

  const IsFocus = useIsFocused()

  const today = new Date();
  const previousDay = new Date(today);
  previousDay.setDate(today.getDate() + 1);

  const OpenGallery = async () => {
    const result = await launchImageLibrary(options);
    const imageSizeLimit = 5 * 1024 * 1024
    if (result?.assets[0].fileSize <= imageSizeLimit) {
      let compressedImg = await compressImg(result?.assets[0]?.uri)

      const newCam = {
        uri: compressedImg,
        fileName: result?.assets[0]?.fileName,
        path: compressedImg,
        type: "IMAGE/JPG"
      }
      if (result?.assets) {
        if (INDEX == 1) {
          setLicenseFrontImage(newCam);
        } else if (INDEX == 2) {
          setLicenseBackImage(newCam);
        } else if (INDEX == 3) {
          setInsuranceFrontImage(newCam);
        } else if (INDEX == 4) {
          setInsuranceBackImage(newCam);
        } else {
          setprofile(newCam);
        }
      }
    } else {
      setmodalmsg("File size should be less than 5mb.");
      setshowModal(true);
    }

  }

  const openPdfPicker = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
      copyTo: "documentDirectory",
    });

    const pdfSize = 5 * 1024 * 1024
    if (res[0]?.size <= pdfSize) {
      console.log(res[0]);
      if (INDEX == 1) {
          setLicenseFrontImage(res[0]);
        } else if (INDEX == 2) {
          setLicenseBackImage(res[0]);
        } else if (INDEX == 3) {
          setInsuranceFrontImage(res[0]);
        } else if (INDEX == 4) {
          setInsuranceBackImage(res[0]);
        }
    } else {
      setmodalmsg('Please ensure the file size does not exceed 5MB.')
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
          setCameraModal(true)
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
      setCameraModal(true)
    }
  }

  useEffect(() => {
    // GetLocationAndAddress(setAddressData, false),
    IsFocus && checkNotificationPermissionStatus(setToken);

    // REQUEST_NOTIFICATION_PERMISSION(setToken);

  }, [IsFocus]);

  const Signup = async () => {
    if (
      profile?.type != undefined &&
      licenseFrontImage?.type != undefined &&
      licenseBackImage?.type != undefined &&
      insuranceFrontImage?.type != undefined
    ) {
      if (
        licenseFrontImageExpiry &&
        insuranceFrontImageExpiry
      ) {
        if (selectPermission) {
          setLoading(true);
          try {
            const [
              ProfileImageUrl,
              LicenseImageFrontUrl,
              LicenseImageBackUrl,
              InsuranceImageFrontUrl,
              // PoliceImageUrl,
            ] = await Promise.all([
              await UPLOAD_FILE(profile, false, RouteData?.params?.RouteState?.phoneNumber, 0),
              await UPLOAD_FILE(licenseFrontImage, false, RouteData?.params?.RouteState?.phoneNumber, 1),
              await UPLOAD_FILE(licenseBackImage, false, RouteData?.params?.RouteState?.phoneNumber, 1),
              await UPLOAD_FILE(insuranceFrontImage, false, RouteData?.params?.RouteState?.phoneNumber, 1),
            ]);
            // console.log('LicenseImageFrontUrl res',LicenseImageFrontUrl?.data);
            const data = {
              ProfileImageUrl: ProfileImageUrl,
              LicenseImageFrontUrl: LicenseImageFrontUrl,
              LicenseImageBackUrl: LicenseImageBackUrl,
              InsuranceImageFrontUrl: InsuranceImageFrontUrl,
              InsuranceImageFrontUrl: InsuranceImageFrontUrl,
              licenseFrontImageExpiry: licenseFrontImageExpiry,
              insuranceFrontImageExpiry: insuranceFrontImageExpiry,
              RouteData: RouteData,
              // addressData: addressData,
              selectPermission: selectPermission
            };
            // console.log('data',data);
            navigation.navigate("SignupStep5", { ...data });

          } catch (error) {
            setLoading(false);
            setshowModal(true);
            setmodalmsg("Documents upload fail try again");
            console.log(error);
          }
        } else {
          setmodalmsg("Allow Foodosti to run Background check");
          setshowModal(true);
        }
      } else {
        setshowModal(true);
        setmodalmsg(
          "Kindly select expiry date for license and insurance documents."
        );
      }
    } else {
      setshowModal(true);
      setmodalmsg("Both a profile image and all other documents must be provided.");
    }
  };
  const handledSignUp = () => {
    // if (addressData) {
    //   Signup()
    // } else {
    //   Alert.alert('Info', 'Please allow location permission to access your current location', [
    //     {
    //       text: 'Refresh',
    //       onPress: () => {
    //         setLoading(true)
    //         GetLocationAndAddress(setAddressData, setLoading)
    //       },
    //       style: 'cancel',
    //     },
    //     { text: 'Cancel', onPress: () => { } },
    //   ]);
    // }
    Signup()
  }

  const options = {
    title: "Select profile image",
    storageOptions: {
      skipBackup: true,
      path: "images",
    },
  };

  const OpenGalleryFixed = () => {
    if (Platform.OS == 'ios' && IsUserAllowPermission != true) {
      confirmMediaPermission(OpenGallery, dispatch, IsUserAllowPermission)
    } else {
      OpenGallery()
    }
  }

  const selectImage = async (index) => {
    const OnConfirm = () => {
      SetINDEX(index)
      if (index==0) {
        OpenCamera()
      } else {
        setUploadModal(true)
      }
      
      // OpenCamera()
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
    } else if (expiryFor == 3) {
      setInsuranceFrontImageExpiry(value);
    } else if (expiryFor == 4) {
    } else {
      setBackgroundCheckExpiry(value);
    }
    setIsDatePickerVisible(false);
  };

  const openDateModal = (index) => {
    setExpiryFor(index);
    setIsDatePickerVisible(true);
  };
  const CameraSelect = async (cameraObj, setLoading) => {
    let compressedImgFromCamera = await compressImg(cameraObj?.uri)
    setCameraModal(false)

    const newCam = {
      uri: compressedImgFromCamera,
      fileName: cameraObj?.name,
      path: compressedImgFromCamera,
      type: "IMAGE/JPG"
    }
    if (INDEX == 1) {
      setLicenseFrontImage(newCam);
    } else if (INDEX == 2) {
      setLicenseBackImage(newCam);
    } else if (INDEX == 3) {
      setInsuranceFrontImage(newCam);
    } else if (INDEX == 4) {
      setInsuranceBackImage(newCam);
    } else {
      setprofile(newCam);
    }
    setLoading && setLoading(false)
  }
  const isModalMessage = modalmsg &&
    modalmsg.toLowerCase() ==
    "Your account has been successfully created. The admin will approve the account once your uploaded documents are verified. We will contact you if further clarification is needed.".toLowerCase()

  return (
    <>
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
                label={"Provide your details for the verification process."}
                color={"#888"}
                marginBottom={10}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
              />

              <TextLabel
                label={"Upload Profile Image*"}
                textAlign={"center"}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                marginBottom={10}
                marginTop={20}
                color={'#7b1e1f'}
              />
              <ProfilePicker
                source={{ uri: profile?.uri }}
                onPress={() => selectImage(0)}
                close={() => setprofile(null)}
              />
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={StyledDocuemnts.uploadDocumentBtn}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={licenseFrontImage?.uri ? 0.2 : 0.8}
                    onPress={licenseFrontImage?.uri ? () => {
                      setShowImageFullPath(licenseFrontImage)
                      setShowImageFull(true)
                    } : () => { }}
                  >
                    <Image
                      style={[StyledDocuemnts.image1]}
                      source={licenseFrontImage?.name?.split('.').pop()=='pdf'? imagePath.pdf_ext:licenseFrontImage?.fileName ? { uri: licenseFrontImage?.uri } : require("../../../assets/images/imagefile.png")}
                      resizeMode={licenseFrontImage?.fileName ? 'cover' : "contain"}
                    />
                    {/* {licenseFrontImage&&<Text style={[
                      StyledDocuemnts.uploadDocumentBtnText,
                      ResponsiveFonts.textualStyles.small,
                      StyledDocuemnts.con2,
                    ]}>{`${licenseFrontImage?.name? 'PDF':'JPEG'}`}</Text>} */}
                  </TouchableOpacity>

                  <View style={StyledDocuemnts.con1}>
                    <Text style={[StyledDocuemnts.uploadDocumentBtnText, ResponsiveFonts.textualStyles.medium, { textAlign: "center" }]}>
                      Upload your Drivers license (Front)
                    </Text>
                    {licenseFrontImage && (
                      <Text style={[StyledDocuemnts.listOfDocumentsText, ResponsiveFonts.textualStyles.microBold]}
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
                      <Text style={[StyledDocuemnts.listOfDocumentsText, ResponsiveFonts.textualStyles.microBold]}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                      >
                        {licenseFrontImage?.fileName == null ||
                          licenseFrontImage?.fileName == undefined
                          ? licenseFrontImage?.uri.split('/').pop().split('-').pop()
                          : licenseFrontImage?.uri.split('/').pop().split('-').pop()}
                      </Text>
                    )}
                    <Text style={[StyledDocuemnts.listOfDocumentsText, ResponsiveFonts.textualStyles.microBold]}>
                      {"Expiry: " +
                        (licenseFrontImageExpiry
                          ? StaticMethods.GetDateMonthYearString(
                            licenseFrontImageExpiry
                          )
                          : "--/--/----")}
                    </Text>
                    <View style={[StyledDocuemnts.row]}>
                      <TouchableOpacity
                        style={[{ backgroundColor: licenseFrontImage ? "#005E82" : colors.theme }, StyledDocuemnts.btn1]}
                        onPress={() => selectImage(1)}>
                        <TextLabel
                          label={"Select File"}
                          ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                          color={"#fff"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={[{ backgroundColor: licenseFrontImageExpiry ? "#005E82" : colors.theme }, StyledDocuemnts.con4]}
                        onPress={() => openDateModal(1)}
                      >
                        <TextLabel
                          label={licenseFrontImageExpiry ? "Edit Expiry" : "Set Expiry"}
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
                      setShowImageFullPath(licenseBackImage)
                      setShowImageFull(true)
                    } : () => { }}
                    style={{
                      flex: 1,
                    }}
                  >
                    <Image
                      style={[ StyledDocuemnts.image1]}
                      source={licenseBackImage?.name?imagePath.pdf_ext :licenseBackImage?.uri ? { uri: licenseBackImage?.uri } : require("../../../assets/images/imagefile.png")}
                      resizeMode={licenseBackImage?.uri ? "cover" : 'contain'}
                    />
                    {/* {licenseBackImage&&<Text
                      style={[
                        StyledDocuemnts.uploadDocumentBtnText,
                        ResponsiveFonts.textualStyles.small,
                        StyledDocuemnts.con2,
                      ]}
                    >{licenseBackImage?.name?'PDF':'JPEG'}</Text>} */}
                  </TouchableOpacity>

                  <View style={StyledDocuemnts.con3}>
                    <Text
                      style={[
                        StyledDocuemnts.uploadDocumentBtnText,
                        ResponsiveFonts.textualStyles.medium,
                        { textAlign: "center" },
                      ]}
                    >Upload your Drivers license (Back)</Text>
                    {licenseBackImage && (
                      <Text style={[StyledDocuemnts.listOfDocumentsText, ResponsiveFonts.textualStyles.microBold]}
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
                      <Text style={[StyledDocuemnts.listOfDocumentsText, ResponsiveFonts.textualStyles.microBold]}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                      >
                        {licenseBackImage?.fileName == null ||
                          licenseBackImage?.fileName == undefined
                          ? licenseBackImage?.uri.split('/').pop().split('-').pop()
                          : licenseBackImage?.uri.split('/').pop().split('-').pop()}
                      </Text>
                    )}
                    <Text style={[StyledDocuemnts.listOfDocumentsText, ResponsiveFonts.textualStyles.microBold]}>
                      {"Expiry: " +
                        (licenseFrontImageExpiry
                          ? StaticMethods.GetDateMonthYearString(
                            licenseFrontImageExpiry
                          )
                          : "--/--/----")}
                    </Text>
                    <View style={[StyledDocuemnts.row]}>
                      <TouchableOpacity
                        style={[StyledDocuemnts.btn1, { backgroundColor: licenseBackImage ? "#005E82" : colors.theme }]}
                        onPress={() => selectImage(2)}
                      >
                        <TextLabel
                          label={"Select File"}
                          ResponsiveFonts={ResponsiveFonts.textualStyles.small}
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
                      setShowImageFullPath(insuranceFrontImage)
                      setShowImageFull(true)
                    } : () => { }}
                    style={{
                      flex: 1,
                    }}
                  >
                    <Image
                      style={[StyledDocuemnts.image2, { borderRadius: insuranceFrontImage?.fileName ? width * 0.02 : 0 }]}
                      source={insuranceFrontImage?.name?imagePath.pdf_ext:insuranceFrontImage?.fileName ? { uri: insuranceFrontImage?.uri } : require("../../../assets/images/imagefile.png")}
                      resizeMode={insuranceFrontImage?.fileName ? 'cover' : "contain"}
                    />
                    {/* {insuranceFrontImage?.uri&&<Text style={[StyledDocuemnts.uploadDocumentBtnText, ResponsiveFonts.textualStyles.small, StyledDocuemnts.con2]}>{insuranceFrontImage?.name?'PDF':'JPEG'}</Text>} */}
                  </TouchableOpacity>

                  <View style={StyledDocuemnts.con3}>
                    <Text style={[StyledDocuemnts.uploadDocumentBtnText, ResponsiveFonts.textualStyles.medium, { textAlign: "center" }]}>
                      Upload Vehicle Insurance File*
                    </Text>
                    {insuranceFrontImage && (
                      <Text style={[StyledDocuemnts.listOfDocumentsText, ResponsiveFonts.textualStyles.microBold]}
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
                      <Text style={[StyledDocuemnts.listOfDocumentsText, ResponsiveFonts.textualStyles.microBold]}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                      >
                        {insuranceFrontImage?.fileName == null ||
                          insuranceFrontImage?.fileName == undefined
                          ? insuranceFrontImage.uri.split('/').pop().split('-').pop()
                          : insuranceFrontImage.uri.split('/').pop().split('-').pop()}
                      </Text>
                    )}
                    <Text style={[StyledDocuemnts.listOfDocumentsText, ResponsiveFonts.textualStyles.microBold]}>
                      {"Expiry: " +
                        (insuranceFrontImageExpiry
                          ? StaticMethods.GetDateMonthYearString(
                            insuranceFrontImageExpiry
                          )
                          : "--/--/----")}
                    </Text>

                    <View style={[StyledDocuemnts.row]}>
                      <TouchableOpacity
                        style={[StyledDocuemnts.btn1, { backgroundColor: insuranceFrontImage ? "#005E82" : colors.theme }]}
                        onPress={() => selectImage(3)}>
                        <TextLabel
                          label={"Select File"}
                          ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                          color={"#fff"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[StyledDocuemnts.con4, { backgroundColor: insuranceFrontImageExpiry ? "#005E82" : colors.theme }]}
                        onPress={() => openDateModal(3)}
                      >
                        <TextLabel
                          label={insuranceFrontImageExpiry ? "Edit Expiry" : "Set Expiry"}
                          ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                          color={"#fff"}
                        />
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
                
                <TouchableOpacity style={StyledDocuemnts.bottomCheckBoxCon} onPress={() => setSelectPermission(!selectPermission)}>
                  <TouchableOpacity onPress={() => setSelectPermission(!selectPermission)} style={selectPermission ? StyledDocuemnts.bottomCheckBoxConImg : StyledDocuemnts.bottomCheckBoxConImgUnselect}>
                    {selectPermission && (
                      <Image source={require('../../../assets/images/check.png')} resizeMode="contain" style={{ width: '70%', height: '70%', tintColor: colors.white }} />
                    )}
                  </TouchableOpacity>
                  <Text style={[{ color: colors.black }, ResponsiveFonts.textualStyles.smallBold]}>{" "}Allow Foodosti to run Background check?</Text>
                </TouchableOpacity>
                <PolicyText label="Signup" navigate={navigation} />

                <TouchableOpacity style={[styles.ButtonImportant, { marginTop: -5 }]} onPress={handledSignUp}>
                  <Text style={[{ color: "white" }, ResponsiveFonts.textualStyles.medium]}>{" "}NEXT{" "}</Text>
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
            onCancel={() => setIsDatePickerVisible(false)}
          />

          <ImageViewModal
            showImageFull={showImageFull}
            setShowImageFull={setShowImageFull}
            showImageFullPath={showImageFullPath}
          />
          {cameraModal && (
            <CameraView CameraSelect={CameraSelect} setCameraModal={setCameraModal} index={INDEX} />
          )}

        </KeyboardAvoidingView>

      </View>

      {showModal && (<AnimatedModal visible={showModal} onClose={() => { setshowModal(false) }} >
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
      </AnimatedModal>
      )}

      {loading && (<View style={StyledDocuemnts.mainLoader}>
        <Image source={LoaderGif} style={StyledDocuemnts.mainLoaderGif} />
        <Text style={[StyledDocuemnts.mainLoaderText, ResponsiveFonts.textualStyles.medium]}>It might take few minutes, please stay on this page</Text>
      </View>)}

      {UploadModal && (
        <AnimatedModal visible={UploadModal} onClose={() => { setUploadModal(false) }} >
          <UploadMOdal setValue={setUploadModal} OnCamera={() => OpenCamera()} OnGallery={() => OpenGalleryFixed()} onPdf={INDEX==0?false:() => openPdfPicker()} />
        </AnimatedModal>
      )}

    </>
  );
};

const StyledDocuemnts = StyleSheet.create({
  uploadMainView: {
    display: "flex",
    flexDirection: "column"
  },
  bottomCheckBoxCon: {
    width: '100%',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(10),
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: moderateScale(6)
  },
  bottomCheckBoxConImg: {
    width: verticalScale(17),
    height: verticalScale(17),
    borderRadius: width * 0.01,
    backgroundColor: colors.theme,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(5)
  },
  bottomCheckBoxConImgUnselect: {
    width: verticalScale(17),
    height: verticalScale(17),
    borderRadius: width * 0.01,
    borderColor: colors.theme,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(5)
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
    width: width - 60,
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 5,
  },
  uploadDocumentBtnText: {
    marginLeft: 20,
    color: "#7b1e1f",
  },
  documentsLengthView: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 15,
    color: "#333",
  },
  documentFormatText: {
    fontStyle: "italic",
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
  image1: {
    width: moderateScale(60),
    height: verticalScale(60),
  },
  image2: {
    width: moderateScale(60),
    height: verticalScale(60),
    alignItems: 'center',
  },
  con1: {
    alignItems: "center",
    flex: 5,
    paddingHorizontal: 5,
  },
  btn1: {
    paddingHorizontal: 10,
    borderRadius: 20,
    paddingVertical: 5,
  },
  con2: {
    right: moderateScale(5),
    color: colors.theme,
    width: moderateScale(40),
  },
  con3: {
    alignItems: "center",
    flex: 5,
    paddingHorizontal: 5,
  },
  con4: {
    paddingHorizontal: 10,
    borderRadius: 20,
    paddingVertical: 5,
    marginLeft: 5
  },
  mainLoader: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', zIndex: 99
  },
  mainLoaderText: { color: "white", marginTop: 20, textAlign: 'center', width: '80%' },
  mainLoaderGif: { width: 200, height: 200 }



});

export default Step3;
