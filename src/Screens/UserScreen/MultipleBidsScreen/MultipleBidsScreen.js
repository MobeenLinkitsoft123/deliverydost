import React, { useState, useEffect } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';

import { moderateScale, textScale, width } from '../../../styles/responsiveSize'
import colors from '../../../styles/colors'
import fontFamily from '../../../styles/fontFamily'
import imagePath from '../../../constants/imagePath'
import BidListItem from '../../../Components/NewBidsModalize/BidListItem'
import PlaceBidModal from '../../../Components/Modals/Modals/PlaceBidModal'
import { useSelector } from 'react-redux';
import LoaderFixed from '../../../Components/LoaderFixed/LoaderFixed';
import { GET_METHOD } from '../../../utils/ApiCallingMachnisem';
import AnimatedModal from '../../../Components/Modals/AnimatedModal';
import { returnUserDetailData } from '../../../utils/helperFunctions';

const MultipleBidsScreen = ({ navigation }) => {

    const RouteData = useRoute();
    const { bids } = RouteData?.params;
    const [Bids, SetBids] = useState([]);
    const [ItemCount, setItemCount] = useState([]);
    const [PlaceBidModalShow, setPlaceBidModal] = useState(false);
    const [BidModalData, setBidModalData] = useState({});
    const [BiddingAmount, SetBiddingAmount] = useState();
    const focus = useIsFocused()
    const [loading, setLoading] = useState(false)
    const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);

  const userDetailDecrypted = returnUserDetailData(UserDetail);

    const MartData = bids[0]
    const FilterData = Bids?.every((value) => value?.IsVisible == 1);
    const getData = async () => {
        setLoading(true)
        try {
            setLoading(false)
            const BiddingAmount = await GET_METHOD("api/DMSRiderDetailAcc");
            if (BiddingAmount) {
                SetBiddingAmount(BiddingAmount);
            } else {
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            alert('Unable to find biding amount')
            navigation.goBack()
        }
    }
    useEffect(() => {
        getData()
    }, [focus])

    useEffect(() => {
        const AddingTypeToData = bids?.map((value, index) => {
            return { ...value, IsVisible: 0 }
        });
        SetBids(AddingTypeToData)
    }, []);

    useEffect(() => {
        if (ItemCount?.length == Bids?.length && Bids?.length == 2) navigation.goBack();
    }, [ItemCount, FilterData])

    if (FilterData && Bids?.length > 0) navigation.goBack();


    return (
        <>
            <View style={styles.container}>
                <View style={styles.Header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backImg, styles.conLeft]}>
                        <Image
                            resizeMode='contain'
                            source={imagePath.BackCircle}
                            style={styles.img}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>New Rides</Text>
                    <View style={styles.width10} />
                </View>
                <View style={[styles.storeImg, styles.circle]}>
                    <Image
                        style={[styles.img, styles.circle]}
                        source={{ uri: MartData.OrderVendorPic }}
                        resizeMode='contain'
                    />
                </View>
                <View style={styles.storeNameCon}>
                    <Text style={styles.storeNameText}>{MartData?.OrderVendorName}</Text>
                </View>
                <View style={styles.separator}>
                    <Image
                        source={imagePath.MartBidImage}
                        resizeMode='stretch'
                        style={styles.img}
                    />
                </View>

                <View style={styles.bottomCon}>
                    {Bids.filter((val, ind) => val?.IsVisible == 0)?.map((value, index) => {
                        return (
                            <BidListItem value={value} key={index} setPlaceBidModal={(data, intervalSeconds) => {
                                setBidModalData({ value: data, intervalSeconds: intervalSeconds });
                                setPlaceBidModal(true)
                            }} setItemCount={setItemCount} ItemCount={ItemCount} />

                        )

                    })}
                </View>

                {loading && <LoaderFixed />}

            </View>

            {PlaceBidModalShow && (
                <AnimatedModal visible={PlaceBidModalShow} onClose={() => { setPlaceBidModal(false) }} >
                    <PlaceBidModal
                        setRideStatus={() => { }}
                        UserDetail={userDetailDecrypted}
                        BidModalData={BidModalData}
                        CloseBidModal={() => setPlaceBidModal(false)}
                        onIgnoreBid={() => {
                            setPlaceBidModal(false)
                        }}
                        EliminateRides={() => {
                            const UpdateData = Bids.filter((val, ind) => val?.IsVisible == 0)?.map((val, ind) => {
                                if (val?.Neworderid == BidModalData?.value?.Neworderid) {
                                    return { ...val, IsVisible: 1 }
                                } else {
                                    return { ...val, IsVisible: 0 }
                                }
                            })
                            SetBids(UpdateData)
                        }}
                        TokenId={TokenId}
                        RidreProgressCheck={() => { }}
                        BiddingAmount={BiddingAmount}
                    />
                </AnimatedModal>
            )}
        </>
    )
}

export default MultipleBidsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    centerCon: {
        width: width * 0.9,
        paddingBottom: moderateScale(10),
        backgroundColor: colors.white,
        borderRadius: moderateScale(15)
    },
    Header: {
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(55),
        backgroundColor: colors.theme,
        zIndex: -99,
        borderTopLeftRadius: moderateScale(15),
        borderTopRightRadius: moderateScale(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(20)
    },
    headerText: {
        fontFamily: fontFamily.bold,
        color: colors.white,
        fontSize: textScale(22),
        marginTop: moderateScale(20),
    },
    storeImg: {
        width: moderateScale(60),
        height: moderateScale(60),
        alignSelf: 'center',
        marginTop: -moderateScale(30)
    },
    circle: {
        borderRadius: width / 2
    },
    img: {
        height: '100%',
        width: '100%'
    },
    storeNameCon: {
        width: '100%',
        alignItems: "center",
        marginVertical: moderateScale(10)
    },
    storeNameText: {
        fontFamily: fontFamily.bold,
        color: colors.gray,
        fontSize: textScale(20)
    },
    pontingCon: {
        width: '100%',
        alignItems: 'center'
    },
    separator: {
        width: '100%',
        height: moderateScale(26)
    },
    timerCon: {
        width: '100%',
        alignItems: 'center',
        marginVertical: moderateScale(15)
    },
    timerText: {
        fontFamily: fontFamily.regular,
        color: colors.gray,
        fontSize: textScale(20)
    },
    timerText2: {
        fontFamily: fontFamily.bold,
        color: colors.gray,
        fontSize: textScale(20)
    },
    timerText3: {
        fontFamily: fontFamily.regular,
        color: colors.gray,
        fontSize: textScale(20)
    },
    bottomCon: {
        width: '95%',
        alignSelf: 'center',
        marginTop: '10%'
    },
    bottomCard: {
        width: '100%',
        borderColor: colors.theme,
        borderWidth: 1,
        borderRadius: moderateScale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(15),
        alignItems: 'center',
        paddingVertical: moderateScale(10),
        marginBottom: moderateScale(10)
    },
    bottomCardLeft: {
        height: moderateScale(40),
        width: moderateScale(40)
    },
    bottomRightCon: {
        width: '70%'
    },
    bottomRightConText: {
        fontFamily: fontFamily.bold,
        fontSize: textScale(18),
        color: colors.gray
    },
    bottomRightConText1: {
        fontFamily: fontFamily.regular,
        fontSize: textScale(15),
        color: colors.gray
    },
    backImg: {
        height: moderateScale(40),
        width: moderateScale(40)
    },
    width10: {
        width: '10%'
    },
    conLeft: {
        top: moderateScale(7)
    }
})