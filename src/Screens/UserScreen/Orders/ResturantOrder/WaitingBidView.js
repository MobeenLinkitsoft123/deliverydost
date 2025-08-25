import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, RefreshControl } from 'react-native'

import OrderTrailsStyles from './OrderTrailsStyles'
import imagePath from '../../../../constants/imagePath'
import getTotalDistanceInMiles from '../../../../utils/getTotalDistanceInMiles'
import { StaticMethods } from '../../../../utils/StaticMethods'
import { decryptVale } from '../../../../utils/Crypto'
import { moderateScale, verticalScale } from '../../../../styles/responsiveSize'
import colors from '../../../../styles/colors'
import Label from '../../../../Components/Label/Label'
import { ResponsiveFonts } from '../../../../constants/ResponsiveFonts'
import BidDetail from '../../../../Components/BidDetail/BidDetail'
import { useIsFocused } from '@react-navigation/native'

const WaitingBidView = ({ bidViewData, coordinate, updateOrderSheet, loading2, curLoc }) => {

    // const [PickDistance, setPickDistance] = useState("Loading...")
    const [DropOffDistance, setDropOffDistance] = useState("Loading...");
    const [duration, setDuration] = useState('Loading...')


    const CustomerLocation = bidViewData?.dropoffCords && JSON.parse(bidViewData?.dropoffCords);
    const RestuLocation = bidViewData?.pickupCords && JSON.parse(bidViewData?.pickupCords)
    const riderCords = coordinate && JSON.parse(coordinate)

    var riderPoints = riderCords.latitude?.toString() + "," + riderCords.longitude?.toString()
    var customerPoints = CustomerLocation?.latitude + "," + CustomerLocation?.longitude;
    var restuPoints = RestuLocation?.lat + "," + RestuLocation?.long;


    useEffect(() => {
        // getTotalDistanceInMiles(riderPoints, restuPoints, setPickDistance)
        getTotalDistanceInMiles(restuPoints, customerPoints, setDropOffDistance, setDuration)
    }, [])


    return (
        <ScrollView style={OrderTrailsStyles.scrollView} contentContainerStyle={OrderTrailsStyles.contentContainer}
            refreshControl={
                <RefreshControl
                    refreshing={loading2}
                    onRefresh={async () => {
                        updateOrderSheet()
                    }}
                />
            }>
            <Image source={imagePath.Orderwaitingbid} resizeMode="contain" style={OrderTrailsStyles.orderWaitingImage} />
            <Image source={imagePath.Orderline} resizeMode="contain" style={OrderTrailsStyles.orderLineImage} />

            <Text style={OrderTrailsStyles.waitingText}>WAITING FOR JOB ACCEPTANCE</Text>

            <BidDetail bidViewData={bidViewData} duration={duration} DropOffDistance={DropOffDistance}  />

            <Text style={[OrderTrailsStyles.totalText, { marginTop: verticalScale(20) }]}>Total Receivable Amount</Text>
            <Text style={OrderTrailsStyles.totalAmount}>$ {StaticMethods.getTwoDecimalPlacesString((Number(bidViewData?.BidAmount || 0) + Number(bidViewData?.tip || 0)) - Number(bidViewData?.fdCommission || 0))}</Text>
        </ScrollView>
    )
}

export default WaitingBidView