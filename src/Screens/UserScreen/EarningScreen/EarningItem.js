import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts'
import { verticalScale, moderateScaleVertical } from '../../../styles/responsiveSize'
import { StaticMethods } from '../../../utils/StaticMethods'
import colors from '../../../styles/colors'
import { GET_SINGLE_PAYOUT_HISTORY } from '../../../Store/Action/EarningActions'
import { dateFormatter } from '../../../Store/Action/AppFunctions'
import { payoutStatus } from '../../../utils/helperFunctions'

function PayoutItem({ item, setsinglePayoutData, onViewPayoutDetail }) {
    const GetSinglePayout = (transctionId) => {
        GET_SINGLE_PAYOUT_HISTORY(transctionId, setsinglePayoutData, onViewPayoutDetail)
    }

    const data = payoutStatus(item?.status);
    const status = data?.status;
    const statusColor = data?.color;

    return (
        <TouchableOpacity onPress={() => GetSinglePayout(item?.Id)} style={styles.container}>
            <View style={{ width: "65%" }}>
                <Text style={[styles.orderText, ResponsiveFonts.textualStyles.mediumNormal]}>Order ID
                    <Text style={[styles.orderNoText, ResponsiveFonts.textualStyles.small]}>{'  '}#{item?.orderids}</Text>
                </Text>
                <Text style={[styles.date, ResponsiveFonts.textualStyles.micro]}>{dateFormatter(item?.Date)}</Text>

                {item?.PymentMethod && (
                    <Text style={[styles.paymentInfo, ResponsiveFonts.textualStyles.micro]}>
                        Payment Method: <Text style={styles.paymentMethodText}>{item.PymentMethod}</Text>
                        {/* — <Text style={styles.amountText}>${StaticMethods.getTwoDecimalPlacesString(item?.Amo)}</Text> */}
                    </Text>
                )}

            </View>
            <View>
                <Text style={[styles.dollar, ResponsiveFonts.textualStyles.medium]}>$ {StaticMethods.getTwoDecimalPlacesString(item?.Amo)}</Text>
                {item?.PymentMethod?.toLowerCase()=='paypal'&&<Text style={[styles.status, ResponsiveFonts.textualStyles.micro, { color: statusColor }]}>
                    {status || "N/A"}
                </Text>}
            </View>
        </TouchableOpacity>
    )
}

export default PayoutItem

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: '#ffff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "95%",
        alignSelf: 'center',
        marginTop: verticalScale(10),
        padding: moderateScaleVertical(15),
        borderRadius: moderateScaleVertical(10)
    },
    orderText: {
        color: '#000',
    },
    orderNoText: {
        color: "#e54e5b",
    },
    date: {
        color: '#ABB2B9',
        marginTop: verticalScale(7)
    },
    paymentInfo: {
        color: '#566573',
        marginTop: verticalScale(7),
    },
    amountText: {
        color: colors.theme,
        fontWeight: 'bold'
    },
    paymentMethodText: {
        color: '#e54e5b',
        fontWeight: 'bold'
    },
    dollar: {
        color: colors.theme
    },
    status: {
        marginTop: verticalScale(5),
        textAlign: "right"
    }
})