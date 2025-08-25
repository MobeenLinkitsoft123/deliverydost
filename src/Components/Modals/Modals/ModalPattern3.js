import React, { useRef, useState } from "react";
import { StyleSheet, Image, View, TouchableOpacity, FlatList, Dimensions, Text } from "react-native";
import colors from "../../../styles/colors"; // Assuming you have your colors defined somewhere

// Responsive width and height of the screen
const { width, height } = Dimensions.get("window");

// Importing image assets
import Onboarding_1 from "../../../assets/images/Tutorials/111.png";
import Onboarding_2 from "../../../assets/images/Tutorials/444.png";
// import Onboarding_3 from "../../../assets/images/Tutorials/333.jpg";
import { moderateScale } from "../../../styles/responsiveSize";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import TextLabel from "../../TextLabel/TextLable";

// Slide data with images
const slides = [
    { id: "1", image: Onboarding_1 },
    { id: "2", image: Onboarding_2 },
    // { id: "3", image: Onboarding_3 },
];

const Slide = ({ item }) => (
    <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
    </View>
);

export default function ModalPattern3({ setValue }) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const ref = useRef(); // Reference for the FlatList

    // Update the current slide index accurately when scrolling
    const updateCurrentSlideIndex = (e) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);
    };

    // Navigate to the next slide
    const goToNextSlide = () => {
        const nextSlideIndex = currentSlideIndex + 1;
        if (nextSlideIndex < slides.length) {
            ref.current.scrollToOffset({ offset: nextSlideIndex * width, animated: true });
            setCurrentSlideIndex(nextSlideIndex);
        }
    };

    const handlePress = () => {
        if (currentSlideIndex === slides.length - 1) {
            setValue()
        } else {
            goToNextSlide();
        }
    };

    // Navigate to the previous slide
    const goToPreviousSlide = () => {
        const prevSlideIndex = currentSlideIndex - 1;
        if (prevSlideIndex >= 0) {
            ref.current.scrollToOffset({ offset: prevSlideIndex * width, animated: true });
            setCurrentSlideIndex(prevSlideIndex);
        }
    };

    return (
        <View style={styles.container}>
            <TextLabel
                label="What's New"
                textAlign="center"
                marginTop={20}
                ResponsiveFonts={ResponsiveFonts.textualStyles.large}
                color={colors.theme}
                alignSelf="center"
                marginBottom={10}
            />

            <FlatList
                data={slides}
                ref={ref}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onMomentumScrollEnd={updateCurrentSlideIndex}
                snapToAlignment="center"
                snapToInterval={width} // Ensure that snapping aligns correctly
                decelerationRate="fast"
                renderItem={({ item }) => <Slide item={item} />}
            />

            {/* Footer section with Back, Next, Close, and Slide Indicator */}
            <View style={styles.footer}>
                {/* Slide Indicator */}
                <TextLabel
                    label={`${currentSlideIndex + 1} / ${slides.length}`}
                    fontWeight="bold"
                    ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                />

                <View style={styles.footerRow}>
                    {/* Back Button */}
                    {currentSlideIndex > 0 ? (
                        <TouchableOpacity style={styles.btnBack} onPress={goToPreviousSlide}>
                            <TextLabel label="Back" ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold} fontWeight="bold" color={colors.black} />
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.emptySpace}>{"   "}</Text>
                    )}

                    {/* Next Button */}
                    <TouchableOpacity style={styles.btnNext} onPress={handlePress}>
                        <TextLabel
                            label={currentSlideIndex === slides.length - 1 ? "Done" : "Next"}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            fontWeight="bold"
                            color={colors.white}
                        />
                    </TouchableOpacity>

                    {/* Close Button */}
                    <TouchableOpacity style={styles.btnClose} onPress={() => { setValue() }}>
                        <TextLabel label="Close" ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold} fontWeight="bold" color={colors.theme} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// Styles for the slider component
const styles = StyleSheet.create({
    container: {
        width: '95%',
        alignSelf: 'center',
        borderRadius: moderateScale(15),
        backgroundColor: colors.white,
    },
    slide: {
        width,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: width * 0.75,
        height: height * 0.52,
        borderRadius: 10,
    },
    footer: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "90%",
        alignSelf: "center",
        paddingBottom: 10,
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 10,
    },
    btnBack: {
        width: moderateScale(70),
        backgroundColor: colors.lightGray,
        paddingVertical: 10,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    btnNext: {
        width: moderateScale(150),
        backgroundColor: colors.theme,
        paddingVertical: 10,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    btnClose: {
        width: moderateScale(70),
        justifyContent: "center",
        alignItems: "center",
    },
    emptySpace: {
        width: 70,
    },
});

