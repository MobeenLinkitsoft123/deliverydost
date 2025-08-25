import React from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import colors from '../../../styles/colors';

export default function Loader({ loading }) {
    return (
        <View style={styles.modalBackground}>
            <View style={[styles.activityIndicatorWrapper, { height: 150, width: 150 }]}>
                <ActivityIndicator animating={loading} color={colors.theme} size={'large'} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    activityIndicatorWrapper: {
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 10
    }
});

