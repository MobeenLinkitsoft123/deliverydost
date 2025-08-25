import React from "react";
import { Text, View } from "react-native";
import { verticalScale, moderateScale } from "../../styles/responsiveSize";
import colors from "../../styles/colors";

const TextLabel = ({
  label,
  fontSize,
  color,
  marginTop,
  paddingHorizontal,
  fontFamily,
  marginLeft,
  alignSelf,
  marginBottom,
  textAlign,
  fontWeight,
  marginRight,
  width,
  numOfLine,
  ResponsiveFonts,
  adjustsFontSizeToFit,
  textDecorationLine = "none",
  ellipsizeMode = "tail",
}) => {
  return (
    <View
      style={[
        marginTop ? { marginTop: verticalScale(marginTop) } : { marginTop: 0 },
        alignSelf ? { alignSelf } : {},
        marginRight ? { marginRight } : {},
        width ? { width } : {},
      ]}
    >
      <Text
        numberOfLines={numOfLine}
        allowFontScaling={false}
        ellipsizeMode={ellipsizeMode}
        adjustsFontSizeToFit={adjustsFontSizeToFit == true ? true : false}
        style={[
          ResponsiveFonts ? { ...ResponsiveFonts } : {},
          color ? { color } : { color: colors.black },
          marginLeft ? { marginLeft: moderateScale(marginLeft) } : {},
          marginBottom ? { marginBottom: moderateScale(marginBottom) } : {},
          textAlign ? { textAlign } : {},
          fontWeight ? { fontWeight } : {},
          { textDecorationLine: textDecorationLine },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export default TextLabel;
