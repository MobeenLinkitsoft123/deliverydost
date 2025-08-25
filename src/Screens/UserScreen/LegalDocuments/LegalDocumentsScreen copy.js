import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Linking,
  Alert,
  Platform,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";

import HeaderAuth from "../../../Components/HeaderAuth/HeaderAuth";
import DocumentPicker from "react-native-document-picker";
import TextLabel from "../../../Components/TextLabel/TextLable";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import colors from "../../../styles/colors";
import {
  moderateScale,
  verticalScale,
  height,
  width,
} from "../../../styles/responsiveSize";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { SAS_TOKEN } from "@env"

import {
  GET_METHOD,
  PUT_METHOD_AUTH,
} from "../../../utils/ApiCallingMachnisem";
import { useSelector } from "react-redux";
import { StaticMethods } from "../../../utils/StaticMethods";
import { UPLOAD_FILE } from "../../../Store/Action/AuthFunctions";
import imagePath from "../../../constants/imagePath";
import CustomModal from "../../../Components/Modals/CustomModa";
import Loader from "../../../Components/Modals/Modals/Loader";
import { CameraPermission } from "../../../utils/permissions";
import UploadMOdal from "../../../Components/Modals/Modals/UploadModal";
import { UserDetail } from "../../../Store/Reducers/AuthReducer/AuthReducer";
import ModalPattern1 from "../../../Components/Modals/Modals/ModalPattern1";
import ImageViewModal from "../../../Components/NewBidsModalize/ImageViewModal";
import PdfViewModal from "../../../Components/NewBidsModalize/PdfViewModal";
import { getNameUrl } from "../../../Store/Action/HelperActions";

const LegalDocumentsScreen = () => {
  const { Id, ContactNum } = useSelector(
    (state) => state?.AuthReducer?.UserDetail
  );

  const State = useSelector((state) => state?.AuthReducer);


  const [licenseFrontImageURL, setLicenseFrontImageURL] = useState("");
  const [licenseBackImageURL, setLicenseBackImageURL] = useState("");
  const [insuranceFrontImageURL, setInsuranceFrontImageURL] = useState("");
  // const [insuranceBackImageURL, setInsuranceBackImageURL] = useState("");
  const [backgroundCheckPdfURL, setBackgroundCheckPdfURL] = useState("");
  const [licenseDescription, setLicenseDescription] = useState("");
  const [insuranceDescription, setInsuranceDescription] = useState("");
  const [backgroundCheckDescription, setBackgroundCheckDescription] =
    useState("");

  const [licenseExpiry, setLicenseExpiry] = useState(null);
  const [insuranceExpiry, setInsuranceExpiry] = useState(null);
  // const [backgroundCheckExpiry, setBackgroundCheckExpiry] = useState(null);
  const [licenseFrontImage, setLicenseFrontImage] = useState(null);
  const [licenseBackImage, setLicenseBackImage] = useState(null);
  const [insuranceFrontImage, setInsuranceFrontImage] = useState(null);
  // const [insuranceBackImage, setInsuranceBackImage] = useState(null);
  const [backgroundCheckPdf, setBackgroundCheckPdf] = useState(null);
  // const [docInfoResponse, setDocInfoResponse] = useState(null);

  const [licenseStatus, setLicenseStatus] = useState(0);
  const [insuranceStatus, setInsuranceStatus] = useState(0);
  const [backgroundCheckStatus, setBackgroundCheckStatus] = useState(0);
  const [expiryFor, setExpiryFor] = useState(0);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [UploadModal, setUploadModal] = useState(false);
  const [INDEX, SetINDEX] = useState(9);
  const [modalMsg, setmodalmsg] = useState("");
  const [errorModal, seterrorModal] = useState(false);
  const [showImageFull, setShowImageFull] = useState(false)
  const [showImageFullPath, setShowImageFullPath] = useState('')
  const [showPdfFull, setShowPdfFull] = useState(false)

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
    } else if (expiryFor == 2 || expiryFor == 3) {
      setInsuranceExpiry(event);
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

  const OpenGallery = async () => {
    const result = await launchImageLibrary(options);
    const imageSizeLimit = 5 * 1024 * 1024
    if (result?.assets[0].fileSize <= imageSizeLimit) {
      if (result?.assets) {
        if (INDEX == 0) {
          setLicenseFrontImage(result?.assets[0]);
        } else if (INDEX == 1) {
          setLicenseBackImage(result?.assets[0]);
        } else if (INDEX == 2) {
          setInsuranceFrontImage(result?.assets[0]);
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
    const result = await launchCamera(options);
    const imageSizeLimit = 5 * 1024 * 1024
    if (result?.assets[0].fileSize <= imageSizeLimit) {
      if (result?.assets) {
        if (INDEX == 0) {
          setLicenseFrontImage(result?.assets[0]);
        } else if (INDEX == 1) {
          setLicenseBackImage(result?.assets[0]);
        } else if (INDEX == 2) {
          setInsuranceFrontImage(result?.assets[0]);
        } else {
          // setInsuranceBackImage(response);
        }
      }
    } else {
      setmodalmsg("File size should be less than 5mb.");
      seterrorModal(true)
    }


  };

  const selectImage = async (index) => {
    const OnConfirm = () => {
      SetINDEX(index);
      setUploadModal(true);
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
        "api/DMSRiderDetailAcc?riderId=" + Id
      );
      if (getDocsInfoResponse && getDocsInfoResponse.riderId == Id) {
        // setDocInfoResponse(getDocsInfoResponse);

        setLicenseFrontImageURL(getDocsInfoResponse.licenceImgFrontUrl);
        setLicenseBackImageURL(getDocsInfoResponse.licenceBackImgUrl);
        setInsuranceFrontImageURL(getDocsInfoResponse.insurenceFrontImgUrl);
        // setInsuranceBackImageURL(getDocsInfoResponse.insurenceBackImgUrl);
        setBackgroundCheckPdfURL(getDocsInfoResponse.criminalBGURL);

        setLicenseStatus(getDocsInfoResponse.statusLicenceImgUrl);
        setInsuranceStatus(getDocsInfoResponse.statusInsurenceImgUrl);
        setBackgroundCheckStatus(getDocsInfoResponse.statusCriminalBgUrl);

        if (
          getDocsInfoResponse.statusLicenceImgUrl == 0 ||
          getDocsInfoResponse.statusLicenceImgUrl == 1
        ) {
          setLicenseExpiry(new Date(getDocsInfoResponse.expiryLicenceImgUrl));
        }
        if (
          getDocsInfoResponse.statusInsurenceImgUrl == 0 ||
          getDocsInfoResponse.statusInsurenceImgUrl == 1
        ) {
          setInsuranceExpiry(
            new Date(getDocsInfoResponse.expiryInsurenceImgUrl)
          );
        }
        // if (
        //   getDocsInfoResponse.statusCriminalBgUrl == 0 ||
        //   getDocsInfoResponse.statusCriminalBgUrl == 1
        // ) {
        //   setBackgroundCheckExpiry(
        //     new Date(getDocsInfoResponse.expiryCriminalBgUrl)
        //   );
        // }

        setLicenseDescription(getDocsInfoResponse.reasonLicenceImgUrl);
        setInsuranceDescription(getDocsInfoResponse.reasonInsurenceImgUrl);
        setBackgroundCheckDescription(getDocsInfoResponse.reasonCriminalBgUrl);
      } else {
        setmodalmsg("Unable to fetch documents data. Please try again later");
        seterrorModal(true);
        // Alert.alert(
        //   "Error",
        //   "Unable to fetch documents data. Please try again later"
        // );
      }
    } catch (error) {
      console.log("ERROR in getDocsInfo", error);
      setmodalmsg("Unknown error occurred. Please try again later");
      seterrorModal(true);
      // Alert.alert("Error", "Unknown error occurred. Please try again later");
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
      <View style={{ marginBottom: 5 }}>
        <View style={styles.uploadDocumentBtn}>
          <TouchableOpacity
            onPress={(status == 2 || status == 3) ? () => {
              index == 4 ? selectFile() : selectImage(index)
            } : () => {
              if (pdf) {
                setShowImageFullPath(URLLink)
                setShowPdfFull(true)
              } else {
                setShowImageFullPath(URLLink)
                setShowImageFull(true)

              }
            }}
            style={{
              flex: 1,
              alignItems: "flex-start",
              justifyContent: 'center',
              // backgroundColor: "green",
            }}
          >
            <ActivityIndicator style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }}
              color={colors.theme}
              size={'small'}
            />
            <Image
              style={styles.uploadicons}
              // source={{ uri: insuranceFrontImage?.uri }}
              // source={
              //   (pdf && index == 4) ? imagePath.pdf_ext :
              //     (status == 2 || status == 3) && licenseFrontImage ? { uri: licenseFrontImage?.uri } :
              //       (status == 2 || status == 3) && licenseBackImage ? { uri: licenseBackImage?.uri } :
              //         (status == 2 || status == 3) && insuranceFrontImage ? { uri: insuranceFrontImage?.uri }
              //           : (status == 2 || status == 3) ? require("../../../assets/images/upload-file.png") : { uri: URLLink }
              // }
              source={
                (pdf && index == 4) ? imagePath.pdf_ext : (status !== 2 || status !== 3) ? { uri: URLLink } : require("../../../assets/images/upload-file.png")
              }
              resizeMode={"contain"}
            />
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

          <View
            style={{
              alignItems: "center",
              marginTop: verticalScale(10),
              paddingRight: 15,
              flex: 5,
            }}
          >
            <TextLabel
              label={label}
              ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
              color={"#7b1e1f"}
            />
            {URLLink && (
              <TextLabel
                label={name}
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
            <View style={{
              flexDirection: 'row',
              justifyContent: description && status == 2 ? 'space-between' : 'center',
              alignItems: 'center',
              marginTop: 5,
              width: '62%',

            }}>
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
                // marginTop={5}
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
                    // Alert.alert("Rejection reason", description || "not found")
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

            {/* {URLLink && (
              <TouchableOpacity
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  paddingHorizontal: 15,
                  borderRadius: 20,
                  paddingVertical: 5,
                  marginTop: 5,
                }}
                onPress={() => {
                  // open url in browser
                  try {
                    Linking.openURL(URLLink);
                  } catch (error) {
                    console.log("ERROR while opening URL", error);
                  }
                }}
              >
                <TextLabel
                  label={"View uploaded document"}
                  ResponsiveFonts={ResponsiveFonts.textualStyles.mediumNormal}
                  color={"#ffffff"}
                // textDecorationLine={"underline"}
                />
              </TouchableOpacity>
            )} */}

            <View
              style={[
                styles.row,
                // { marginRight: 20, justifyContent: "space-between" },
              ]}
            >
              {(status == 2 || status == 3) && (
                <TouchableOpacity
                  style={{
                    backgroundColor: activeBtn ? "#005E82" : colors.theme,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    paddingVertical: 5,
                  }}
                  onPress={() =>
                    index == 4 ? selectFile() : selectImage(index)
                  }
                >
                  <TextLabel
                    label={"Upload Document"}
                    ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                    // color={"#3366CC"}
                    color={"#fff"}
                  // textDecorationLine={"underline"}
                  />
                </TouchableOpacity>
              )}

              {(status == 2 || status == 3) &&
                label &&
                label.toLowerCase() != "Background Check - PDF".toLowerCase() &&
                label.toLowerCase() != "License Back Image".toLowerCase() && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: expiry ? "#005E82" : colors.theme,
                      paddingHorizontal: 10,
                      borderRadius: 20,
                      paddingVertical: 5,
                      marginLeft: 2,
                    }}
                    onPress={() => openDateModal(index)}
                  >
                    <TextLabel
                      label={"Set Expiry"}
                      ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                      color={"#fff"}
                    // textDecorationLine={"underline"}
                    />
                  </TouchableOpacity>
                )}
            </View>
          </View>
        </View>
        {/* {description && status == 2 && (
          <View style={styles.row2}>
            <TextLabel
              label={description}
              ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
              width={"90%"}
              numOfLine={1}
              alignSelf={"center"}
              textAlign={"center"}
              color={"red"}
              marginTop={10}
            />
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Rejection reason", description || "not found")
              }
            >
              <Image
                source={imagePath.InfoIcon}
                resizeMode="contain"
                style={styles.InfoIcon}
              />
            </TouchableOpacity>
          </View>
        )} */}
      </View>
    );
  };

  const fakeCall = async () => {
    return { data: { isFake: true } };
  };

  const UploadDocuments23 = () => {
    UPLOAD_FILE(backgroundCheckPdf, true, ContactNum).then((e) => {
    });
  };

  const resubmitDocs = async () => {
    try {
      setIsBusy(true);
      const docsUploadingArray = [];
      if (licenseFrontImage && licenseFrontImage.type != undefined) {
        docsUploadingArray.push(
          UPLOAD_FILE(licenseFrontImage, false, ContactNum, 1)
        );
      } else {
        docsUploadingArray.push(fakeCall());
      }
      if (licenseBackImage && licenseBackImage.type != undefined) {
        docsUploadingArray.push(
          UPLOAD_FILE(licenseBackImage, false, ContactNum, 1)
        );
      } else {
        docsUploadingArray.push(fakeCall());
      }
      if (insuranceFrontImage && insuranceFrontImage.type != undefined) {
        docsUploadingArray.push(
          UPLOAD_FILE(insuranceFrontImage, false, ContactNum, 1)
        );
      } else {
        docsUploadingArray.push(fakeCall());
      }
      if (backgroundCheckPdf && backgroundCheckPdf?.fileCopyUri?.length > 1) {
        docsUploadingArray.push(
          UPLOAD_FILE(backgroundCheckPdf, true, ContactNum, 1)
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
      // var InsuranceImageBackUrl_New = "";
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
          // issue in file upload
          throw {
            message: "There's some issue in document upload. Please try later.",
          };
        }
      }

      if (LicenseImageBackUrl?.data?.isFake) {
        licenseImageBackUrl_New = licenseBackImageURL;
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

      // if (InsuranceImageBackUrl?.data?.isFake) {
      //   InsuranceImageBackUrl_New = insuranceBackImageURL;
      // } else {
      //   if (
      //     InsuranceImageBackUrl?.data?.status == "success" &&
      //     InsuranceImageBackUrl?.data?.message
      //   ) {
      //     // succeeded
      //     InsuranceImageBackUrl_New = InsuranceImageBackUrl.data.message;
      //   } else {
      //     // issue in file upload
      //     throw {
      //       message: "There's some issue in document upload. Please try later.",
      //     };
      //   }
      // }

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
        riderId: Id,
        criminalBGURL: PoliceImageUrl_New,
        // expiryCriminalBgUrl: backgroundCheckExpiry
        //   ? backgroundCheckExpiry.toISOString()
        //   : new Date().toISOString(),
        expiryCriminalBgUrl: new Date("2099-01-01").toISOString(),
        reasonCriminalBgUrl: backgroundCheckDescription,
        licenceImgFrontUrl: licenseImageFrontUrl_New,
        licenceBackImgUrl: licenseImageBackUrl_New,
        expiryLicenceImgUrl: licenseExpiry
          ? licenseExpiry.toISOString()
          : new Date().toISOString(),
        reasonLicenceImgUrl: licenseDescription,
        insurenceFrontImgUrl: InsuranceImageFrontUrl_New,
        // insurenceBackImgUrl: InsuranceImageBackUrl_New,
        insurenceBackImgUrl: InsuranceImageFrontUrl_New,
        expiryInsurenceImgUrl: insuranceExpiry
          ? insuranceExpiry.toISOString()
          : new Date().toISOString(),
        reasonInsurenceImgUrl: insuranceDescription,
        statusCriminalBgUrl: backgroundCheckStatus
          ? backgroundCheckStatus == 2 || backgroundCheckStatus == 3
            ? 0
            : backgroundCheckStatus
          : 0,
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
        setLicenseBackImageURL("");
        setInsuranceFrontImageURL("");
        // setInsuranceBackImageURL("");
        setBackgroundCheckPdfURL("");
        setLicenseDescription("");
        setInsuranceDescription("");
        setBackgroundCheckDescription("");

        setLicenseExpiry(null);
        setInsuranceExpiry(null);
        // setBackgroundCheckExpiry(null);
        setLicenseFrontImage(null);
        setLicenseBackImage(null);
        setInsuranceFrontImage(null);
        // setInsuranceBackImage(null);
        setBackgroundCheckPdf(null);

        setLicenseStatus(0);
        setInsuranceStatus(0);
        setBackgroundCheckStatus(0);
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

  return (
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
          // URLLink={licenseFrontImageURL}
          name={(licenseStatus == 2 || licenseStatus == 3) && licenseFrontImage?.uri ? licenseFrontImage?.uri.split('-').pop() : getNameUrl(licenseFrontImageURL)}
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
          // URLLink={licenseBackImageURL}
          name={(licenseStatus == 2 || licenseStatus == 3) && licenseBackImage?.uri ? licenseBackImage?.uri.split('-').pop() : getNameUrl(licenseFrontImageURL)}
          URLLink={(licenseStatus == 2 || licenseStatus == 3) && licenseBackImage?.uri ? licenseBackImage?.uri : `${licenseBackImageURL + SAS_TOKEN}`}
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
          // URLLink={insuranceFrontImageURL}
          name={(insuranceStatus == 2 || insuranceStatus == 3) && insuranceFrontImage?.uri ? insuranceFrontImage?.uri.split('-').pop() : getNameUrl(licenseFrontImageURL)}
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
        {/* <UploadDocumentBtn
          label={"Insurance Back Image"}
          status={insuranceStatus}
          URLLink={insuranceBackImageURL}
          description={insuranceDescription}
          expiry={insuranceExpiry}
          index={3}
          filePath={
            insuranceBackImage?.fileName == null && insuranceBackImage
              ? "File Selected"
              : insuranceBackImage?.fileName
          }
        /> */}
        <UploadDocumentBtn
          label={"Background Check - PDF"}
          status={backgroundCheckStatus}
          // URLLink={backgroundCheckPdfURL}
          URLLink={(backgroundCheckStatus == 2 || backgroundCheckStatus == 3) && backgroundCheckPdf?.name ? backgroundCheckPdf?.uri : `${backgroundCheckPdfURL + SAS_TOKEN}`}
          name={(backgroundCheckStatus == 2 || backgroundCheckStatus == 3) && backgroundCheckPdf?.name ? backgroundCheckPdf?.name : getNameUrl(backgroundCheckPdfURL)}
          description={backgroundCheckDescription}
          pdf={true}
          // expiry={backgroundCheckExpiry}
          index={4}
          filePath={
            backgroundCheckPdf?.name == null && backgroundCheckPdf
              ? "File Selected"
              : backgroundCheckPdf?.name
          }
          activeBtn={(backgroundCheckStatus == 2 || backgroundCheckStatus == 3) && backgroundCheckPdf?.uri ? true : false}
        />
      </ScrollView>
      {(insuranceStatus !== 0 || backgroundCheckStatus !== 0 || licenseStatus !== 0) && (

        <CustomButton
          text="UPDATE"
          onPress={resubmitDocs}
          borderRadius={30}
          // bgColor={'red'}
          bgColor={
            (licenseStatus == 2 ||
              licenseStatus == 3 ||
              insuranceStatus == 2 ||
              insuranceStatus == 3 ||
              backgroundCheckStatus == 2 ||
              backgroundCheckStatus == 3) &&
              (((licenseStatus == 2 || licenseStatus == 3) &&
                licenseFrontImage?.type != undefined &&
                licenseBackImage?.type != undefined) ||
                licenseStatus == 0 ||
                licenseStatus == 1) &&
              (((insuranceStatus == 2 || insuranceStatus == 3) &&
                insuranceFrontImage?.type != undefined) ||
                insuranceStatus == 0 ||
                insuranceStatus == 1) &&
              (((backgroundCheckStatus == 2 || backgroundCheckStatus == 3) &&
                backgroundCheckPdf?.fileCopyUri?.length > 1) ||
                backgroundCheckStatus == 0 ||
                backgroundCheckStatus == 1) &&
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
              insuranceStatus == 3 ||
              backgroundCheckStatus == 2 ||
              backgroundCheckStatus == 3) &&
              (((licenseStatus == 2 || licenseStatus == 3) &&
                licenseFrontImage?.type != undefined &&
                licenseBackImage?.type != undefined) ||
                licenseStatus == 0 ||
                licenseStatus == 1) &&
              (((insuranceStatus == 2 || insuranceStatus == 3) &&
                insuranceFrontImage?.type != undefined) ||
                insuranceStatus == 0 ||
                insuranceStatus == 1) &&
              (((backgroundCheckStatus == 2 || backgroundCheckStatus == 3) &&
                backgroundCheckPdf?.fileCopyUri?.length > 1) ||
                backgroundCheckStatus == 0 ||
                backgroundCheckStatus == 1) &&
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

      <CustomModal
        value={isBusy}
        setValue={setIsBusy}
        HideOnBackDropPress={false}
      >
        <Loader />
      </CustomModal>

      {UploadModal && (
        <CustomModal
          value={UploadModal}
          setValue={setUploadModal}
          HideOnBackDropPress={true}
        >
          <UploadMOdal
            setValue={setUploadModal}
            OnCamera={() => OpenCamera()}
            OnGallery={() => OpenGallery()}
          />
        </CustomModal>
      )}

      {errorModal && (
        <CustomModal
          value={errorModal}
          setValue={seterrorModal}
          HideOnBackDropPress={false}
        >
          <ModalPattern1
            setValue={seterrorModal}
            heading={modalMsg}
            btnTittle={"Okay"}
            OnPress={() => {
              setmodalmsg("");
              seterrorModal(false);
            }}
          />
        </CustomModal>
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
    // height: verticalScale(2500),
    display: "flex",
    flexDirection: "row",
    // justifyContent: "flex-start",
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
    // marginRight: 10,
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
});
