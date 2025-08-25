import React from 'react'
import { View, StyleSheet } from 'react-native';
import { ResponsiveFonts } from '../../constants/ResponsiveFonts';
import TextLabel from '../TextLabel/TextLable';

export default function EmptyList({ msg, marginTop }) {
    return (
        <View style={styles.container}>
            <TextLabel label={msg} textAlign={'center'} alignSelf={'center'} ResponsiveFonts={ResponsiveFonts.textualStyles.medium} marginTop={marginTop} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    }
})
