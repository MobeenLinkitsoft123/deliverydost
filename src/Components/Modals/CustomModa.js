import React from "react";
// import Modal from "react-native-modal";
import colors from "../../styles/colors";
import AnimatedModal from "./AnimatedModal";

export default function CustomModal({
  value,
  setValue,
  children,
  HideOnBackDropPress = false,
}) {
  return (
    <AnimatedModal visible={value} onClose={() => { setValue(false) }} HideOnBackDropPress={HideOnBackDropPress} >
      {children}
    </AnimatedModal>
  );
}
