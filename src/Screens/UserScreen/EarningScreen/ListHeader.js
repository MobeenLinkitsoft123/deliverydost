import React from 'react'
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'

import DateSelector from './DateSelector';
import { StaticMethods } from '../../../utils/StaticMethods';
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts';
import imagePath from '../../../constants/imagePath';
import colors from '../../../styles/colors';
import styles from './styles';

const ListHeader = React.memo(({ selectedDate, increaseDate, decreaseDate, TotalAmount }) => {
    return (
        <>
            <DateSelector selectedDate={selectedDate} increaseDate={increaseDate} decreaseDate={decreaseDate} />
            <ImageBackground source={imagePath.paymentCard} style={styles.paymentCard} resizeMode="stretch">
                <Text style={[styles.paymentamount, ResponsiveFonts.textualStyles.xxxlarge]}>
                    $ {StaticMethods.getTwoDecimalPlacesString(TotalAmount || 0)}
                </Text>
                <View style={styles.textRow}>
                    <Image source={imagePath.currencyImage} style={styles.PayOutIcons} resizeMode="contain" />
                    <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.medium]}>Total Earnings</Text>
                </View>
            </ImageBackground>
            <View style={styles.moneyContainer}>
                <View>
                    <Text style={[[styles.paymentamount, { fontWeight: '700' }], ResponsiveFonts.textualStyles.largeNormal]}>$ {StaticMethods.getTwoDecimalPlacesString(TotalAmount || 0)}</Text>
                    <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.small]}>RECEIVED AMOUNT</Text>
                </View>
                <Image source={imagePath.recivedMoney} style={styles.moneyIcon} resizeMode={'contain'} />
                <View style={[styles.fixedline, { backgroundColor: colors.green1 }]} />
            </View>
            <View style={styles.moneyContainer}>
                <View>
                    <Text style={[[styles.paymentamount, { fontWeight: '700' }], ResponsiveFonts.textualStyles.largeNormal]}>$ {StaticMethods.getTwoDecimalPlacesString(TotalAmount || 0)}</Text>
                    <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.small]}>OUTSTANDING AMOUNT</Text>
                </View>
                <Image source={imagePath.pendingMoney} style={styles.moneyIcon} resizeMode={'contain'} />
                <View style={[styles.fixedline, { backgroundColor: colors.theme }]} />
            </View>
            <View style={styles.moneyContainer}>
                <View>
                    <Text style={[[styles.paymentamount, { fontWeight: '700' }], ResponsiveFonts.textualStyles.largeNormal]}>$ {StaticMethods.getTwoDecimalPlacesString(TotalAmount || 0)}</Text>
                    <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.small]}>TIP AMOUNT</Text>
                </View>
                <Image source={imagePath.tipMoney} style={styles.moneyIcon} resizeMode={'contain'} />
                <View style={[styles.fixedline, { backgroundColor: colors.orange }]} />
            </View>

            <Text style={[styles.payouthistory, ResponsiveFonts.textualStyles.large]}>PayOut History</Text>
            <View style={styles.lines} />
        </>
    );
});

export default ListHeader