import { View, Text } from "react-native";
import React from "react";

const InputTitle = (props) => {
  const { label, style, fontSize, flexStart } = props;

  const Styles = style
    ? style
    : {
        marginTop: 10,
        marginLeft: 20,
        fontSize: fontSize ? fontSize : 14,
        color: "#d33d3f",
        fontWeight: "bold",
        alignSelf: flexStart ? 'flex-start' : null
      };

  return <Text style={Styles}>{label}</Text>;
};

export default InputTitle;
