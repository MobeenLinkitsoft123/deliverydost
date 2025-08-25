import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, RefreshControl, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';

import HeaderAuth from '../../../Components/HeaderAuth/HeaderAuth';
import PayoutItem from './EarningItem';
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts';
import Loader from '../../../Components/Modals/Modals/Loader';
import styles from './styles';
import imagePath from '../../../constants/imagePath';
import { GET_EARNING_HISTORY, GET_TOTAL_PAYABLE } from '../../../Store/Action/EarningActions';
import AnimatedModal from '../../../Components/Modals/AnimatedModal';
import { returnUserDetailData } from '../../../utils/helperFunctions';
import AnimatedTopTabs from '../../../Components/AnimatedTopTabs/AnimatedTopTabs';
import TextLabel from '../../../Components/TextLabel/TextLable';
import colors from '../../../styles/colors';
import MultipleDateSelection from '../../../Components/Modals/Modals/MultipleDateSelection';
import CustomModalFixed from '../../../Components/Modals/CustomModalFixed';
import { StaticMethods } from '../../../utils/StaticMethods';
import PayoutDetailModel from '../../../Components/Modals/PayoutDetailModel';
import { convertToISOFormat2 } from '../../../Store/Action/AppFunctions';
import { verticalScale } from '../../../styles/responsiveSize';

const EarningPayout = () => {

    const isFocus = useIsFocused()
    const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);
    const userDetailDecrypted = returnUserDetailData(UserDetail);
    const payOutSheetRef = useRef(null);

    const [EarningHistory, setEarningHistory] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState(0);
    const [datePickerModal, setDatePickerModal] = useState(false)
    const [StartDate, setStartDate] = useState()
    const [EndDate, setEndDate] = useState();
    const [partialStartDate, setPartialStartDate] = useState();
    const [partialEndDate, setPartialEndDate] = useState();

    const [PayoutData, setPayoutData] = useState()
    const [isRefereshing, setisRefereshing] = useState(false);
    const [singlePayoutData, setsinglePayoutData] = useState(false);

    const getData = async () => {
        setSelectedType(0)
        GET_EARNING_HISTORY(TokenId, userDetailDecrypted, setEarningHistory, setLoading, convertToISOFormat2(moment().format("YYYY-MM-DD 00:00:00")), convertToISOFormat2(moment().format("YYYY-MM-DD 23:59:00")))
        GET_TOTAL_PAYABLE(TokenId, UserDetail, setPayoutData, setLoading, convertToISOFormat2(moment().format("YYYY-MM-DD 00:00:00")), convertToISOFormat2(moment().format("YYYY-MM-DD 23:59:00")))
    }

    const getTotalPayable = async (start_date, end_date) => {
        const formattedStartDate = convertToISOFormat2(moment(start_date || StartDate).format("YYYY-MM-DD 00:00:00"));
        const formattedEndDate = convertToISOFormat2(moment(end_date || EndDate || start_date || StartDate).format("YYYY-MM-DD 23:59:00"));
        GET_EARNING_HISTORY(TokenId, userDetailDecrypted, setEarningHistory, setLoading, formattedStartDate, formattedEndDate)
        GET_TOTAL_PAYABLE(TokenId, UserDetail, setPayoutData, setLoading, formattedStartDate, formattedEndDate);
    };


    const ListEmptyComponent = () => {
        return (
            <Text style={[styles.nodatatext, ResponsiveFonts.textualStyles.largeNormal]}>No Record Found</Text>
        )
    }

    useEffect(() => {
        if (isFocus) {
            getData()
        }
    }, [isFocus])


    const OnRefresh = async () => {
        try {
            let newStartDate, newEndDate;
            switch (selectedType) {
                case 0:
                    newStartDate = moment().startOf('day');
                    newEndDate = moment().endOf('day');
                    break;
                case 1:
                    newStartDate = moment().startOf('isoWeek');
                    newEndDate = moment().endOf('isoWeek');
                    break;
                case 2:
                    newStartDate = moment().startOf('month');
                    newEndDate = moment().endOf('month');
                    break;
                default:
                    newStartDate = StartDate;
                    newEndDate = EndDate;
            }

            const formattedStartDate = moment(newStartDate).format("YYYY-MM-DD 00:00:00");
            const formattedEndDate = moment(newEndDate || newStartDate).format("YYYY-MM-DD 23:59:00");
            GET_EARNING_HISTORY(TokenId, userDetailDecrypted, setEarningHistory, setisRefereshing, convertToISOFormat2(formattedStartDate), convertToISOFormat2(formattedEndDate))
            GET_TOTAL_PAYABLE(TokenId, UserDetail, setPayoutData, setisRefereshing, convertToISOFormat2(formattedStartDate), convertToISOFormat2(formattedEndDate))
        } catch (error) {
            setisRefereshing(false)
            console.log('error===>', error)
        }
    }

    const onChangeFilter = (selectedTab) => {
        let newStartDate, newEndDate;
        switch (selectedTab) {
            case 0:
                newStartDate = moment().startOf('day');
                newEndDate = moment().endOf('day');
                break;
            case 1:
                newStartDate = moment().startOf('isoWeek');
                newEndDate = moment().endOf('isoWeek');
                break;
            case 2:
                newStartDate = moment().startOf('month');
                newEndDate = moment().endOf('month');
                break;
            default:
                return;
        }
        setStartDate();
        setEndDate();
        getTotalPayable(newStartDate, newEndDate);
        setSelectedType(selectedTab);

    };

    const customSearch = async () => {
        setSelectedType(0);
        setStartDate();
        setEndDate();
        getData();
        setPartialStartDate(undefined);
        setPartialEndDate(undefined);
    }

    const onViewPayoutDetail = (resp) => {
        const data = resp && JSON.parse(resp)
        if (data?.length > 0) {
            setsinglePayoutData(data);
            payOutSheetRef?.current?.open()
        }
    }

    return (
        <View style={styles.container}>
            <HeaderAuth label={'Earnings'} />
            <AnimatedTopTabs
                list={[{ label: "Today" }, { label: "This Week" }, { label: "This Month" }]}
                setSelectedType={onChangeFilter}
                selectedType={selectedType}
                isRestaurant={true} />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isRefereshing}
                        onRefresh={() => OnRefresh()}
                    />
                }>

                <View
                    style={styles.rowDate}>
                    <View style={[styles.row, { flex: 0.3, }]} >
                        <Image source={imagePath.MartIcon6} style={{ width: 20, height: 20, }} resizeMode="contain" />
                    </View>
                    <TouchableOpacity style={[styles.row, { flex: 1, }]} onPress={() => setDatePickerModal(true)}>
                        <TextLabel
                            label={
                                StartDate
                                    ? `${moment(StartDate).format("MM/DD/YYYY")} - ${moment(EndDate || StartDate).format("MM/DD/YYYY")}`
                                    : "Search Custom Date"
                            }
                            color={"#000"}
                            ResponsiveFonts={ResponsiveFonts.textualStyles.medium}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, { flex: 0.3, }]} onPress={StartDate ? customSearch : () => setDatePickerModal(true)}>
                        <Image source={StartDate ? imagePath.close : imagePath.rightArrow} style={{ width: 20, height: 20, tintColor: colors.theme, }} resizeMode="contain" />
                    </TouchableOpacity>
                </View>

                <ImageBackground source={imagePath.paymentCard} style={styles.paymentCard} resizeMode="stretch">
                    <Text style={[styles.paymentamount, ResponsiveFonts.textualStyles.xxxlarge]}>
                        $ {StaticMethods.getTwoDecimalPlacesString(PayoutData?.todaysEarnings || 0)}
                    </Text>
                    <View style={styles.textRow}>
                        <Image source={imagePath.currencyImage} style={styles.PayOutIcons} resizeMode="contain" />
                        <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.medium]}>Total Earnings</Text>
                    </View>
                </ImageBackground>

                {/* {[{ label: "RECEIVED AMOUNT", value: PayoutData?.recievedAmount || 0, icon: imagePath.recivedMoney, color: colors.green1 },
                    { label: "OUTSTANDING AMOUNT", value: PayoutData?.outstandingPayment || 0, icon: imagePath.pendingMoney, color: colors.theme },
                    { label: "TIP AMOUNT", value: PayoutData?.tipCollection || 0, icon: imagePath.tipMoney, color: colors.orange }
                ].map((item, index) => (
                    <View key={index} style={styles.moneyContainer}>
                        <View>
                            <Text style={[styles.paymentamount, { fontWeight: "700" }, ResponsiveFonts.textualStyles.largeNormal]}>
                                $ {StaticMethods.getTwoDecimalPlacesString(item.value)}
                            </Text>
                            <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.small]}>{item.label}</Text>
                        </View>
                        <Image source={item.icon} style={styles.moneyIcon} resizeMode="contain" />
                        <View style={[styles.fixedline, { backgroundColor: item.color }]} />
                    </View>
                ))} */}

                <View style={[styles.moneyContainer, { paddingVertical: verticalScale(10) }]}>
                    <View>
                        <Text style={[styles.paymentamount, { fontWeight: "700" }, ResponsiveFonts.textualStyles.largeNormal]}>
                            $ {StaticMethods.getTwoDecimalPlacesString(PayoutData?.tipCollection || 0)}
                        </Text>
                        <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.small]}>
                            TIP AMOUNT
                        </Text>
                        <View style={{ height: verticalScale(10) }} />
                        <Text style={[styles.paymentamount, { fontWeight: "700" }, ResponsiveFonts.textualStyles.largeNormal]}>
                            $ {StaticMethods.getTwoDecimalPlacesString(PayoutData?.recievedAmount || 0)}
                        </Text>
                        <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.small]}>
                            RECEIVED AMOUNT
                        </Text>
                    </View>

                    <Image source={imagePath.recivedMoney} style={styles.moneyIcon2} resizeMode="contain" />
                    <View style={[styles.fixedline2, { backgroundColor: colors.green1 }]} />
                </View>

                <View style={styles.moneyContainer}>
                    <View>
                        <Text style={[styles.paymentamount, { fontWeight: "700" }, ResponsiveFonts.textualStyles.largeNormal]}>
                            $ {StaticMethods.getTwoDecimalPlacesString(PayoutData?.outstandingPayment || 0)}
                        </Text>
                        <Text style={[styles.paymentDetails, ResponsiveFonts.textualStyles.small]}>
                            OUTSTANDING AMOUNT
                        </Text>
                    </View>

                    <Image source={imagePath.pendingMoney} style={styles.moneyIcon} resizeMode="contain" />

                    <View style={[styles.fixedline, { backgroundColor: colors.theme }]} />
                </View>


                <Text style={[styles.payouthistory, ResponsiveFonts.textualStyles.large]}>PayOut History</Text>
                <View style={styles.lines} />

                {(EarningHistory?.transactions || [])?.map((item) => {
                    return (
                        <PayoutItem item={item} setsinglePayoutData={setsinglePayoutData} onViewPayoutDetail={onViewPayoutDetail} />
                    )
                })}

                <View style={{ marginBottom: 10 }} />

                {Loading != true && EarningHistory?.transactions?.length == 0 ? <ListEmptyComponent /> : null}

            </ScrollView>

            <CustomModalFixed visible={datePickerModal} onClose={() => setDatePickerModal(false)}>
                <MultipleDateSelection
                    setDatePickerModal={setDatePickerModal}
                    StartDate={StartDate}
                    setPayoutData={setPayoutData}
                    setLoading={setLoading}
                    EndDate={EndDate}
                    setSelectedTypee={setSelectedType}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    partialStartDate={partialStartDate}
                    setPartialStartDate={setPartialStartDate}
                    partialEndDate={partialEndDate}
                    setPartialEndDate={setPartialEndDate}
                    selectedType={selectedType}
                    setEarningHistory={setEarningHistory} />
            </CustomModalFixed>

            {Loading && (
                <AnimatedModal visible={Loading} onClose={() => { setLoading(false) }} >
                    <Loader />
                </AnimatedModal>
            )}

            <PayoutDetailModel payOutSheetRef={payOutSheetRef} payOutDetail={singlePayoutData} onClose={() => payOutSheetRef?.current?.close()} />


        </View>
    )
}

export default EarningPayout