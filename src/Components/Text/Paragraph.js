import { View, Text } from "react-native";
import React from "react";

import InputTitle from "./InputTitle";

const Paragraph = (props) => {
  const { title, para, subtitle } = props;


  return (
    <View>
      {title ? <InputTitle label={title} fontSize={24} /> : null}
      {subtitle ? (
        <InputTitle
          label={subtitle}
          style={{
            color: "#777",
            fontWeight: "700",
            marginTop: 10,
            marginLeft: 20,
            fontSize: 16,
            textDecorationLine: "underline",
          }}
        />
      ) : null}
      {para ? (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            marginTop: 5,
            marginBottom: 15,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}
        >
          {para.map((data) => {
            return (
              <Text
                style={{
                  fontSize: 12,
                  color: "#333",
                  marginVertical: 5,
                }}
              >
                {data}
              </Text>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

export default Paragraph;
