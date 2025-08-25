import React from 'react'
import { StyleSheet, View, Image } from 'react-native'

import imagePath from '../../constants/imagePath'
import { moderateScale, verticalScale } from '../../styles/responsiveSize'
import colors from '../../styles/colors'
import { ResponsiveFonts } from '../../constants/ResponsiveFonts'
import Label from '../Label/Label'
import { decryptVale } from '../../utils/Crypto'
import { StaticMethods } from '../../utils/StaticMethods'

const BidDetail = ({ bidViewData, DropOffDistance,  duration}) => {

    return (
        <View style={{ width: "90%" }}>

            <View style={styles.addresscontainer}>
                <View style={styles.OrderVendorNameText}>
                    <View style={styles.OrderVendorNameTextView}>
                        <Image source={imagePath.restImage} style={{ width: moderateScale(25), height: moderateScale(25), }} resizeMode="contain" />
                        <Label
                            label={bidViewData?.restaurantName}
                            textAlign={"left"}
                            color={colors.black}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                        />
                    </View>
                    <View style={styles.viewImage}>
                        <Image source={imagePath.Riderdetails} style={{ width: moderateScale(25), height: moderateScale(25) }} resizeMode="contain" />
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.viewImage}>
                        <Image source={imagePath.mapDirection} style={{ width: moderateScale(30), height: moderateScale(80) }} resizeMode="contain" />
                    </View>
                    <View style={styles.viewLabel}>

                        <Label
                            label={'Pick Up Address'}
                            textAlign={"left"}
                            color={colors.black}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            marginTop={3}
                        />

                        <Label
                            label={bidViewData?.pickupAddress}
                            textAlign={"left"}
                            color={colors.blackOpacity80}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        />
                        {bidViewData?.vendorAddress2 && (<Label
                            label={bidViewData?.vendorAddress2}
                            textAlign={"left"}
                            color={colors.blackOpacity80}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        />)}

                        <Label
                            label={'Delivery Address'}
                            textAlign={"left"}
                            color={colors.black}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            marginTop={8}
                        />
                        <Label
                            label={bidViewData?.deliveryAddress && decryptVale(bidViewData?.deliveryAddress)?.replace('$', ',')}
                            textAlign={"left"}
                            color={colors.blackOpacity80}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        />
                        {bidViewData?.userAddress2 && (<Label
                            label={bidViewData?.userAddress2 && decryptVale(bidViewData?.userAddress2)?.replace('$', ',')}
                            textAlign={"left"}
                            color={colors.blackOpacity80}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        />)}
                    </View>
                </View>
            </View>

            {bidViewData?.riderNote &&
                <>
                    <Label
                        label={'Delivery Note'}
                        color={colors.black}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                        marginTop={8}
                    />
                    <Label
                        label={bidViewData?.riderNote}
                        color={colors.theme}
                        ResponsiveFonts={ResponsiveFonts.textualStyles.small}
                        marginBottom={5}
                    />
                </>}

            {bidViewData?.BidAmount > 0 && (
                <View style={styles.row}>
                    <Label label={"Delivery Fare"} textAlign={"left"} color={colors.black} />
                    <Label
                        label={'$ ' + StaticMethods.getTwoDecimalPlacesString(bidViewData?.BidAmount || 0)}
                        textAlign={"center"}
                        color={colors.theme}
                    />
                </View>)}


            {bidViewData?.tip > 0 && (
                <View style={styles.row}>
                    <Label label={"Your Tip"} textAlign={"center"} color={colors.black} />
                    <Label
                        label={`$ ${StaticMethods.getTwoDecimalPlacesString(bidViewData?.tip) || 0}`}
                        textAlign={"center"}
                        color={colors.theme}
                    />
                </View>)}


            {bidViewData?.fdCommission > 0 &&
                <View style={styles.row}>
                    <Label label={"Foodosti Commission"} textAlign={"left"} color={colors.black} />
                    <Label
                        label={'- $ ' + StaticMethods.getTwoDecimalPlacesString(bidViewData?.fdCommission || 0)}
                        textAlign={"center"}
                        color={colors.theme}
                    />
                </View>}


            <View style={styles.milesView}>
                <View style={styles.leftRightImageContainer}>
                    <Image
                        source={imagePath.Riderdetails}
                        style={styles.BidImage}
                        resizeMode={'contain'}
                    />
                </View>
                <View style={styles.middleContainer}>
                    <View style={styles.rowSpaceBetween}>
                        <Label
                            label={"Est. Distance"}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            textAlign={"center"}
                            color={colors.black}
                        />
                        <Label
                            label={DropOffDistance ? DropOffDistance : 'loading'}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            textAlign={"center"}
                            color={colors.theme}
                        />
                    </View>
                    <Image
                        source={imagePath.Riderdetails01}
                        style={styles.middleImage}
                        resizeMode={'contain'}
                    />
                    <View style={styles.rowSpaceBetween}>
                        <Label
                            label={"Est. Time"}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            textAlign={"center"}
                            color={colors.black}
                        />
                        <Label
                            label={duration ? duration : 'loading'}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.smallBold}
                            textAlign={"center"}
                            color={colors.theme}
                        />
                    </View>
                </View>
                <View style={styles.leftRightImageContainer1}>
                    <Image
                        source={imagePath.Riderdetails}
                        style={styles.BidImage}
                        resizeMode={'contain'}
                    />
                </View>
            </View>

        </View>
    )
}

export default BidDetail


const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        width: "100%",
        alignSelf: "center",
        justifyContent: "space-between",
        alignItems: "center",

    },
    image: {
        width: "50%",
        height: verticalScale(100),
        alignSelf: "center",
    },
    addresscontainer: {
        width: "100%",
        alignSelf: "center",
        paddingVertical: 10,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        backgroundColor: 'white',
        elevation: 10,
        marginHorizontal: 10,
        marginTop: 5,
        marginBottom: verticalScale(15)
    },
    OrderVendorNameText: {
        flexDirection: 'row',
        height: verticalScale(30)
    },
    OrderVendorNameTextView: {
        width: '90%',
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5
    },
    viewImage: {
        width: '10%'
    },
    viewLabel: {
        width: '90%'
    },
    BidImage: {
        width: 20,
        height: 20
    },
    milesView: {
        width: '100%',
        backgroundColor: '#fff3f5',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        padding: 5,
        marginTop: verticalScale(20),
        padding: 10
    },
    leftRightImageContainer: {
        width: '10%',
    },
    leftRightImageContainer1: {
        width: '10%',
        alignItems: 'flex-end'
    },
    middleContainer: {
        width: '80%',
    },
    rowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    middleImage: {
        width: '100%',
        paddingVertical: verticalScale(5),
        alignSelf: 'center',
    },
    image: { width: '100%', height: '100%', },
});