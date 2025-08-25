import React, { useState, useRef } from "react";
import { Image, FlatList, View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/core";

import { width } from "../../../styles/responsiveSize";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import styles from "./style";
import TextLabel from "../../../Components/TextLabel/TextLable";
import colors from "../../../styles/colors";

import Onboarding_1 from "../../../assets/images/Tutorials/Delivery-App-Tutorial-18-100-01.png";
import Onboarding_2 from "../../../assets/images/Tutorials/Delivery-App-Tutorial-18-100-02.png";
import Onboarding_3 from "../../../assets/images/Tutorials/Delivery-App-Tutorial-18-100-03.png";
import Onboarding_4 from "../../../assets/images/Tutorials/Delivery-App-Tutorial-18-100-04.png";
import Onboarding_5 from "../../../assets/images/Tutorials/Delivery-App-Tutorial-18-100-05.png";
import Onboarding_6 from "../../../assets/images/Tutorials/Delivery-App-Tutorial-18-100-06.png";



const slides = [
  {
    id: "1",
    image: Onboarding_1,
  },
  {
    id: "2",
    image: Onboarding_2,
  },
  {
    id: "3",
    image: Onboarding_3,
  },
  {
    id: "4",
    image: Onboarding_4,
  },
  {
    id: "5",
    image: Onboarding_5,
  },
  {
    id: "6",
    image: Onboarding_6
  },
];

const Slide = ({ item }) => {
  let Icon = item?.image;
  return (
    <View style={styles.slideCon}>
      <Image source={Icon} style={styles.img} resizeMode={"contain"} />
    </View>
  );
};

const Tutorial = () => {
  const navigation = useNavigation();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef();

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({ offset });
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };
  const goToPreviousSlide = () => {
    const nextSlideIndex = currentSlideIndex - 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({ offset });
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const OnPress = () => {
    if (currentSlideIndex == 5) {
      navigation.goBack()
    } else {
      goToNextSlide()
    }
  }

  const Footer = () => {
    return (
      <View style={[styles.footer]}>
        <TextLabel
          label={`${currentSlideIndex + 1} / 6`}
          ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
          fontWeight={"bold"}
        />

        <View style={[styles.footerrow]}>
          {currentSlideIndex > 0 ? (
            <TouchableOpacity onPress={goToPreviousSlide}>
              <TextLabel
                label={`Back`}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                fontWeight={"bold"}
                color={colors.black}
              />
            </TouchableOpacity>
          ) : (
            <Text style={[styles.text, styles.w40]}>{"   "}</Text>
          )}

          <TouchableOpacity style={styles.btn} onPress={() => OnPress()}>
            <Text style={styles.text}>
              {currentSlideIndex == 5 ? 'Done' : 'NEXT'}
            </Text>
          </TouchableOpacity>
          {currentSlideIndex < 5 ?
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <TextLabel
                label={`Skip`}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                fontWeight={"bold"}
                color={colors.theme}
              />
            </TouchableOpacity> : <Text style={[styles.text, styles.w40]}>{"   "}</Text>}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.con}>
      <StatusBar backgroundColor={"transparent"} />
      <FlatList
        data={slides}
        ref={ref}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        pagingEnabled
        horizontal
        renderItem={({ item }) => <Slide item={item} />}
      />
      <Footer />
    </View>
  );
};

export default Tutorial;
