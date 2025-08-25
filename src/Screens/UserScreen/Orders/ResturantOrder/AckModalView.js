import { Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

import OrderTrailsStyles from './OrderTrailsStyles'
import imagePath from '../../../../constants/imagePath'
import { decryptVale } from '../../../../utils/Crypto'
import { verticalScale } from '../../../../styles/responsiveSize'
import { ResponsiveFonts } from '../../../../constants/ResponsiveFonts'
import { GetCurrentOrderDetailsBackground } from '../../../../Store/Action/RestaurantFunctions'
import { useNavigation } from '@react-navigation/native'
import colors from '../../../../styles/colors'
import CustomButton from '../../../../Components/CustomButton/CustomButton'
import Loader from '../../../../Components/Modals/Modals/Loader'
import LoaderFixed from '../../../../Components/LoaderFixed/LoaderFixed'

const AckModalView = ({ currentOrderData, TokenId, UserDetail, handleAcknowledge }) => {

    const navigation = useNavigation()
    const [orderDetail, setOrderDetail] = useState({});
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        GetCurrentOrderDetailsBackground(
            setLoading,
            UserDetail,
            TokenId,
            setOrderDetail,
            () => { },
            () => { },
            () => { },
            () => { },
            () => { },
            () => { },
            navigation,
            () => { },
            currentOrderData?.OrderID,
            () => { },
            () => { },
            () => { },
            {})
    }, [currentOrderData]);


    const ackConfirmed = (navigateToJob) => {
        handleAcknowledge(navigateToJob, setLoading, setOrderDetail, orderDetail)
    }

    const DurationText = () => {
        var duration = ""

        if (orderDetail?.driver_Restaurants_Distance?.finalDistance) {
            duration = duration + `${orderDetail?.driver_Restaurants_Distance?.finalDistance} away`
        }

        return duration?.length > 0 ? <Text style={{ color: colors.theme }}>{`( ${duration} )`}</Text> : ''
    }

    // console.log("111orderDetail>>>>>", orderDetail)
    return (
        <View style={OrderTrailsStyles.ackModal} contentContainerStyle={OrderTrailsStyles.contentContainer}>
            {!loading && (
                <>
                    <Text style={[OrderTrailsStyles.orderConfirm, ResponsiveFonts.textualStyles.large]}>Order Confirmed #{currentOrderData?.OrderID}</Text>

                    <TouchableOpacity style={OrderTrailsStyles.closeBtnView} onPress={() => ackConfirmed(false)}>
                        <Image source={imagePath.closeIcon} resizeMode='contain' style={OrderTrailsStyles.closeIocn} />
                    </TouchableOpacity>

                    <View style={OrderTrailsStyles.infoContainer2}>
                        <Text style={OrderTrailsStyles.restaurantName}>{orderDetail?.vendrname}</Text>
                        <View style={OrderTrailsStyles.addressContainer2}>
                            <View style={{ width: "10%" }}>
                                <Image source={imagePath.mapDirection} resizeMode="contain" style={OrderTrailsStyles.mapIcon2} />
                            </View>
                            <View style={{ width: '90%' }}>
                                <Text style={OrderTrailsStyles.addressTitle}>Pick Up Address {DurationText()} </Text>
                                <Text style={[OrderTrailsStyles.address]}>{orderDetail?.vedraddress}</Text>
                                {orderDetail?.vendorAddress2 && (<Text style={[OrderTrailsStyles.address, { marginBottom: verticalScale(10) }]}>{orderDetail?.vendorAddress2}</Text>)}

                                <Text style={OrderTrailsStyles.addressTitle}>Delivery Address</Text>
                                <Text style={OrderTrailsStyles.address}>{decryptVale(orderDetail?.userAddress)}</Text>
                                {orderDetail?.userAddress2 && (<Text style={OrderTrailsStyles.address}>{decryptVale(orderDetail?.userAddress2)}</Text>)}
                            </View>
                        </View>
                    </View>


                    <CustomButton
                        text={"View Job"}
                        onPress={() => {
                            ackConfirmed(true);
                        }}
                        bgColor={loading ? colors.blackOpacity70 : colors.theme}
                        fgColor={colors.white}
                        marginTop={15}
                        marginBottom={15}
                        disabled={loading}
                    />
                </>)}

            {loading && <View style={OrderTrailsStyles.fixedLoader}>
                <Loader />
            </View>}


        </View>
    )
}

export default AckModalView