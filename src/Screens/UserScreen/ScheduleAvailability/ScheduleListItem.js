import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

import { ResponsiveFonts } from '../../../constants/ResponsiveFonts';
import colors from '../../../styles/colors';
import imagePath from '../../../constants/imagePath';
import { returnUserDetailData } from '../../../utils/helperFunctions';

const formatToLocalTime = (serverTime) => {
    const localTime = moment.utc(serverTime, 'HH:mm:ss').local();
    return {
        formattedTime: localTime.format('hh:mm A'),
        period: localTime.format('A')
    };
};

const formatToISO = (localTimeString) => {
    return moment(localTimeString, 'hh:mm A').utc().format('HH:mm:00');
};

const formatToLocalTime1 = (time) => {
    const localTime = moment.utc(time, 'HH:mm:ss').local();
    return localTime.format('HH:mm:00');
};


const ScheduleListItem = forwardRef(({
    slot,
    index,
    slots,
    setSlots,
    loadSlots,
    setLoading,
    handleDeleteSlot,
    updateSlot,
    day
}, ref) => {

    useImperativeHandle(ref, () => ({
        cancelBtnFucntion, // Exposing the function to parent
    }));

    const { UserDetail } = useSelector((state) => state?.AuthReducer);

    const userDetailDecrypted = returnUserDetailData(UserDetail);

    const RIDER_ID = userDetailDecrypted?.Id;

    const [showPicker, setShowPicker] = useState(false);
    const [startTime, setStartTime] = useState(slot?.timeFrom);
    const [endTime, setEndTime] = useState(slot?.timeTo);
    const [isEditing, setIsEditing] = useState(false);
    const [editSlotId, setEditSlotId] = useState(null);
    const [check, setCheck] = useState(null);
    const [disableBtn, setDisableBtn] = useState(true);
    const [modalMsg, setModalMsg] = useState("");

    useEffect(() => {
        setStartTime(slot?.timeFrom);
        setEndTime(slot?.timeTo);
    }, [slot]);

    const isCurrentTimeInSchedule = (scheduleDay, start, end) => {

        const start1 = formatToLocalTime1(start)
        const end1 = formatToLocalTime1(end)
        const now = moment();

        const currentDay = now.format('dddd') // e.g., "M" for Monday
        const scheduleDayInitial = scheduleDay // e.g., "M" for Monday



        if (currentDay !== scheduleDayInitial) {
            return false; // Allow editing/deleting if current day is different from schedule day
        }

        const startTime = moment(start1, 'HH:mm:ss');
        const endTime = moment(end1, 'HH:mm:ss');

        // Check if current time is between start and end times
        return now.isBetween(startTime, endTime);
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowPicker(false);
        if (event) {
            const eventTime = moment(moment(event).toLocaleString()).format('HH:mm:00');

            // Check if current time is within the slot's time range before making changes
            if (isCurrentTimeInSchedule(day, startTime, endTime)) {
                setModalMsg("Cannot change schedule during active time period.");
                return;
            }

            const startLimit = moment('00:00:00', 'HH:mm:ss').format('HH:mm:00');
            const endLimit = moment('23:59:00', 'HH:mm:ss').format('HH:mm:00');

            if (moment(eventTime).isBefore(endLimit) || moment(eventTime).isAfter(startLimit)) {
                setModalMsg("Time should be between 12:00 AM and 11:59 PM");
                return;
            }

            if (check === 1) {
                if (formatToLocalTime1(endTime) === eventTime) {
                    setModalMsg("Online and Offline times should not be the same")
                    return
                } else if (formatToLocalTime1(endTime) < eventTime) {
                    setModalMsg("Online should not be greater than offline time")
                    return
                } else {
                    setStartTime(formatToISO(eventTime));
                }
            } else if (check === 2) {
                if (formatToLocalTime1(startTime) === eventTime) {
                    setModalMsg("Online and Offline times should not be the same")
                    return
                } else if (formatToLocalTime1(startTime) > eventTime) {
                    setModalMsg("Offline should not be less than online time")
                    return
                } else {
                    setEndTime(formatToISO(eventTime));
                }
            }
        }
    };

    const handleReset = (id) => {
        if (isCurrentTimeInSchedule(day, startTime, endTime)) {
            setModalMsg("Cannot edit schedule during active time period.");
            return;
        }
        setIsEditing(true);
        setEditSlotId(id);
        setDisableBtn(false);
        setModalMsg("");
    };

    const handleTimeSelection = (type) => {
        setCheck(type);
        setShowPicker(true);
        setModalMsg("");
    };

    const cancelBtnFucntion = () => {
        setIsEditing(false);
        setLoading(false);
        setShowPicker(false);
        setEditSlotId(null);
        setDisableBtn(true);
        setModalMsg("");
        setStartTime(slot?.timeFrom);
        setEndTime(slot?.timeTo);
    };

    const updateSlotFunction = async (id, day, start, end) => {

        const updatedSlot = {
            riderId: RIDER_ID,
            day: day,
            timeFrom: start,
            timeTo: end,
            isActive: 1,
            isDeleted: 0
        };

        setModalMsg("");
        await updateSlot(id, day, start, end).then((res) => {
            if (res === 'Schedule Updated') {
                setSlots(slots.map(slot =>
                    slot.id === id
                        ? { ...slot, ...updatedSlot }
                        : slot
                ));
                cancelBtnFucntion();
            }
        });
    };

    return (
        <>
            <View style={styles.mainCont} key={index}>
                <View style={styles.slotContainer}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={imagePath.icon15}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={[ResponsiveFonts.textualStyles.smallBold, styles.startTimeText]}>
                            Online Time
                        </Text>
                        <TouchableOpacity disabled={disableBtn} onPress={() => handleTimeSelection(1)}>
                            <Text style={[ResponsiveFonts.textualStyles.medium, isEditing ? styles.timeText1 : styles.timeText]}>
                                {startTime ? formatToLocalTime(startTime).formattedTime : 'Select Time'}
                            </Text>
                        </TouchableOpacity>
                        {isEditing && <TouchableOpacity style={styles.resetButton1} onPress={cancelBtnFucntion}>
                            <Text style={[ResponsiveFonts.textualStyles.medium, styles.resetButtonText]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>}
                    </View>
                    <View style={styles.divider}><View style={{ backgroundColor: 'black', width: 1, height: 50 }} /></View>
                    <View style={styles.timeContainer}>
                        <Text style={[ResponsiveFonts.textualStyles.smallBold, styles.endTimeText]}>
                            Offline Time
                        </Text>
                        <TouchableOpacity disabled={disableBtn} onPress={() => handleTimeSelection(2)}>
                            <Text style={[ResponsiveFonts.textualStyles.medium, isEditing ? styles.timeText1 : styles.timeText]}>
                                {endTime ? formatToLocalTime(endTime).formattedTime : 'Select Time'}
                            </Text>
                        </TouchableOpacity>
                        {(isEditing && slot?.id === editSlotId) ? (
                            <TouchableOpacity
                                disabled={slot?.timeFrom === startTime && slot?.timeTo === endTime ? true : false}
                                style={slot?.timeFrom === startTime && slot?.timeTo === endTime ? styles.saveButton1 : styles.saveButton}
                                onPress={() => updateSlotFunction(slot?.id, slot?.day, startTime, endTime)}>
                                <Text style={[ResponsiveFonts.textualStyles.medium, styles.saveButtonText]}>
                                    Save
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    {(slot.timeFrom && slot.timeTo) && (
                        <TouchableOpacity style={styles.deleteButton}>
                            <TouchableOpacity onPress={() => {
                                if (isCurrentTimeInSchedule(day, startTime, endTime)) {
                                    setModalMsg("Cannot delete schedule during active time period.");
                                    return;
                                }
                                handleDeleteSlot(slot.id)
                            }}>
                                <Image
                                    source={imagePath.trashIcon}
                                    style={styles.trashIcon}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>)}
                </View>
                {!isEditing && (<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <TouchableOpacity style={styles.resetButton} onPress={() => handleReset(slot?.id)}>
                        <Text style={[ResponsiveFonts.textualStyles.medium, styles.resetButtonText]}>
                            Edit
                        </Text>
                    </TouchableOpacity>
                </View>)}
                {modalMsg && (<View style={{ width: '100%', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[ResponsiveFonts.textualStyles.medium, styles.resetButtonText]}>
                        {modalMsg}
                    </Text>
                </View>)}
            </View>


            {showPicker && (
                <DateTimePicker
                    isVisible={showPicker}
                    date={new Date()}
                    mode="time"
                    onCancel={() => setShowPicker(false)}
                    onConfirm={handleTimeChange}
                />
            )}
        </>
    );
});

export default ScheduleListItem;

const styles = StyleSheet.create({
    mainCont: {
        flexDirection: 'column',
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    slotContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    iconContainer: {
        flex: 1.5,
    },
    icon: {
        width: 30,
        height: 30,
        tintColor: colors.theme,
    },
    timeContainer: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startTimeText: {
        color: colors.theme,
        paddingBottom: 5,
    },
    timeText: {
        color: colors.black,
        paddingBottom: 10,
    },
    timeText1: {
        color: colors.blackOpacity40,
        paddingBottom: 10,
    },
    saveButton: {
        backgroundColor: colors.theme,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: '80%',
    },
    saveButton1: {
        backgroundColor: colors.blackOpacity50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: '80%',
    },
    saveButtonText: {
        color: colors.white,
    },
    divider: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    endTimeText: {
        color: colors.theme,
        paddingBottom: 5,
    },

    resetButton: {
        backgroundColor: colors.white,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: '40%',
        borderColor: colors.theme,
        borderWidth: 1
    },
    resetButton1: {
        backgroundColor: colors.white,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: '80%',
        borderColor: colors.theme,
        borderWidth: 1
    },
    resetButtonText: {
        color: colors.theme,
    },
    deleteButton: {
        flex: 1.5,
    },
    trashIcon: {
        width: 30,
        height: 30,
        alignSelf: 'flex-end',
    },
});

