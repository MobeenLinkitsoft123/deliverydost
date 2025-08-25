import {
  LoginUser,
  UserDetail,
  TokenId,
  RemamberUser,
  LogOut1,
} from "../Reducers/AuthReducer/AuthReducer";
import { EmailValidates, PasswordValidation, validatePassword } from "../../utils/helperFunctions";
import {
  GET_METHOD,
  GETPHONE,
  POST_METHOD,
  GET_METHOD_AUTH,
  API,
  PUT_METHOD_AUTH,
} from "../../utils/ApiCallingMachnisem";
import DeviceInfo from "react-native-device-info";
import { Alert, Keyboard, Platform } from "react-native";
import axios from "axios";
import { APP_CHECK_VERSION_ANDROID, APP_CHECK_VERSION_IOS } from "@env"
import { UserOnlineStatusHandler } from "./DashboardActions";
import BackgroundService from 'react-native-background-actions';
import { stopBgLocation } from "../../utils/BgLocationService";
import { encryptVal } from "../../utils/Crypto";
import { FirstLogin } from "../Reducers/AppReducer/AppReducer";
import { getISOFormattedDateWithGMT } from "./AppFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteTokenFCM } from "../../services/NotificationServices/notificationHelper";

const Auth_Login = async (
  password,
  email,
  LoginRemember,
  setshowModal,
  setmodalmsg,
  setLoading,
  dispatch,
  token
) => {
  Keyboard.dismiss();
  let UniqueId = await DeviceInfo.getUniqueId();
  const isCorrectemail = EmailValidates(email);

  if (
    email?.length != undefined &&
    email?.length > 0 &&
    password?.length != undefined &&
    password?.length > 0
  ) {
    if (LoginRemember) {
      dispatch(RemamberUser({ password, email }));
    } else {
      dispatch(RemamberUser({}));
    }

    try {
      if (isCorrectemail == true) {
        setLoading(true);
        POST_METHOD(`api/DMSRiderAcc?deviceId=${UniqueId}&fcmToken=${token}`, {
          username: email,
          password: password
        })
          .then(async (result) => {
            const data = result && JSON.parse(result)
            if (data.ContactNum != undefined && data?.Email != undefined) {
              setTimeout(() => {
                dispatch(TokenId(data?.token));
                dispatch(UserDetail(data));
                dispatch(LoginUser(true));
              }, 600);
            } else {
              setmodalmsg("Invalid credentials");
              setshowModal(true);
            }
            setLoading(false);
          })
          .catch((error) => {
            console.log('error', error)
            setshowModal(true);
            setmodalmsg("Some thing went wrong try again");
            setLoading(false);
            console.log("Login APi", error);
          });
      } else {
        setshowModal(true);
        setmodalmsg("Please enter a valid email !");
      }
    } catch (error) {
      setLoading(false);
      setshowModal(true);
      setmodalmsg("Some thing went wrong try again");
      console.log("Login APi", error);
    }
  } else {
    setshowModal(true);
    setmodalmsg("All fields are required");
  }
};

const versionCheck = async (
  setState
) => {
  GET_METHOD(`api/Values?version=${Platform.OS == 'ios' ? APP_CHECK_VERSION_IOS : APP_CHECK_VERSION_ANDROID}&platform=${Platform.OS}&app=dms`)
    .then(async (result) => {
      if (result == 0) {
        setState(true)
      } else {
        setState(false)
      }

    })
    .catch((error) => {
      console.log('error', error)

    });
};

const CheckPhoneNumber = async (
  phoneNumber,
  navigate,
  setLoading,
  setshowModal,
  setmodalmsg,
  type
) => {
  if (phoneNumber?.length != undefined && phoneNumber?.length > 0) {
    const phoneNumberFinal = phoneNumber?.replace("+", "");

    setLoading(true);
    GET_METHOD(`api/DMSRiderAcc?phone=${phoneNumberFinal}`)
      .then((res) => {
        let UserId = res?.ID;
        setLoading(false);

        if (UserId != undefined && type != "signup") {
          SendOtpToPhone(
            phoneNumberFinal,
            navigate,
            setLoading,
            setshowModal,
            setmodalmsg,
            UserId
          );
        } else {
          if (UserId) {
            setLoading(false);
            setshowModal(true);
            setmodalmsg("This phone number already exist");
          } else {
            if (type == "signup") {
              SendOtpToPhone(
                phoneNumberFinal,
                navigate,
                setLoading,
                setshowModal,
                setmodalmsg,
                UserId
              );
            } else {
              setLoading(false);
              setshowModal(true);
              setmodalmsg("This phone number doesn't exist");
            }
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("CheckPhoneNumber APi", error);
      });
  } else {
    setshowModal(true);
    setmodalmsg("Phone number is required");
  }
};

const SendOtpToPhone = (
  phoneNumber,
  navigate,
  setLoading,
  setshowModal,
  setmodalmsg,
  UserId
) => {
  GETPHONE(`/SendTacAPI.aspx?phone=${phoneNumber}`)
    .then((res) => {

      if (res?.slice(0, 8) === "codesent") {
        navigate && navigate(UserId);
      } else if (res?.slice(0, 8) == '<!DOCTYP') {
        setmodalmsg("Please try again, after sometime.");
        setshowModal(true);
      } else {
        setmodalmsg("Invalid Phone number.");
        setshowModal(true);
      }
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      console.log("SendOtpToPhone APi", error);
    });
};

const VerifyOtp = (
  phoneNumber,
  code,
  navigate,
  setLoading,
  setshowModal,
  setmodalmsg,
  setotp
) => {
  setLoading(true);
  Keyboard.dismiss();

  GETPHONE(`SendTacAPI.aspx?phone=${phoneNumber}&verifiycode=${code}`)
    .then((res) => {
      if (res.slice(0, 8) === "approved") {
        navigate();
      } else {
        setshowModal(true);
        setmodalmsg("Invalid code verification failed.");
      }
      setLoading(false);
      setotp();
      // navigate();
    })
    .catch((error) => {
      setLoading(false);
      console.log("VerifyOtp APi", error);
    });
};

const CreateNewPassword = (
  RouteData,
  password,
  password2,
  handleNavigation,
  setLoading,
  setshowModal,
  setmodalmsg,
  dispatch
) => {
  if (
    password?.length > 5 &&
    password?.length < 31 &&
    password == password2
  ) {
    setLoading(true);
    POST_METHOD(`api/DMSRiderAcc?uid=${RouteData?.UserId}`, {
      password: password
    })
      .then((res) => {
        const data = res && JSON?.parse(res)
        setLoading(false);
        if (data.status == 0) {
          dispatch(RemamberUser({}));
          handleNavigation();
        } else if (data.status == 1) {
          setshowModal(true);
          setmodalmsg("Old password cannot be used, Please set new password");
        } else {
          setshowModal(true);
          setmodalmsg(data?.Message);
        }
      })
      .catch((error) => {
        setLoading(false);
        return console.error(error);
      });
  } else {
    setLoading(false);
    if (password?.length < 6 || password?.length > 30) {
      setmodalmsg(
        "Password must be at least 6 characters long and at most 30 characters"
      );
      setshowModal(true);
    } else if (password != password2) {
      setmodalmsg("Password and confirm password did not match");
      setshowModal(true);
    } else {
      setmodalmsg("Kindly Provide accurate data");
      setshowModal(true);
    }
  }
};

const CreateAccountStep1 = (
  setLoading,
  firstname,
  lastname,
  phone,
  ssnNumber,
  setshowModal,
  setmodalmsg,
  gender,
  OnSuccess
) => {
  try {


    if (
      firstname?.trim()?.length != undefined &&
      firstname?.trim()?.length > 0 &&
      lastname?.trim()?.length != undefined &&
      lastname?.trim()?.length > 0 &&
      phone?.length != undefined &&
      phone?.length > 0 &&
      gender?.length != undefined &&
      gender?.length > 0
      //  &&
      // ssnNumber?.length != undefined &&
      // ssnNumber?.length > 0

    ) {
      // if (phone?.length < 6) {
      //   setmodalmsg("Invalid Phone number.");
      //   setshowModal(true);
      //   return 0
      // }
      setLoading(true);
      GET_METHOD(`api/DMSRiderAcc?phone=${phone}`)
        .then((res) => {
          let UserId = res?.ID;
          if (res.status == 1) {
            SendOtpToPhone(
              phone,
              OnSuccess,
              setLoading,
              setshowModal,
              setmodalmsg,
              UserId
            );
          } else {
            setLoading(false);
            setmodalmsg("This phone number already exist");
            setshowModal(true);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("CheckPhoneNumber APi", error);
        });
    } else {
      setmodalmsg("All fields are required");
      setshowModal(true);
    }
  } catch (error) {
    setLoading(false);
    console.log("error", error);
  }
};

const CreateAccountStep3 = (navigation, email, pass, pass1, setshowModal, setmodalmsg, RouteState, setLoading) => {
  const trimmedEmail = email?.trim();
  const trimmedPass = pass?.trim();
  const trimmedPass1 = pass1?.trim();

  // Check if all fields are filled
  if (!trimmedEmail) {
    setmodalmsg("Email is required.");
    setshowModal(true);
    return;
  }

  // Validate email format
  const isCorrectEmail = EmailValidates(trimmedEmail);
  if (!isCorrectEmail) {
    setmodalmsg("Invalid email format");
    setshowModal(true);
    return;
  }


  const isCorrectemail = EmailValidates(email);
  const isPasswordCorrect = validatePassword(pass);
  if (!isPasswordCorrect) {
    setmodalmsg("Password must have an uppercase letter (A-Z), lowercase letter (a-z), numeric digit, and a special character");
    setshowModal(true);
    return 0
  }

  if (isCorrectemail == true && pass?.length > 5 && pass?.length < 31 && pass == pass1 && isPasswordCorrect == true) {
    setLoading(true);
    GET_METHOD(`/api/DMSRiderAcc?email=${email?.toLowerCase()}`)
      .then((res) => {
        if (res?.status == 0) {
          setLoading(false);
          setshowModal(true);
          setmodalmsg("Email address already exists");
        } else {
          setLoading(false);
          navigation.navigate("SignupStep3", { RouteState });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("CheckPhoneNumber APi", error);
      });
  } else if (isCorrectemail == false) {
    setmodalmsg("Invalid email");
    setshowModal(true);
  } else if (pass?.length < 6 || pass?.length > 30) {
    setmodalmsg(
      "Password must be at least 6 characters long and at most 30 characters"
    );
    setshowModal(true);
  } else if (pass != pass1) {
    setmodalmsg("Password and confirm password did not match");
    setshowModal(true);
  } else {
    setmodalmsg("Kindly Provide accurate data");
    setshowModal(true);
  }
};

const SignUpUser = (
  ProfileImageUrl,
  LicenseImageFrontUrl,
  LicenseImageBackUrl,
  InsuranceImageFrontUrl,
  InsuranceImageBackUrl,
  licenseFrontImageExpiry,
  insuranceFrontImageExpiry,
  RouteData,
  setLoading,
  setmodalmsg,
  setshowModal,
  addressData,
  selectPermission,
  token,
  dispatch
) => {
  try {
    let UserData = RouteData?.params?.RouteState;
    const body = {
      Firstname: UserData?.firstname,
      Lastname: UserData?.lastname ? UserData?.lastname : '',
      latitude: addressData?.latitude,
      longitude: addressData?.longitude,
      Gender:
        UserData?.gender == "Male" ? 1 : UserData?.gender == "Female" ? 0 : 2,
      Email: UserData?.email?.toLowerCase(),
      Password: UserData?.pass,
      ProfileImageURL: ProfileImageUrl?.data?.status == "success" ? ProfileImageUrl?.data?.message : "Fail upload from app",
      criminalBGURL: '',
      expiryCriminalBgUrl: getISOFormattedDateWithGMT(),
      statusCriminalBgUrl: 1,
      reasonCriminalBgUrl: "",
      ContactNum: UserData?.phoneNumber,
      City: addressData?.city,
      State: addressData?.state,
      Country: addressData?.country,
      Address: addressData?.address,
      address2: "",
      zipCode: addressData?.zipCode || '',
      // address2: addressData?.address2 != undefined ? addressData?.address2 : "",
      socialSecurityNumber: encryptVal(UserData?.socialSecurityNumber),
      isBgCheckEnabled: selectPermission ? 1 : 0,
      IdNumber: 0,
      LicenceNumber: 0,
      licenceImgFrontUrl: LicenseImageFrontUrl?.data?.status == "success" ? LicenseImageFrontUrl?.data?.message : "Fail upload from app",
      expiryLicenceImgUrl: licenseFrontImageExpiry ? getISOFormattedDateWithGMT(licenseFrontImageExpiry) : getISOFormattedDateWithGMT(),
      statusLicenceImgUrl: 0,
      reasonLicenceImgUrl: "",
      licenceBackImgUrl:
        LicenseImageBackUrl?.data?.status == "success"
          ? LicenseImageBackUrl?.data?.message
          : "Fail upload from app",
      insurenceFrontImgUrl:
        InsuranceImageFrontUrl?.data?.status == "success"
          ? InsuranceImageFrontUrl?.data?.message
          : "Fail upload from app",
      expiryInsurenceImgUrl: insuranceFrontImageExpiry
        ? getISOFormattedDateWithGMT(insuranceFrontImageExpiry)
        : getISOFormattedDateWithGMT(),
      statusInsurenceImgUrl: 0,
      reasonInsurenceImgUrl: "",
      insurenceBackImgUrl:
        InsuranceImageBackUrl?.data?.status == "success"
          ? InsuranceImageBackUrl?.data?.message
          : "Fail upload from app",
    };
    POST_METHOD(`/api/v2/DmsRiderAcc?fcmToken=${token}`, body)
      .then((res) => {
        const Result = res && JSON.parse(res);
        setLoading(false);

        try {
          if (Result.ContactNum != undefined && Result?.Email != undefined) {
            setTimeout(() => {
              dispatch(FirstLogin(true));
              dispatch(TokenId(Result?.token));
              dispatch(UserDetail(Result));
              dispatch(LoginUser(true));
            }, 600);
            setLoading(false);
          } else if (Result.status == 2) {
            setLoading(false);
            setshowModal(true);
            setmodalmsg(
              "Email or Phone already associated with another account."
            );
          } else {
            setLoading(false);
            setshowModal(true);
            setmodalmsg(
              "There was an error in signup, please try again later.(RS001-D)."
            );
          }
        } catch (err) {
          setLoading(false);
          console.log("erro=====================SIgnup3", err);
          setshowModal(true);
          setmodalmsg("Something went wrong please try again");
        }
      })
      .catch((error) => {
        console.log("error---------------SIgnup1", error);
        setLoading(false);
        setshowModal(true);
        setmodalmsg("Something went wrong please try again");
      });
  } catch (error) {
    setLoading(false);
    console.log("error--=============SIgnup2", error);
    setshowModal(false);
    setmodalmsg("Something went wrong please try again");
  }
};

const UPLOAD_FILE = async (imagePickerImg, file, ContactNum, type) => {
  const currentTimeStamp = Date.now();
  let PhoneNumber = "";
  if (ContactNum) {
    PhoneNumber += ContactNum;
  }
  const filePath =
    Platform.OS == "android"
      ? imagePickerImg.uri
      : file && imagePickerImg.fileCopyUri
        ? imagePickerImg.fileCopyUri.replace("file://", "")
        : imagePickerImg.uri.replace("file://", "");
  const fileExtension = file
    ? imagePickerImg.fileCopyUri.split(".").pop()
    : filePath.split(".").pop();
  const FormDataS = new FormData();
  FormDataS.append("file1", {
    uri: filePath,
    type: imagePickerImg.type,
    name: `DMS_${PhoneNumber?.replace('+', '00')}_${currentTimeStamp}.${fileExtension=='jpg'?fileExtension:'pdf'}`,
  });
  return axios({
    url: `${API}api/File?type=${type}`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    data: FormDataS,
  });
};
const UPLOAD_FILE1 = async (imagePickerImg, file, ContactNum) => {
  const currentTimeStamp = Date.now();
  let PhoneNumber = "+";
  if (ContactNum) {
    PhoneNumber += ContactNum;
  }

  const FormDataS = new FormData();
  FormDataS.append("file1", {
    uri: imagePickerImg.path,
    type: imagePickerImg.type,
    name: `DMS_${PhoneNumber}_${currentTimeStamp}.${fileExtension}`,
  });
  return axios({
    url: `${API}api/File`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    data: FormDataS,
  });
};

const UserLogout = (dispatch) => {
  try {
    dispatch(UserDetail([]));
    dispatch(LoginUser(false));
    dispatch(TokenId([]));
  } catch (error) {
    console.log('error', error);
  }
};

const LogoutUserAuth = (
  onSucess,
  TokenId,
  UserDetail,
  setmodalmsg,
  seterrorModal,
  dispatch,
  CloseDrawer
) => {
  try {
    GET_METHOD_AUTH(`/api/V2DmsRiderAcc?riderid=${UserDetail?.Id}`, TokenId)
      .then(async (result) => {
        if (result == "User logged out successfully") {
          const setLoading = () => { };
          const isOfffline = 'ForceOffline'
          await UserOnlineStatusHandler(
            setLoading,
            UserDetail,
            dispatch,
            TokenId,
            setLoading,
            setLoading,
            setLoading,
            setLoading,
            isOfffline,
            true
          )
          await UserLogout(dispatch)
          await BackgroundService?.stop();
          await stopBgLocation()
          onSucess && onSucess();
          deleteTokenFCM()
        } else if (result == "User can't be logged out") {
          setmodalmsg && setmodalmsg('You cannot perform this action.\n(You are in middle of an order)');
          seterrorModal && seterrorModal(true);
          CloseDrawer && CloseDrawer()
        } else {
          setmodalmsg && setmodalmsg("Try Again");
          seterrorModal && seterrorModal(true);
          CloseDrawer && CloseDrawer()
        }
      })
      .catch((error) => {
        // setLoading(false);
        console.log("GetUpdateUserProfile===", error);
      });
  } catch (error) {
    setmodalmsg && setmodalmsg("Try Again");
    seterrorModal && seterrorModal(true);
  }
};

const DeleteAcc = (
  onSucess,
  TokenId,
  Id,
  setmodalmsg,
  seterrorModal,
  seterrorModal1,
  setIsBusy
) => {
  seterrorModal1 && seterrorModal1(false)
  setIsBusy && setIsBusy(true)
  try {
    PUT_METHOD_AUTH(`/api/V2DmsRiderAcc?rdrId=${Id}`, TokenId)
      .then((result) => {
        if (result?.status == 1) {
          onSucess && onSucess();
          setIsBusy && setIsBusy(false)
          Alert.alert('Your account has been deleted Permanently')

        } else if (result == "User can't be deleted") {
          setIsBusy && setIsBusy(false)
          seterrorModal1 && seterrorModal1(false)
          setmodalmsg && setmodalmsg('You cannot perform this action.\n(You are in middle of an order)');
          setTimeout(() => {
            seterrorModal && seterrorModal(true);

          }, 800);
        } else {
          setIsBusy && setIsBusy(false)
          seterrorModal1 && seterrorModal1(false)
          setmodalmsg && setmodalmsg("Try Again");
          setTimeout(() => {
            seterrorModal && seterrorModal(true);

          }, 800);
        }
      })
      .catch((error) => {
        // setLoading(false);
        setIsBusy && setIsBusy(false)
        console.log("GetUpdateUserProfile", error);
      });
  } catch (error) {
    setIsBusy && setIsBusy(false)
    seterrorModal && seterrorModal(false);
    setmodalmsg && setmodalmsg("Try Again");
    setTimeout(() => {
      seterrorModal && seterrorModal(true);

    }, 800);
    // Alert.alert("WARNING", "Try Again");
  }
};

const updateSSN = (setLoading = false, ssnNumber, Token, Id, setmodalmsg, dispatch, confirmssnNumber, setUpdateSSNModal) => {
  Keyboard.dismiss();

  // Step 3: Validate SSN
  if (!ssnNumber?.trim() && !confirmssnNumber?.trim()) {
    setmodalmsg('Field are required!');
    return;
  }
  else if (!ssnNumber?.trim()) {
    setmodalmsg('Social Security Number is required');
    return;
  } else if (ssnNumber?.length < 9) {
    setmodalmsg('Please enter a valid Social Security Number');
    return;
  }

  // Step 4: Validate confirm SSN
  if (!confirmssnNumber?.trim()) {
    setmodalmsg('Please confirm your Social Security Number');
    return;
  } else if (ssnNumber !== confirmssnNumber) {
    setmodalmsg('SSN and Confirm SSN do not match');
    return;
  }
  setmodalmsg('')
  setLoading(true)
  try {
    PUT_METHOD_AUTH(`api/DmsRiderAcc/DmsSsnUpdate?riderId=${Id}&ssn=${encryptVal(ssnNumber)}`, Token)
      .then((result) => {
        const data = result
        if (data) {
          dispatch(TokenId(data?.token));
          dispatch(UserDetail(data));
          setUpdateSSNModal()
        } else {
          setmodalmsg('Something went wrong');
        }
        setLoading(false)
      })
      .catch((error) => {
        setmodalmsg('Something went wrong');
        console.log(error)
        setLoading(false)
      });
  } catch (error) {
    setmodalmsg('Something went wrong');
    setLoading(false)
  }
}

export {
  Auth_Login,
  CheckPhoneNumber,
  SendOtpToPhone,
  VerifyOtp,
  CreateNewPassword,
  CreateAccountStep1,
  CreateAccountStep3,
  UPLOAD_FILE,
  UPLOAD_FILE1,
  SignUpUser,
  DeleteAcc,
  LogoutUserAuth,
  versionCheck,
  updateSSN
};
