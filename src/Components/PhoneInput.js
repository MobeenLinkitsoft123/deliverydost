import React, { useRef } from 'react';
import { TextInput, TouchableOpacity, View, Text, Keyboard, Platform } from 'react-native';
import SvgUri from 'react-native-svg-uri';
import colors from '../styles/colors';
import { moderateScale } from '../styles/responsiveSize';
import { ResponsiveFonts } from '../constants/ResponsiveFonts';

const PhoneInputField = props => {

  const { style, value, onChange, reff, countryCode, onSubmitEditing, forgot, showCountryPicker, width } = props;
  const phone = useRef(null)

  const containerStyle = style
    ? style
    : {
      paddingHorizontal: 10,
      fontSize: 13,
      backgroundColor: "#D1D2D3",
      margin: 10,
      marginBottom: 20,
      width: '90%',
      color: '#000',
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      borderRadius: 10
      // width: '98%',
    };

  return (
    <View style={[containerStyle, width && { width }]}>
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss()
          showCountryPicker(true)
        }}
        style={{
          paddingVertical: 2,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: moderateScale(5),
          paddingRight: moderateScale(3)
        }}>
        <View style={{
          height: moderateScale(25),
          width: moderateScale(25),
          marginRight: moderateScale(5)
        }}>
          <SvgUri
            width="100%"
            height="100%"
            source={{ uri: countryCode?.image }}
            resizeMode="contain"
          />
        </View>
        <Text
          style={[ResponsiveFonts.textualStyles.TextInputFonts, { color: colors.black }]}
        >{countryCode?.phone}</Text>
      </TouchableOpacity>

      <TextInput
        maxLength={10}
        ref={reff ? reff : phone}
        onChangeText={onChange}
        placeholderTextColor={"#848484"}
        value={value}
        keyboardType="phone-pad"
        placeholder='Phone Number'

        style={[{
          width: '68%',
          height: '100%',
          top: Platform.OS == 'ios' ? 0 : 0.75,
          // backgroundColor: 'red'
          // height: 60,
          padding: 0
        }, ResponsiveFonts.textualStyles.TextInputFonts]}
        onSubmitEditing={onSubmitEditing ? onSubmitEditing : null}
        returnKeyType={forgot ? 'done' : 'next'}
      />
    </View>
  );
};

export default PhoneInputField;
