import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { useSelector } from 'react-redux';
import moment from 'moment';

import colors from '../../../styles/colors';
import { verticalScale } from '../../../styles/responsiveSize';
import { GET_EARNING_HISTORY, GET_TOTAL_PAYABLE } from '../../../Store/Action/EarningActions';
import { convertToISOFormat2 } from '../../../Store/Action/AppFunctions';

const MultipleDateSelection = ({
    setDatePickerModal,
    StartDate,
    EndDate,
    setPayoutData,
    setLoading,
    setSelectedTypee,
    setStartDate,
    setEndDate,
    setEarningHistory,
    partialStartDate,
    setPartialStartDate,
    partialEndDate,
    setPartialEndDate,
    selectedType
}) => {

    const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);
    const maximumDate = new Date();

    const handleDone = async () => {
        GET_TOTAL_PAYABLE(TokenId, UserDetail, setPayoutData, setLoading, convertToISOFormat2(moment(partialStartDate).format("YYYY-MM-DD 00:00:00")), convertToISOFormat2(moment(partialEndDate == undefined ? partialStartDate : partialEndDate).format("YYYY-MM-DD 23:59:00")))
        GET_EARNING_HISTORY(TokenId, UserDetail, setEarningHistory, setLoading, convertToISOFormat2(moment(partialStartDate).format("YYYY-MM-DD 00:00:00")), convertToISOFormat2(moment(partialEndDate == undefined ? partialStartDate : partialEndDate).format("YYYY-MM-DD 23:59:00")))
        setDatePickerModal(false);
        setSelectedTypee(null)
        setStartDate(partialStartDate);
        setEndDate(partialEndDate);
    };

    const closeModal = () => {
        setDatePickerModal(false);
        if (selectedType != null) {
            setStartDate(null);
            setEndDate(null);
            setPartialStartDate(undefined);
            setPartialEndDate(undefined);
        }
    }

    const handleConfirmDateSelection = (date, type) => {
        if (type === 'END_DATE') {
            setPartialEndDate(date);
        } else {
            setPartialStartDate(date)
            setPartialEndDate()
        }
    };


    const isDisabled = partialStartDate == undefined || partialStartDate == null;

    return (
        <View style={styles.contentContainer}>
            <View style={styles.modalContainer}>
                <CalendarPicker
                    startFromMonday
                    allowRangeSelection
                    futureScrollRange={0}
                    maxDate={maximumDate}
                    todayBackgroundColor={colors.white}
                    selectedDayColor={colors.theme}
                    selectedDayTextColor="#000"
                    onDateChange={handleConfirmDateSelection}
                    width={verticalScale(320)}
                    headerWrapperStyle={styles.headerWrapper}
                    selectedStartDate={StartDate}
                    selectedEndDate={EndDate}
                    allowBackwardRangeSelect
                    enableDateChange
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => closeModal()}
                        accessible
                        accessibilityLabel="Close date selection"
                    >
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={isDisabled}
                        style={[isDisabled ? styles.buttonDisable : styles.button]}
                        onPress={handleDone}
                        accessible
                        accessibilityLabel="Confirm selected dates">
                        <Text style={[isDisabled ? styles.buttonTextDisable : styles.buttonText]}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default MultipleDateSelection;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: "100%",
    },
    modalContainer: {
        backgroundColor: colors.white,
        width: "88%",
        paddingVertical: verticalScale(20),
        borderRadius: 10,
        alignSelf: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    headerWrapper: {
        marginTop: 12,
        marginHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: verticalScale(20),
    },
    button: {
        borderWidth: 1,
        padding: 12,
        width: "45%",
        alignItems: "center",
        borderRadius: 5,
        borderColor: colors.theme,
    },
    buttonText: {
        fontSize: 16,
        color: colors.theme,
        fontWeight: "bold",
    },
    buttonDisable: {
        borderWidth: 1,
        padding: 12,
        width: "45%",
        alignItems: "center",
        borderRadius: 5,
        borderColor: colors.gray,
    },
    buttonTextDisable: {
        fontSize: 16,
        color: colors.gray,
        fontWeight: "bold",
    }
});
