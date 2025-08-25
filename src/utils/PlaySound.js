import { View, Text } from 'react-native'
import React from 'react'
import Sound from 'react-native-sound';

export default function PlaySound() {
    const testInfo = {
        title: 'wav via require()',
        isRequire: true,
        url: require('./sss.mp3'),
    }


    const callback = (error, sound) => {
        if (error) {
            console.log('error', error);
            // Alert.alert('error', error.message);
            return;
        }
        sound.play(() => {
            sound.release();
        });
    };
    const sound = new Sound(testInfo.url, error => callback(error, sound));
}