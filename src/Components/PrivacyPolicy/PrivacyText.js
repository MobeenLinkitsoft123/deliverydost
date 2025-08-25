import React from "react";
import { View, Text, TouchableWithoutFeedback, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ResponsiveFonts } from "../../constants/ResponsiveFonts";
import colors from "../../styles/colors";
import { width } from "../../styles/responsiveSize";
const PolicyText = (props) => {
  const { label } = props;
  const navigation = useNavigation();
  return (
    <View
      style={{
        width: label ? 200 : width,
        marginVertical: 10,
        flex: 1,
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 10,
      }}
    >
      {label ?
        <>
          <Text
            style={[
              { fontSize: 12, textAlign: "center" },
              ResponsiveFonts.textualStyles.smallBold,
            ]}
          >
            By clicking on {label} you are agreeing to our{" "}
            <Text onPress={() => navigation.navigate("AgreementsView", { urlType: 0 })} style={{ fontSize: 12, color: "#3366CC" }}>Privacy Policy</Text>
            ,{" "}
            <Text onPress={() => navigation.navigate("AgreementsView", { urlType: 2 })} style={{ fontSize: 12, color: "#3366CC" }}>Disclaimer{" "}</Text>
            &{" "}
            <Text onPress={() => navigation.navigate("AgreementsView", { urlType: 1 })} style={{ fontSize: 12, color: "#3366CC" }}>Agreements</Text>
          </Text>
        </>
        :
        <>
          <Text
            style={[
              { fontSize: 12, textAlign: "center" },
              ResponsiveFonts.textualStyles.smallBold,
            ]}
          >
            {/* By clicking on {label} you are agreeing to our{" "} */}
            <Text onPress={() => navigation.navigate("AgreementsView", { urlType: 0 })} style={{ fontSize: 12, color: colors.theme }}>Privacy Policy</Text>
            ,{" "}
            <Text onPress={() => navigation.navigate("AgreementsView", { urlType: 2 })} style={{ fontSize: 12, color: colors.theme }}>Disclaimer</Text>
            {" "}&{" "}
            <Text onPress={() => navigation.navigate("AgreementsView", { urlType: 1 })} style={{ fontSize: 12, color: colors.theme }}>Agreements</Text>
          </Text>
        </>
      }
    </View >
  );
};
export default PolicyText;