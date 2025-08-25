import React, { useState, useRef, useEffect } from "react";
import { Platform } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { ResponsiveFonts } from "../../constants/ResponsiveFonts";


const PhoneInput2 = (props) => {

    const { style, value, onChange, updateCodeISO, CodeISO, validity, focusPhone, ref, } = props;
    const phoneInput = useRef(null);



    const containerStyle = style
        ? style
        : {
            paddingHorizontal: 10,
            fontSize: 13,
            backgroundColor: "#ffffff80",
            borderRadius: 50,
            borderWidth: 1,
            borderColor: "#d33d3f",
            margin: 10,
            width: ("60%"),
            fontFamily: "Avenir-Medium",
            color: "#000",
        };

    const commonStyle = {
        backgroundColor: "transparent",
        height: 50,
        fontSize: 13,
        textAlignVertical: "center",
    };

    useEffect(() => {
        const countryCode = phoneInput.current?.getCountryCode();
        updateCodeISO ? updateCodeISO(countryCode) : null;

    }, [
        phoneInput.current?.getCountryCode(),
    ]);


    return (
        <PhoneInput
            ref={ref}
            defaultValue={value}
            defaultCode={CodeISO}
            layout='first'
            placeholder=''
            containerStyle={containerStyle}
            flagButtonStyle={[commonStyle, { width: 50 }]}
            textContainerStyle={commonStyle}
            textInputStyle={[commonStyle, { marginRight: -30, }, Platform.OS === 'ios' ? { left: -20 } : { left: -30 }, ResponsiveFonts.textualStyles.TextInputFonts]}
            codeTextStyle={[commonStyle, { left: -20 }, Platform.OS === 'ios' ? { marginTop: 32 } : {}]}
            onChangeFormattedText={onChange}
            disableArrowIcon={true}
            autoFocus={focusPhone}
            withDarkTheme={false}
            textInputProps={{
                placeholderTextColor: "#848484",
              }}

        />
    );
};

export default PhoneInput2;
