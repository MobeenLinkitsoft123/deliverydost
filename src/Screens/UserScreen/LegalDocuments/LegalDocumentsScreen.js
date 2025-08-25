import { View, ScrollView, StyleSheet, TouchableOpacity, Image, RefreshControl, Linking, Alert, Platform, ActivityIndicator, PermissionsAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { launchImageLibrary } from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import FastImage from "react-native-fast-image";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { SAS_TOKEN } from "@env"

import HeaderAuth from "../../../Components/HeaderAuth/HeaderAuth";
import TextLabel from "../../../Components/TextLabel/TextLable";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import colors from "../../../styles/colors";
import { moderateScale, verticalScale, height, width } from "../../../styles/responsiveSize";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import { GET_METHOD, PUT_METHOD_AUTH } from "../../../utils/ApiCallingMachnisem";
import { StaticMethods } from "../../../utils/StaticMethods";
import { DeleteAcc, UPLOAD_FILE } from "../../../Store/Action/AuthFunctions";
import imagePath from "../../../constants/imagePath";
import Loader from "../../../Components/Modals/Modals/Loader";
import { CameraPermission, confirmMediaPermission } from "../../../utils/permissions";
import UploadMOdal from "../../../Components/Modals/Modals/UploadModal";
import { LogOut } from "../../../Store/Reducers/AuthReducer/AuthReducer";
import ModalPattern1 from "../../../Components/Modals/Modals/ModalPattern1";
import ImageViewModal from "../../../Components/NewBidsModalize/ImageViewModal";
import PdfViewModal from "../../../Components/NewBidsModalize/PdfViewModal";
import { getNameUrl } from "../../../Store/Action/HelperActions";
import CameraView from "../../../Components/CameraView/CameraView";
import AnimatedModal from "../../../Components/AnimtedModal/AnimatedModal";
import { compressImg, returnUserDetailData } from "../../../utils/helperFunctions";

const LegalDocumentsScreen = () => {

  const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);

  const userDetailDecrypted = returnUserDetailData(UserDetail);

  const State = useSelector((state) => state?.AuthReducer);
  const IsUserAllowPermission = useSelector((state) => state?.AuthReducer?.isMediaPermissionAllowed);

  const [licenseFrontImageURL, setLicenseFrontImageURL] = useState("");
  const [licenseBackImageURL1, setLicenseBackImageURL1] = useState("");
  const [insuranceFrontImageURL, setInsuranceFrontImageURL] = useState("");
  const [backgroundCheckPdfURL, setBackgroundCheckPdfURL] = useState("");
  const [licenseDescription, setLicenseDescription] = useState("");
  const [insuranceDescription, setInsuranceDescription] = useState("");
  const [backgroundCheckDescription, setBackgroundCheckDescription] = useState("");
  const [cameraModal, setCameraModal] = useState(false);
  const [licenseExpiry, setLicenseExpiry] = useState(null);
  const [licenseExpiry1, setLicenseExpiry1] = useState(null);
  const [insuranceExpiry, setInsuranceExpiry] = useState(null);
  const [insuranceExpiry1, setInsuranceExpiry1] = useState(null);
  const [licenseFrontImage, setLicenseFrontImage] = useState(null);
  const [licenseBackImage, setLicenseBackImage] = useState(null);
  const [insuranceFrontImage, setInsuranceFrontImage] = useState(null);
  const [backgroundCheckPdf, setBackgroundCheckPdf] = useState(null);

  const [licenseStatus, setLicenseStatus] = useState(0);
  const [insuranceStatus, setInsuranceStatus] = useState(0);
  const [expiryFor, setExpiryFor] = useState(0);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [UploadModal, setUploadModal] = useState(false);
  const [INDEX, SetINDEX] = useState(9);
  const [modalMsg, setmodalmsg] = useState("");
  const [errorModal, seterrorModal] = useState(false);
  const [errorModal1, seterrorModal1] = useState(false);
  const [showImageFull, setShowImageFull] = useState(false)
  const [showImageFullPath, setShowImageFullPath] = useState('')
  const [showPdfFull, setShowPdfFull] = useState(false)

  const [edit1, setedit1] = useState(false)
  const [edit2, setedit2] = useState(false)
  const [edit3, setedit3] = useState(false)

  const dispatch = useDispatch()
  const isFocus = useIsFocused();

  useEffect(() => {
    setedit1(false)
    setedit2(false)
    setedit3(false)
  }, [isFocus])

  const today = new Date();
  const previousDay = new Date(today);
  previousDay.setDate(today.getDate() + 1);

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        copyTo: "documentDirectory",
      });
      const pdfSize = 5 * 1024 * 1024
      if (res[0]?.size <= pdfSize) {
        if (res && res.length > 0) {
          setBackgroundCheckPdf(res[0]);
        }
      } else {
        setmodalmsg("File size should be less than 5mb.");
        seterrorModal(true)
      }

    } catch (err) {
      console.log("ERROR in selectFile===>∂", err);
    }
  };

  const updateExpiry = (event) => {
    if (expiryFor == 0 || expiryFor == 1) {
      setLicenseExpiry(event);
      setedit1(true)
      setedit2(true)
    } else if (expiryFor == 2 || expiryFor == 3) {
      setInsuranceExpiry(event);
      setedit3(true)
    } else {
      // setBackgroundCheckExpiry(event);
    }
    setIsDatePickerVisible(false);
  };

  const options = {
    title: "Select profile image",
    quality: 0.5,
    storageOptions: {
      skipBackup: true,
      path: "images",

    },
  };

  const openPdfPicker = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
      copyTo: "documentDirectory",
    });

    const pdfSize = 5 * 1024 * 1024
    if (res[0]?.size <= pdfSize) {
      console.log(res[0]);
      if (INDEX == 0) {
          setLicenseFrontImage(res[0]);
        } else if (INDEX == 1) {
          setLicenseBackImage(res[0]);
        } else if (INDEX == 2) {
          setInsuranceFrontImage(res[0]);
        } else {
          // setInsuranceBackImage(response);
        }
    } else {
      setmodalmsg('Please ensure the file size does not exceed 5MB.')
      setshowModal(true);
    }
  }

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
        if (INDEX == 0) {
          setLicenseFrontImage(newCam);
        } else if (INDEX == 1) {
          setLicenseBackImage(newCam);
        } else if (INDEX == 2) {
          setInsuranceFrontImage(newCam);
        } else {
          // setInsuranceBackImage(response);
        }
      }
    } else {
      setmodalmsg("File size should be less than 5mb.");
      seterrorModal(true)
    }


  };

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
  const CameraSelect = async (cameraObj, setLoading) => {
    setCameraModal(false)

    let compressedImgFromCamera = await compressImg(cameraObj?.uri)

    const newCam = {
      uri: compressedImgFromCamera,
      fileName: cameraObj?.name,
      path: compressedImgFromCamera,
      type: "IMAGE/JPG"
    }
    if (INDEX == 0) {
      setLicenseFrontImage(newCam);
    } else if (INDEX == 1) {
      setLicenseBackImage(newCam);
    } else if (INDEX == 2) {
      setInsuranceFrontImage(newCam);
    } else { }
    setLoading && setLoading(false)
  }

  const selectImage = async (index) => {
    const OnConfirm = () => {
      SetINDEX(index);
      setUploadModal(true);
      // OpenCamera()
    };

    if (Platform.OS == "ios") {
      CameraPermission(OnConfirm);
    } else {
      OnConfirm(index);
    }
  };

  const getDocsInfo = async () => {
    try {
      const getDocsInfoResponse = await GET_METHOD(
        "api/DMSRiderDetailAcc?riderId=" + userDetailDecrypted?.Id
      );

      if (getDocsInfoResponse && getDocsInfoResponse.riderId == userDetailDecrypted?.Id) {
        setLicenseFrontImageURL(getDocsInfoResponse.licenceImgFrontUrl);
        setLicenseBackImageURL1(getDocsInfoResponse.licenceBackImgUrl);
        setInsuranceFrontImageURL(getDocsInfoResponse.insurenceFrontImgUrl);
        setBackgroundCheckPdfURL(getDocsInfoResponse.criminalBGURL);
        setLicenseStatus(getDocsInfoResponse.statusLicenceImgUrl);
        setInsuranceStatus(getDocsInfoResponse.statusInsurenceImgUrl);
        if (
          getDocsInfoResponse.statusLicenceImgUrl == 0 ||
          getDocsInfoResponse.statusLicenceImgUrl == 1 ||
          getDocsInfoResponse.statusLicenceImgUrl == 3
        ) {
          setLicenseExpiry(new Date(getDocsInfoResponse.expiryLicenceImgUrl));
          setLicenseExpiry1(getDocsInfoResponse.expiryLicenceImgUrl);
        }
        if (
          getDocsInfoResponse.statusInsurenceImgUrl == 0 ||
          getDocsInfoResponse.statusInsurenceImgUrl == 1 ||
          getDocsInfoResponse.statusInsurenceImgUrl == 3

        ) {
          setInsuranceExpiry(new Date(getDocsInfoResponse.expiryInsurenceImgUrl));
          setInsuranceExpiry1(getDocsInfoResponse.expiryInsurenceImgUrl);
        }
        setLicenseDescription(getDocsInfoResponse.reasonLicenceImgUrl);
        setInsuranceDescription(getDocsInfoResponse.reasonInsurenceImgUrl);
        setBackgroundCheckDescription(getDocsInfoResponse.reasonCriminalBgUrl);
      } else {
        setmodalmsg("Unable to fetch documents data. Please try again later");
        seterrorModal(true);
      }
    } catch (error) {
      console.log("ERROR in getDocsInfo", error);
      setmodalmsg("Unknown error occurred. Please try again later");
      seterrorModal(true);
    }
  };

  useEffect(() => {
    getDocsInfoWithLoader();
  }, []);

  const getDocsInfoWithLoader = async () => {
    setIsBusy(true);
    await getDocsInfo();
    setIsBusy(false);
  };

  useEffect(() => {
    const GetUpdatedStatus = EventRegister.addEventListener(
      "DocumentsVerification",
      (data) => {
        getDocsInfoWithLoader();
      }
    );
    return () => {
      EventRegister?.removeEventListener(GetUpdatedStatus);
    };
  }, []);

  const openDateModal = (index) => {
    setExpiryFor(index);
    setIsDatePickerVisible(true);
  };

  const UploadDocumentBtn = ({
    label,
    status,
    expiry,
    description,
    URLLink,
    index,
    filePath,
    pdf,
    name,
    activeBtn
  }) => {
    return (
      <View style={styles.uploadDocumentBtnCon}>
        <View style={styles.uploadDocumentBtn}>
          <TouchableOpacity
            style={styles.uploadDocumentLoaderView}
            onPress={
              (status == 2 || status == 3) ? () => {
              index == 4 ? selectFile() : selectImage(index)
            } : () => {
              if (URLLink?.includes('.pdf')||URLLink?.includes('document')) {
                setShowImageFullPath(URLLink)
                setShowPdfFull(true)
              } else {
                console.log('URLLink',URLLink);
                setShowImageFullPath(URLLink)
                setShowImageFull(true)
              }
            }}
            // onPress={()=>{
            //   console.log(status,URLLink);
            // }}
          >
            <ActivityIndicator style={styles.uploadDocumentLoader} color={colors.theme} size={'small'} />
            <Image
                style={styles.uploadicons}
                source={URLLink?.includes('.document')||URLLink?.includes('.pdf') ?imagePath.pdf_ext: { uri: URLLink }}
                resizeMode={"contain"}
              />
            {/* {(index == 2) ? (
              <Image
                style={styles.uploadicons}
                source={URLLink?.includes('.document')||URLLink?.includes('.pdf') ?imagePath.pdf_ext: { uri: URLLink }}
                resizeMode={"contain"}
              />

            ) : (
              <FastImage
                style={styles.uploadicons}
                source={(status == 2 || status == 3 || status == 0 || status == 1) ? {
                  uri: URLLink,
                  priority: FastImage.priority.high,
                } : require("../../../assets/images/upload-file.png")}
                resizeMode={FastImage.resizeMode.contain}
              />
            )} */}


            {pdf && (
              <TextLabel
                ResponsiveFonts={ResponsiveFonts.textualStyles.smallBlodBlack}
                color={colors.black}
                label={'View'}
                alignSelf={'center'}
                marginTop={width * 0.02}
                textAlign={'center'}
                marginLeft={width * 0.02}
              />
            )}
          </TouchableOpacity>

          <View style={styles.uploadDocumentBtnCon1}>
            <TextLabel
              label={label}
              ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
              color={"#7b1e1f"}
            />
            {URLLink && (
              <TextLabel
                label={name.includes('cache') ? name?.split('/').pop() : name}
                ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                marginTop={5}
              />
            )}
            {label &&
              label.toLowerCase() != "Background Check - PDF".toLowerCase() && (
                <TextLabel
                  label={
                    "Expiry Date : " +
                    (expiry
                      ? StaticMethods.GetDateMonthYearString(expiry)
                      : "--/--/----") +
                    ""
                  }
                  ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                  marginTop={5}
                />
              )}
            <View style={[{ justifyContent: description && status == 2 ? 'space-between' : 'center' }, styles.uploadDocumentBtnCon2]}>
              <TextLabel
                label={`Status : ${status == 2
                  ? "Rejected"
                  : status == 1
                    ? "Approved"
                    : status == 3
                      ? "Expired"
                      : "Pending"
                  }`}
                ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                color={
                  status == 2 || status == 3
                    ? "red"
                    : status == 1
                      ? "green"
                      : "#D4AC0D"
                }
              />
              {description && status == 2 && (

                <TouchableOpacity
                  onPress={() => {
                    setmodalmsg(description || "not found")
                    seterrorModal(true)
                  }
                  }
                >
                  <Image
                    source={imagePath.InfoIcon}
                    resizeMode="contain"
                    style={styles.InfoIcon}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.row}>
              {(status == 2 || status == 3) && (
                <TouchableOpacity style={[{ backgroundColor: activeBtn ? "#005E82" : colors.theme }, styles.uploadDocumentBtnCon3]}
                  onPress={() => index == 4 ? selectFile() : selectImage(index)}>
                  <TextLabel
                    label={"Upload Document"}
                    ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                    color={"#fff"}
                  />
                </TouchableOpacity>
              )}

              {(status == 2 || status == 3) &&
                label &&
                label.toLowerCase() != "Background Check - PDF".toLowerCase() &&
                label.toLowerCase() != "License Back Image".toLowerCase() && (
                  <TouchableOpacity
                    style={[{ backgroundColor: expiry ? "#005E82" : colors.theme }, styles.uploadDocumentBtnCon4]}
                    onPress={() => openDateModal(index)}>
                    <TextLabel
                      label={expiry ? "Change Expiry" : "Set Expiry"}
                      ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                      color={"#fff"}
                    />
                  </TouchableOpacity>
                )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const fakeCall = async () => {
    return { data: { isFake: true } };
  };

  const DeleteAccount = () => {
    const OnScuess = () => {
      dispatch(LogOut());
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
      setmodalmsg("Can not logout at this time. Please try again later");
      setTimeout(() => {
        seterrorModal(true);

      }, 800);
    }
  }

  const resubmitDocs = async () => {
    try {
      setIsBusy(true);
      const docsUploadingArray = [];
      if (licenseFrontImage && licenseFrontImage.type != undefined) {
        docsUploadingArray.push(
          UPLOAD_FILE(licenseFrontImage, false, userDetailDecrypted?.ContactNum, 1)
        );
      } else {
        docsUploadingArray.push(fakeCall());
      }
      if (licenseBackImage && licenseBackImage.type != undefined) {
        docsUploadingArray.push(
          UPLOAD_FILE(licenseBackImage, false, userDetailDecrypted?.ContactNum, 1)
        );
      } else {
        docsUploadingArray.push(fakeCall());
      }
      if (insuranceFrontImage && insuranceFrontImage.type != undefined) {
        docsUploadingArray.push(
          UPLOAD_FILE(insuranceFrontImage, false, userDetailDecrypted?.ContactNum, 1)
        );
      } else {
        docsUploadingArray.push(fakeCall());
      }
      if (backgroundCheckPdf && backgroundCheckPdf?.fileCopyUri?.length > 1) {
        docsUploadingArray.push(
          UPLOAD_FILE(backgroundCheckPdf, true, userDetailDecrypted?.ContactNum, 1)
        );
      } else {
        docsUploadingArray.push(fakeCall());
      }
      const [
        LicenseImageFrontUrl,
        LicenseImageBackUrl,
        InsuranceImageFrontUrl,
        // InsuranceImageBackUrl,
        PoliceImageUrl,
      ] = await Promise.all(docsUploadingArray);

      var licenseImageFrontUrl_New = "";
      var licenseImageBackUrl_New = "";
      var InsuranceImageFrontUrl_New = "";
      var PoliceImageUrl_New = "";

      if (LicenseImageFrontUrl?.data?.isFake) {
        licenseImageFrontUrl_New = licenseFrontImageURL;
      } else {
        if (
          LicenseImageFrontUrl?.data?.status == "success" &&
          LicenseImageFrontUrl?.data?.message
        ) {
          // succeeded
          licenseImageFrontUrl_New = LicenseImageFrontUrl.data.message;
        } else {
          throw {
            message: "There's some issue in document upload. Please try later.",
          };
        }
      }

      if (LicenseImageBackUrl?.data?.isFake) {
        licenseImageBackUrl_New = licenseBackImageURL1;
      } else {
        if (
          LicenseImageBackUrl?.data?.status == "success" &&
          LicenseImageBackUrl?.data?.message
        ) {
          // succeeded
          licenseImageBackUrl_New = LicenseImageBackUrl.data.message;
        } else {
          // issue in file upload
          throw {
            message: "There's some issue in document upload. Please try later.",
          };
        }
      }

      if (InsuranceImageFrontUrl?.data?.isFake) {
        InsuranceImageFrontUrl_New = insuranceFrontImageURL;
      } else {
        if (
          InsuranceImageFrontUrl?.data?.status == "success" &&
          InsuranceImageFrontUrl?.data?.message
        ) {
          // succeeded
          InsuranceImageFrontUrl_New = InsuranceImageFrontUrl.data.message;
        } else {
          // issue in file upload
          throw {
            message: "There's some issue in document upload. Please try later.",
          };
        }
      }

      if (PoliceImageUrl?.data?.isFake) {
        PoliceImageUrl_New = backgroundCheckPdfURL;
      } else {
        if (
          PoliceImageUrl?.data?.status == "success" &&
          PoliceImageUrl?.data?.message
        ) {
          // succeeded
          PoliceImageUrl_New = PoliceImageUrl.data.message;
        } else {
          // issue in file upload
          throw {
            message: "There's some issue in document upload. Please try later.",
          };
        }
      }

      var dataToSend = {
        riderId: userDetailDecrypted?.Id,
        criminalBGURL: PoliceImageUrl_New,
        expiryCriminalBgUrl: new Date("2099-01-01").toISOString(),
        reasonCriminalBgUrl: backgroundCheckDescription,
        licenceImgFrontUrl: licenseImageFrontUrl_New,
        licenceBackImgUrl: licenseImageBackUrl_New,
        expiryLicenceImgUrl: !edit1 || !edit2 ? licenseExpiry1 : licenseExpiry
          ? licenseExpiry.toISOString()
          : new Date().toISOString(),
        reasonLicenceImgUrl: licenseDescription,
        insurenceFrontImgUrl: InsuranceImageFrontUrl_New,
        insurenceBackImgUrl: '',
        expiryInsurenceImgUrl: !edit3 ? insuranceExpiry1 : insuranceExpiry
          ? insuranceExpiry.toISOString()
          : new Date().toISOString(),
        reasonInsurenceImgUrl: insuranceDescription,
        statusCriminalBgUrl: 1,
        statusLicenceImgUrl: licenseStatus
          ? licenseStatus == 2 || licenseStatus == 3
            ? 0
            : licenseStatus
          : 0,
        statusInsurenceImgUrl: insuranceStatus
          ? insuranceStatus == 2 || insuranceStatus == 3
            ? 0
            : insuranceStatus
          : 0,
      };
      const resubmitResponse = await PUT_METHOD_AUTH(
        "/api/DMSRiderDetailAcc",
        State?.TokenId, // token
        dataToSend
      );

      if (resubmitResponse) {
        setLicenseFrontImageURL("");
        setLicenseBackImageURL1("");
        setInsuranceFrontImageURL("");
        setBackgroundCheckPdfURL("");
        setLicenseDescription("");
        setInsuranceDescription("");
        setBackgroundCheckDescription("");

        setLicenseExpiry(null);
        setInsuranceExpiry(null);
        setLicenseFrontImage(null);
        setLicenseBackImage(null);
        setInsuranceFrontImage(null);
        setBackgroundCheckPdf(null);

        setLicenseStatus(0);
        setInsuranceStatus(0);
        await getDocsInfo();
      } else {
        console.log("resubmitResponse failed. its else condition");
      }
    } catch (error) {
      console.log("ERROR in resubmitDocs", error);
    } finally {
      setIsBusy(false);
    }
  };

  const OpenGalleryFixed = () => {
    if (Platform.OS == 'ios' && IsUserAllowPermission != true) {
      confirmMediaPermission(OpenGallery, dispatch, IsUserAllowPermission)
    } else {
      OpenGallery()
    }
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#FFFF" }}>
        <HeaderAuth label={"Legal Documents"} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                getDocsInfoWithLoader();
                setIsRefreshing(false);
              }}
            />
          }
        >
          <TextLabel
            label={"UPLOADED DOCUMENTS"}
            textAlign={"left"}
            marginTop={20}
            marginLeft={20}
            ResponsiveFonts={ResponsiveFonts.textualStyles.large}
            alignSelf={"center"}
          />
          <UploadDocumentBtn
            label={"License Front Image"}
            status={licenseStatus}
            name={(licenseStatus == 2 || licenseStatus == 3) && licenseFrontImage?.name ?licenseFrontImage?.name:(licenseStatus == 2 || licenseStatus == 3) && licenseFrontImage?.uri ? licenseFrontImage?.uri.split('-').pop() : getNameUrl(licenseFrontImageURL)}
            URLLink={(licenseStatus == 2 || licenseStatus == 3) && licenseFrontImage?.uri ? licenseFrontImage?.uri : `${licenseFrontImageURL + SAS_TOKEN}`}
            description={licenseDescription}
            expiry={licenseExpiry}
            index={0}
            filePath={
              licenseFrontImage?.fileName == null && licenseFrontImage
                ? "File Selected"
                : licenseFrontImage?.fileName
            }
            activeBtn={(licenseStatus == 2 || licenseStatus == 3) && licenseFrontImage?.uri ? true : false}
          />
          <UploadDocumentBtn
            label={"License Back Image"}
            status={licenseStatus}
            name={(licenseStatus == 2 || licenseStatus == 3) && licenseBackImage?.name?licenseBackImage?.name :(licenseStatus == 2 || licenseStatus == 3) && licenseBackImage?.uri ? licenseBackImage?.uri.split('-').pop() : getNameUrl(licenseBackImageURL1)}
            URLLink={(licenseStatus == 2 || licenseStatus == 3) && licenseBackImage?.uri ? licenseBackImage?.uri : `${licenseBackImageURL1 + SAS_TOKEN}`}
            description={licenseDescription}
            expiry={licenseExpiry}
            index={1}
            filePath={
              licenseBackImage?.fileName == null && licenseBackImage
                ? "File Selected"
                : licenseBackImage?.fileName
            }
            activeBtn={(licenseStatus == 2 || licenseStatus == 3) && licenseBackImage?.uri ? true : false}

          />
          <UploadDocumentBtn
            label={"Vehicle Insurance Image"}
            status={insuranceStatus}
            name={(insuranceStatus == 2 || insuranceStatus == 3) && insuranceFrontImage?.name ?insuranceFrontImage?.name:(insuranceStatus == 2 || insuranceStatus == 3) && insuranceFrontImage?.uri ? insuranceFrontImage?.uri.split('-').pop() : getNameUrl(insuranceFrontImageURL)}
            URLLink={(insuranceStatus == 2 || insuranceStatus == 3) && insuranceFrontImage?.uri ? insuranceFrontImage?.uri : `${insuranceFrontImageURL + SAS_TOKEN}`}
            description={insuranceDescription}
            expiry={insuranceExpiry}
            index={2}
            filePath={
              insuranceFrontImage?.fileName == null && insuranceFrontImage
                ? "File Selected"
                : insuranceFrontImage?.fileName
            }
            activeBtn={(insuranceStatus == 2 || insuranceStatus == 3) && insuranceFrontImage?.uri ? true : false}

          />
        </ScrollView>

        {((licenseStatus == 2 ||
          licenseStatus == 3 ||
          insuranceStatus == 2 ||
          insuranceStatus == 3) &&
          (((licenseStatus == 2 || licenseStatus == 3) &&
            licenseFrontImage?.type != undefined &&
            licenseBackImage?.type != undefined) ||
            licenseStatus == 0 ||
            licenseStatus == 1) &&
          (((insuranceStatus == 2 || insuranceStatus == 3) &&
            insuranceFrontImage?.type != undefined) ||
            insuranceStatus == 0 ||
            insuranceStatus == 1) &&
          licenseExpiry &&
          insuranceExpiry)
          && (

            <CustomButton
              text="UPDATE"
              onPress={resubmitDocs}
              borderRadius={30}
              bgColor={
                (licenseStatus == 2 ||
                  licenseStatus == 3 ||
                  insuranceStatus == 2 ||
                  insuranceStatus == 3) &&
                  (((licenseStatus == 2 || licenseStatus == 3) &&
                    licenseFrontImage?.type != undefined &&
                    licenseBackImage?.type != undefined) ||
                    licenseStatus == 0 ||
                    licenseStatus == 1) &&
                  (((insuranceStatus == 2 || insuranceStatus == 3) &&
                    insuranceFrontImage?.type != undefined) ||
                    insuranceStatus == 0 ||
                    insuranceStatus == 1) &&
                  licenseExpiry &&
                  insuranceExpiry
                  ? colors.theme
                  : colors.blackOpacity50
              }
              marginTop={10}
              disabled={
                (licenseStatus == 2 ||
                  licenseStatus == 3 ||
                  insuranceStatus == 2 ||
                  insuranceStatus == 3) &&
                  (((licenseStatus == 2 || licenseStatus == 3) &&
                    licenseFrontImage?.type != undefined &&
                    licenseBackImage?.type != undefined) ||
                    licenseStatus == 0 ||
                    licenseStatus == 1) &&
                  (((insuranceStatus == 2 || insuranceStatus == 3) &&
                    insuranceFrontImage?.type != undefined) ||
                    insuranceStatus == 0 ||
                    insuranceStatus == 1) &&
                  licenseExpiry &&
                  insuranceExpiry
                  ? false
                  : true
              }
              marginBottom={10}
              fgColor={colors.white}
            />
          )}

        <DateTimePickerModal
          minimumDate={previousDay}
          isVisible={isDatePickerVisible}
          date={previousDay}
          display={Platform.OS == "android" ? "default" : "inline"}
          mode="date"
          onConfirm={updateExpiry}
          onCancel={() => {
            setIsDatePickerVisible(false);
          }}
        />


        {cameraModal && (
          <CameraView CameraSelect={CameraSelect} setCameraModal={setCameraModal} index={INDEX} />
        )}
        <ImageViewModal
          showImageFull={showImageFull}
          setShowImageFull={setShowImageFull}
          showImageFullPath={showImageFullPath}
        />
        <PdfViewModal
          showPdfFull={showPdfFull}
          setShowPdfFull={setShowPdfFull}
          source={showImageFullPath}
        />
      </View>



      {isBusy && (
        <AnimatedModal visible={isBusy} onClose={() => { setIsBusy(false) }} >
          <Loader />
        </AnimatedModal>
      )}

      {UploadModal && (
        <AnimatedModal visible={UploadModal} onClose={() => { setUploadModal(false) }} >
          <UploadMOdal
            setValue={setUploadModal}
            OnCamera={() => OpenCamera()}
            OnGallery={() => OpenGalleryFixed()}
            onPdf={()=>openPdfPicker()}
          />
        </AnimatedModal>
      )}

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
            heading={'Are you sure you want delete account?'}
            btnTittle={"Yes"}
            OnPress={() => DeleteAccount()}
            noOp={() => seterrorModal1(false)}
          />
        </AnimatedModal>
      )}
    </>
  );
};

export default LegalDocumentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  image: {
    width: "50%",
    height: verticalScale(100),
    alignSelf: "center",
  },
  loginView: {
    width: "95%",
    alignSelf: "center",
    justifyContent: "space-between",
  },
  scrollView: {
    backgroundColor: colors.white,
    height: height,
    flexGrow: 1,
  },
  uploadDocumentBtn: {
    shadowColor: "#000",
    shadowOffset: {
      width: 12,
      height: 0,
    },
    elevation: 5,
    borderColor: "#7b1e1f",
    borderWidth: 1,
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 20,
    paddingHorizontal: width * 0.01,
    paddingVertical: width * 0.02,
  },
  uploadicons: {
    width: moderateScale(60),
    height: verticalScale(60),
    marginLeft: 15
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  InfoIcon: {
    height: 20,
    width: 20,
  },
  row2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 10,
  },
  uploadDocumentBtnCon: {
    marginBottom: 5
  },
  uploadDocumentLoaderView: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  },
  uploadDocumentLoader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 15,
    right: 0
  },
  uploadDocumentBtnCon1: {
    alignItems: "center",
    marginTop: verticalScale(10),
    paddingRight: 15,
    flex: 5,
  },

  uploadDocumentBtnCon2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    width: '62%',
  },
  uploadDocumentBtnCon3: {
    paddingHorizontal: 10,
    borderRadius: 20,
    paddingVertical: 5,
  },
  uploadDocumentBtnCon4: {
    paddingHorizontal: 10,
    borderRadius: 20,
    paddingVertical: 5,
    marginLeft: 2
  }
});