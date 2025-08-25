import { Dimensions, Platform, PixelRatio, StyleSheet } from "react-native";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const scale = SCREEN_WIDTH / 320;

const LightFontFamily = 'Proxima Nova Regular';
const ExtraBold = 'Proxima Nova Extrabold';
const MediumFontFamily = 'Avenir-Medium';
const BoldFontFamily = 'Proxima Nova Alt Bold';

export class ResponsiveFonts {
  static normalize(size) {
    const newSize = size * scale;
    if (Platform.OS === "ios") {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
  }

  static textualStyles = StyleSheet.create({
    TextInputFonts: {
      fontSize: ResponsiveFonts.normalize(12),
      fontFamily: LightFontFamily
    },
    xxmicro: {
      fontSize: ResponsiveFonts.normalize(8),
      // fontFamily: LightFontFamily,
    },
    xmicro: {
      fontSize: ResponsiveFonts.normalize(8),
      fontFamily: LightFontFamily,
    },
    xmicroBold: {
      fontSize: ResponsiveFonts.normalize(8),
      fontFamily: BoldFontFamily,
    },
    micro: {
      fontSize: ResponsiveFonts.normalize(10),
      fontFamily: LightFontFamily,
    },
    microBold: {
      fontSize: ResponsiveFonts.normalize(10),
      fontFamily: ExtraBold,
    },
    small: {
      fontSize: ResponsiveFonts.normalize(12),
      fontFamily: LightFontFamily,
    },
    smallBold: {
      fontSize: ResponsiveFonts.normalize(12),
      fontFamily: BoldFontFamily,
    },
    smallBlodBlack: {
      fontSize: ResponsiveFonts.normalize(12),
      fontFamily: ExtraBold,
    },
    medium: {
      fontSize: ResponsiveFonts.normalize(14),
      fontFamily: BoldFontFamily,
    },
    mediumNormal: {
      fontSize: ResponsiveFonts.normalize(14),
      fontFamily: LightFontFamily,
    },
    largeNormal: {
      fontSize: ResponsiveFonts.normalize(18),
      fontFamily: LightFontFamily,
    },
    large: {
      fontSize: ResponsiveFonts.normalize(18),
      fontFamily: BoldFontFamily,
    },
    largeBold: {
      fontSize: ResponsiveFonts.normalize(18),
      fontFamily: ExtraBold,
    },
    xlarge: {
      fontSize: ResponsiveFonts.normalize(22),
      fontFamily: BoldFontFamily,
    },
    xlargebold: {
      fontSize: ResponsiveFonts.normalize(22),
      fontFamily: BoldFontFamily,
    },
    xxlarge: {
      fontSize: ResponsiveFonts.normalize(26),
      fontFamily: BoldFontFamily,
    },
    xxxlarge: {
      fontSize: ResponsiveFonts.normalize(32),
      fontFamily: BoldFontFamily,
    },
  });
}