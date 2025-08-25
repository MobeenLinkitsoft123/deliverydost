import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import { height, moderateScale, verticalScale } from "../../../styles/responsiveSize";
import colors from "../../../styles/colors";
import TextLabel from "../../TextLabel/TextLable";
import { ResponsiveFonts } from "../../../constants/ResponsiveFonts";
import imagePath from "../../../constants/imagePath";
import { StaticMethods } from "../../../utils/StaticMethods";
import { decryptVale, encryptVal } from "../../../utils/Crypto";
import { CONVERT_DATE_TIME } from "../../../utils/helperFunctions";
import { GET_ORDER_DETAILS } from "../../../Store/Action/RestaurantFunctions";
import LoaderFixed from "../../LoaderFixed/LoaderFixed";
import { dateFormatter } from "../../../Store/Action/AppFunctions";
import moment from "moment";

export default function MenuDetailModal({ setValue, RiderNote, orderDetails }) {

    const isFocus = useIsFocused();
    const { TokenId } = useSelector((state) => state?.AuthReducer);
    const [loading2, setLoading2] = useState(false);
    const [CompleteOrderDetails, setCompleteOrderDetails] = useState([]);
    const [OrderData, setOrderData] = useState(orderDetails);

    const Get_Current_Orders = () => {
        isFocus == true && GET_ORDER_DETAILS(TokenId, setLoading2, OrderData, setCompleteOrderDetails)
    }

    useEffect(() => {
        Get_Current_Orders()
        setOrderData(orderDetails)
    }, [isFocus]);

    const dateTime = dateFormatter(orderDetails?.Datetime || orderDetails?.Starttime);
    const deliveryAddress = OrderData?.RiderDropOffLoc?.replace(/ /g, "+");


    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TextLabel
                    label={'            '}
                    ResponsiveFonts={ResponsiveFonts.textualStyles.microBold}
                    color={colors.white} />
                <TextLabel
                    label={'Order Details'}
                    ResponsiveFonts={ResponsiveFonts.textualStyles.large}
                    color={colors.white}
                    width={'50%'} textAlign={'center'} alignSelf={'center'} marginLeft={0} />

                <TouchableOpacity onPress={() => setValue(false)}>
                    <Image source={imagePath.closeIcon} resizeMode={'contain'} style={styles.BackIcon} />
                </TouchableOpacity>
            </View>

            <TextLabel
                label={'Order Details'}
                ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                color={colors.black}
                marginLeft={20}
                marginTop={20}
                marginBottom={10}
            />
            <View style={styles.incomingOrderView}>
                <View style={styles.infoRow}>
                    <TextLabel
                        label={'Order ID'}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={colors.black}
                    />
                    <TextLabel
                        label={`#${OrderData?.OrderId || OrderData?.OrderID}`}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={colors.theme}
                    />
                </View>
                <View style={styles.infoRow}>
                    <TextLabel
                        label={'Payment Status'}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={colors.black}
                    />
                    <TextLabel
                        label={OrderData?.PaymentType == 0 ? 'Unpaid' : 'Paid'}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={OrderData?.PaymentType == 0 ? colors.theme : colors.green1}
                    />
                </View>
                <View style={styles.infoRow}>
                    <TextLabel
                        label={'Order Date & Time'}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={colors.black}
                    />
                    <TextLabel
                        label={dateTime}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={colors.black}
                    />
                </View>
                <View style={styles.infoRow}>
                    <TextLabel
                        label={'Customer Name'}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={colors.black}
                    />
                    <TextLabel
                        label={decryptVale(orderDetails?.CustomerName || orderDetails?.UserName)}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={colors.black}
                    />
                </View>
                <View style={styles.infoRow}>
                    <TextLabel
                        label={'Vendor Name'}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={colors.black}
                    />
                    <View style={styles.VendorNameView}>
                        <TextLabel
                            label={orderDetails?.vendrname || orderDetails?.VendorID}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                            color={colors.black}
                        />
                    </View>
                </View>
                {OrderData?.orderName != undefined && OrderData?.orderName != 0 && (<View style={styles.infoRow}>
                    <TextLabel
                        label={'Order Name (Used on Mart Website)'}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={colors.black}
                    />
                    <TextLabel
                        label={OrderData?.orderName}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={colors.black}
                    />
                </View>)}
                {orderDetails?.martOrderId > 0 && (<View style={styles.infoRow}>
                    <TextLabel
                        label={'Mart Order # '}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        color={colors.black}
                    />
                    <View style={styles.VendorNameView}>
                        <TextLabel
                            label={orderDetails?.martOrderId}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                            color={colors.black}
                        />
                    </View>
                </View>)}
            </View>

            {(OrderData?.userAddress?.length > 0 || deliveryAddress?.length > 0) &&
                <>
                    <View style={styles.lines2} />
                    <View style={styles.BottomRow}>
                        <TextLabel
                            label={"Delivery Address :"}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                        />
                        <TextLabel
                            label={decryptVale(OrderData?.userAddress || deliveryAddress)}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.micro}
                            color={colors.theme}
                            marginTop={3}
                        />
                        {OrderData?.userAddress2?.length > 0 && (<TextLabel
                            label={decryptVale(OrderData?.userAddress2) || OrderData?.userAddress2}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.micro}
                            color={colors.theme}
                            marginTop={3}
                        />)}
                    </View>
                </>}

            {RiderNote &&
                <>
                    <View style={[styles.BottomRow, { marginTop: 5 }]}>
                        <TextLabel
                            label={"Delivery Note:"}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                        />
                        <TextLabel
                            label={RiderNote}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.micro}
                            color={colors.theme}
                            marginTop={3}
                        />
                    </View>
                </>}

            {OrderData?.Type == 'mart' && (<View style={{ paddingBottom: 20 }} />)}

            {OrderData?.Type != 'mart' && (<View style={styles.lines2} />)}


            {OrderData?.Type != 'mart' && (<View style={styles.attributesrowHeader}>
                <TextLabel
                    label={'Items Details'}
                    ResponsiveFonts={ResponsiveFonts.textualStyles.mediumBold}
                    color={colors.black}
                    width={'55%'}
                />
                <View style={styles.pricrow}>
                    <TextLabel
                        textAlign={'center'}
                        label={'QTY'}
                        width={'40%'}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                        color={colors.blackOpacity50} />
                </View>
            </View>)}

            {OrderData?.Type != 'mart' && (<View style={styles.scrollView}>
                <ScrollView showsVerticalScrollIndicator={true} persistentScrollbar={true}>
                    {CompleteOrderDetails != undefined && CompleteOrderDetails?.map((value, index) => {
                        return (
                            <View key={value.id}>
                                <TextLabel
                                    label={value?.name}
                                    width={'80%'}
                                    marginLeft={20}
                                    marginTop={10}
                                    marginBottom={10}
                                    ResponsiveFonts={ResponsiveFonts.textualStyles.mediumBold}
                                    color={colors.theme} />

                                {value?.orderProducts && value?.orderProducts?.map((item, index) => {
                                    return (
                                        <View key={item.id} style={styles.attributesrowHeader}>
                                            <View style={{ width: "55%" }}>
                                                <TextLabel
                                                    label={item?.productName}
                                                    width={'100%'}
                                                    ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                                                    color={colors.black} />


                                                <View style={styles.attributesrowContainer}>
                                                    {item?.attributeCategories && item?.attributeCategories?.map((val, ind) => {
                                                        const attributeNames = val.orderProductAttributes?.map(arr => arr?.attributeName)?.join(', ');
                                                        return (
                                                            <View key={ind} style={{ width: "90%", flexWrap: 'wrap', flexDirection: "row", }}>
                                                                <TextLabel
                                                                    label={attributeNames}
                                                                    // width={100}
                                                                    fontFamily={ResponsiveFonts.textualStyles.small}
                                                                    color={colors.black} />
                                                            </View>

                                                        )
                                                    })}
                                                </View>

                                            </View>
                                            <View style={styles.pricrow}>
                                                <TextLabel
                                                    textAlign={'center'}
                                                    label={item?.quantity}
                                                    width={'40%'}
                                                    ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                                                    color={colors.blackOpacity50} />
                                            </View>

                                            <View>

                                            </View>
                                        </View>
                                    )
                                })}

                            </View>

                        )
                    })}
                </ScrollView>
            </View>)}

            {/* <View style={{ marginBottom: 20 }} /> */}

            {loading2 ? <LoaderFixed /> : null}

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        alignSelf: 'center',
        borderRadius: moderateScale(20),
        backgroundColor: colors.white,
        overflow: "hidden",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    header: {
        width: "100%",
        backgroundColor: colors.theme,
        height: verticalScale(80),
        padding: 15,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center"
    },
    BackIcon: {
        height: verticalScale(35),
        width: moderateScale(35),
        tintColor: colors.white,
        marginRight: moderateScale(5)
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: verticalScale(8),
        alignItems: "center",
        marginBottom: verticalScale(5),
        width: '100%',
        alignSelf: "flex-start",
        marginLeft: -5
    },
    lines2: {
        width: '90%',
        height: 1,
        marginTop: verticalScale(15),
        marginBottom: verticalScale(15),
        backgroundColor: colors.blackOpacity40,
        alignSelf: "center"
    },
    attributesrowHeader: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: "center",
        alignItems: "flex-start",
    },
    pricrow: {
        flexDirection: "row",
        alignItems: "center"
    },
    BottomRow: {
        justifyContent: "space-between",
        width: "90%",
        alignSelf: "center",
        // paddingBottom: verticalScale(25)
    },
    incomingOrderView: {
        justifyContent: "space-between",
        width: "90%",
        alignSelf: "center",
    },
    scrollView: {
        maxHeight: verticalScale(200),
        minHeight: verticalScale(150),
        marginBottom: verticalScale(10)
    },
    attributesrowContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
    },
    VendorNameView: {
        width: "60%",
        alignItems: "flex-end"
    }
})