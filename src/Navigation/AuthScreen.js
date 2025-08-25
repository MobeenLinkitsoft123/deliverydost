import React from "react"
import navigationStrings from "../constants/navigationStrings";
import { Login, OtpVerification, ForgotPassword, SignupStep1, SignupStep2, SignupStep3, CreateNewPassword, SignupStep5 } from "../Screens";
import AgreementsView from "../Screens/PrivacyScreens/AgreementsView";

export default function (Stack) {
    return (
        <>
            <Stack.Screen name={navigationStrings.LOGIN} component={Login} options={{ headerShown: false }} />
            <Stack.Screen name={'SignupStep1'} component={SignupStep1} options={{ headerShown: false }} />
            <Stack.Screen name={'SignupStep2'} component={SignupStep2} options={{ headerShown: false }} />
            <Stack.Screen name={'SignupStep3'} component={SignupStep3} options={{ headerShown: false }} />
            <Stack.Screen name={'SignupStep5'} component={SignupStep5} options={{ headerShown: false }} />
            <Stack.Screen name={navigationStrings.OTP_VERIFICATION} component={OtpVerification} options={{ headerShown: false }} />
            <Stack.Screen name={'CreateNewPassword'} component={CreateNewPassword} options={{ headerShown: false }} />
            <Stack.Screen name={navigationStrings.FORGOT_PASSWORD} component={ForgotPassword} options={{ headerShown: false, }} />
            <Stack.Screen name={"AgreementsView"} component={AgreementsView} options={{ headerShown: false }} />
        </>
    );
}
