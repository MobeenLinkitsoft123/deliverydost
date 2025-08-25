import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native';
import moment from 'moment';

import imagePath from '../../../constants/imagePath';
import TextLabel from '../../../Components/TextLabel/TextLable';
import styles from './styles';
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts';

const DateSelector = React.memo(({ selectedDate, increaseDate, decreaseDate }) => {

    const dateLabel = selectedDate.format("DD / MM / YYYY") === moment().format("DD / MM / YYYY")
        ? `${selectedDate.format("DD / MM / YYYY")} (Today)`
        : selectedDate.format("DD / MM / YYYY");

    return (
        <View style={styles.row}>
            <TouchableOpacity onPress={decreaseDate} style={styles.extraPadding}>
                <Image source={imagePath.leftPinkImage} resizeMode="contain" style={styles.image} />
            </TouchableOpacity>
            <TextLabel label={dateLabel} color={"#aab7b8"} ResponsiveFonts={ResponsiveFonts.textualStyles.largeBold} />
            <TouchableOpacity onPress={increaseDate} style={styles.extraPadding}>
                <Image source={imagePath.rightPinkImage} resizeMode="contain" style={styles.image} />
            </TouchableOpacity>
        </View>
    );
});

export default DateSelector

