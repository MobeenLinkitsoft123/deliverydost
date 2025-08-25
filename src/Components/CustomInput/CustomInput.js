import React from 'react';
import { View, Pressable, TextInput, StyleSheet, Image } from 'react-native';
import colors from '../../styles/colors';


const CustomInput = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
  keybord,
  multiline,
  numberOfLines,
  icon,
  type,
  SetsecureTextEntry,
  secure,
  width,
  alignSelf,
  marginTop,
  Bg,
  borderRadius,
  placeholderTextColor,
  tintColor,
  fontFamily,
  iconType,
  borderWidth,
  borderColor,
  color,
  maxLength,
  height,
  textAlign
}) => {
  return (
    <View
      style={[
        styles.container,
        styles[`con_${type}`],
        width ? { width } : null,
        marginTop ? { marginTop } : null,
        Bg ? { backgroundColor: Bg } : { backgroundColor: colors.white },
        borderRadius ? { borderRadius } : {},
        borderWidth ? { borderWidth } : {},
        borderColor ? { borderColor } : { alignSelf: 'center' },
        alignSelf ? { alignSelf } : {},
        height ? { height } : {}
      ]}>
      {type == 'ICON' ? (
        <Image
          source={icon}
          style={[
            styles.img,
            tintColor ? { tintColor } : { tintColor: colors.gray },
          ]}
          resizeMode={'contain'}
        />
      ) : null}
      <TextInput
        value={value}
        maxLength={maxLength}
        onChangeText={setValue}
        placeholder={placeholder}
        style={[
          styles.input,
          color ? { color } : { color: colors.black },
          height ? { height } : {},
          textAlign ? { textAlign } : {}
        ]}
        secureTextEntry={secureTextEntry}
        keyboardType={keybord ? keybord : 'default'}
        placeholderTextColor={
          placeholderTextColor ? placeholderTextColor : colors.black
        }
        multiline={multiline}
        numberOfLines={numberOfLines}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 60,
    color: '#000',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,

  },
  input: {
    width: '90%',
    color: '#000',
  },
  con_ICON: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  img: {
    height: 20,
    width: 20,
    tintColor: colors.black,
  },
  img2: {
    height: 20,
    width: 20,
    marginLeft: -20,
    tintColor: colors.white
  },
});

export default CustomInput;
