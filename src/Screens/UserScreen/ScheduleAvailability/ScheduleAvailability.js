import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import colors from '../../../styles/colors';
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts';
import HeaderAuth from '../../../Components/HeaderAuth/HeaderAuth';
import ScheduleListItem from './ScheduleListItem';
import Loader from '../../../Components/Modals/Modals/Loader';
import { createSchedule, deleteSchedule, updateSchedule } from '../../../Store/Action/ScheduleFunctions';
import AnimatedModal from '../../../Components/Modals/AnimatedModal';
import ModalPattern1 from '../../../Components/Modals/Modals/ModalPattern1';
import { height, verticalScale, width } from '../../../styles/responsiveSize';
import { returnUserDetailData } from '../../../utils/helperFunctions';

const formatToLocalTime = (time) => {
    const formattedTime = moment(time, 'HH:mm:ss').format('hh:mm A');

    const period = moment(time, 'HH:mm:ss').format('A');

    return {
        formattedTime,
        period
    };
};

const formatToISO = (localTimeString) => {
    const localDate = new Date(localTimeString);

    const hours = localDate.getUTCHours().toString().padStart(2, '0');
    const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');

    const isoTimeString = `${hours}:${minutes}:00`;
    return isoTimeString;
};

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
        <View style={{
            position: 'absolute',
            zIndex: 888,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            width: '100%',
            height: height + 80,
        }}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer1}>
                    <Text style={[ResponsiveFonts.textualStyles.large, styles.modalText]}>Are you sure you want to delete this schedule?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={{ backgroundColor: colors.blackOpacity50, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 }} onPress={onCancel}>
                            <Text style={[ResponsiveFonts.textualStyles.medium, { color: 'white' }]} >Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: colors.theme, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 }} onPress={onConfirm}>
                            <Text style={[ResponsiveFonts.textualStyles.medium, { color: 'white' }]}  >Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View >
    );
};

const ScheduleAvailability = () => {

    const scheduleRefs = useRef([]);

    const handleCancelForAll = () => {
        // Loop through each ref and call the cancelBtnFucntion if it exists
        scheduleRefs.current.forEach((ref) => {
            if (ref && ref.cancelBtnFucntion) {
                ref.cancelBtnFucntion();
            }
        });
    };

    const route = useRoute();
    const { day } = route.params;  // Accessing passed daySlots data
    const dispatch = useDispatch();

    const { UserDetail } = useSelector((state) => state?.AuthReducer);
    const { scheduleData } = useSelector((state) => state?.AppReducer);

    const userDetailDecrypted = returnUserDetailData(UserDetail);

    const [slots, setSlots] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [check, setCheck] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [modalMsg, setmodalmsg] = useState("");
    const [modalMsg1, setmodalmsg1] = useState("");
    const [errorModal, seterrorModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [deleteId, setdeleteId] = useState();
    const [startTime1, setStartTime1] = useState(null);
    const [endTime1, setEndTime1] = useState(null);

    useEffect(() => {
        const filteredSlots = scheduleData?.filter((slot) => slot?.day === day);
        const sortedSlots = filteredSlots.sort((a, b) => (moment.utc(a.timeFrom, 'HH:mm:ss').local().format('HH:mm:ss') > moment.utc(b.timeFrom, 'HH:mm:ss').local().format('HH:mm:ss')) ? 1 : ((moment.utc(b.timeFrom, 'HH:mm:ss').local().format('HH:mm:ss') > moment.utc(a.timeFrom, 'HH:mm:ss').local().format('HH:mm:ss')) ? -1 : 0))
        setSlots(sortedSlots || []);  // Use filtered slots or an empty array
    }, [scheduleData, day]);

    const handleAddSlot = () => {
        if (userDetailDecrypted?.verificationStatus == 0) {
            handleCancelForAll()
            setShowModal(true);
            setmodalmsg1("")
        } else if (userDetailDecrypted?.verificationStatus == 1) {
            setmodalmsg("You cannot create schedule until you are approved by admin")
            seterrorModal(true)
        }
    };

    const handleCreateSlot = async () => {
        const startMoment = moment(startTime, 'HH:mm:ss');
        const endMoment = moment(endTime, 'HH:mm:ss');

        const startLimit = moment('00:00:00', 'HH:mm:ss'); // 12:00 AM
        const endLimit = moment('24:00:00', 'HH:mm:ss');   // 12:00 PM

        if (startMoment.isBefore(startLimit) || startMoment.isAfter(endLimit) ||
            endMoment.isBefore(startLimit) || endMoment.isAfter(endLimit)) {
            setmodalmsg1("Online and offline times should be between 12:00 AM and 11:59 PM");
            return;
        }

        if (!startTime || !endTime || startMoment.isSameOrAfter(endMoment)) {
            setmodalmsg1("Online time should be less than offline time");
            return;
        }

        if (startMoment.isSame(endMoment)) {
            setmodalmsg1("Online and offline times should not be the same");
            return;
        }
        if (moment(startTime, 'HH:mm:ss').format('hh:mm A') === moment(endTime, 'HH:mm:ss').format('hh:mm A')) {
            setmodalmsg1("Start time and end time should not be same!")
            return
        }

        setLoading(true);

        createSchedule(userDetailDecrypted, day, startTime1, endTime1, dispatch, setLoading, seterrorModal, setmodalmsg)
            .then((res) => {
                if (res !== 'Schedule Overlapped') {
                    setStartTime(null);
                    setEndTime(null);
                    setShowModal(false);
                } else if (res === 'Schedule Overlapped') {
                    setmodalmsg1("Schedule time must not be the same from other schedule.")
                }
            })
            .catch((error) => {
                console.error('Error creating slot:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleTimeSelection = (ind) => {
        setCheck(ind)
        setShowPicker(true);
        setmodalmsg1("")
    }

    const handleTimeChange = (event, selectedTime) => {
        setShowPicker(false);
        if (event) {
            const eventTime = moment(moment(event).toLocaleString()).format('HH:mm:ss');
            const selectedMoment = moment(eventTime, 'HH:mm:ss A');
            const startLimit = moment('00:00:00', 'HH:mm:ss A'); // 12:00 AM
            const endLimit = moment('24:00:00', 'HH:mm:ss A');   // 12:00 PM

            if (selectedMoment.isBefore(startLimit) || selectedMoment.isAfter(endLimit)) {
                setmodalmsg1("Time should be between 12:00 AM and 11:59 PM");
                return;
            }

            if (check === 1) {
                if (endTime && selectedMoment.isAfter(moment(endTime, 'HH:mm:ss'))) {
                    setmodalmsg1("Online time should be less than offline time");
                } else {
                    setStartTime(eventTime);
                    setStartTime1(formatToISO(moment(event).toLocaleString()));
                }
            } else if (check === 2) {
                if (startTime && selectedMoment.isBefore(moment(startTime, 'HH:mm:ss'))) {
                    setmodalmsg1("Offline time should be greater than online time and time should be between 12:00 AM and 11:59 PM");
                } else {
                    setEndTime(eventTime);
                    setEndTime1(formatToISO(moment(event).toLocaleString()));
                }
            }
        }
    };

    const handleDeleteSlotCheck = async (id) => {
        handleCancelForAll()
        if (id) {
            setdeleteId(id)
            setIsModalVisible(true)
        }
    };

    const handleDeleteSlot = async () => {
        if (deleteId) {

            try {
                await deleteSchedule(deleteId, dispatch, setLoading, userDetailDecrypted, seterrorModal, setmodalmsg);
                // Remove the deleted slot from the array
                setSlots(slots.filter(slot => slot.id !== deleteId));
                setIsModalVisible(false)
                setdeleteId(null)
            } catch (error) {
                setIsModalVisible(false)
                setdeleteId(null)

                console.error('Failed to delete slot', error);
            }
        } else {
            setIsModalVisible(false)
            setdeleteId(null)

            setSlots(slots.filter(slot => slot.id !== deleteId));
        }
    };

    const updateSlot = async (id, date, start, end) => {
        let message;
        await updateSchedule(userDetailDecrypted, id, date, start, end, dispatch, setLoading, seterrorModal, setmodalmsg).then((res) => {

            if (res.message === 'Schedule Updated') {

                setSlots(slots.map(slot =>
                    slot.id === id ? { ...slot, timeFrom: start, timeTo: end } : slot
                ));

                setLoading(false);
                message = res.message;
            }
        })

        return message;
    };

    return (
        <>
            <HeaderAuth label={'Manage Scheduling'} />

            <ScrollView contentContainerStyle={styles.container}>
                <View>
                    <Text style={[ResponsiveFonts.textualStyles.medium, styles.scheduleText]}>
                        Schedule your availability time to deliver orders
                    </Text>

                    <Text style={[ResponsiveFonts.textualStyles.xlargebold, styles.scheduleText1, { marginTop: 10, marginBottom: 10 }]}>
                        {day}
                    </Text>

                    {slots.length > 0 ? (
                        slots.map((slot, index) => (
                            <ScheduleListItem
                                key={index}
                                slot={slot}
                                ref={(el) => (scheduleRefs.current[index] = el)}
                                index={index}
                                slots={slots}
                                setSlots={setSlots}
                                setLoading={setLoading}
                                handleDeleteSlot={handleDeleteSlotCheck}
                                updateSlot={updateSlot}
                                day={day}
                            />
                        ))
                    ) : (
                        <View style={styles.noScheduleContainer}>
                            <Text style={[ResponsiveFonts.textualStyles.large, styles.noScheduleText]}>
                                No schedule created!
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.addSlotContainer}>
                <TouchableOpacity style={styles.addSlotButton} onPress={handleAddSlot}>
                    <Text style={[ResponsiveFonts.textualStyles.large, styles.addSlotButtonText]}>
                        Create Schedule
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <View style={styles.timeContainer}>
                                <Text style={[ResponsiveFonts.textualStyles.smallBold, styles.startTimeText]}>
                                    Online Time
                                </Text>
                                <TouchableOpacity onPress={() => { handleTimeSelection(1); }}>
                                    <Text style={[ResponsiveFonts.textualStyles.medium, styles.timeText]}>
                                        {startTime ? formatToLocalTime(startTime).formattedTime : 'Select time'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                            </View>
                            <View style={styles.timeContainer}>
                                <Text style={[ResponsiveFonts.textualStyles.smallBold, styles.startTimeText]}>
                                    Offline Time
                                </Text>
                                <TouchableOpacity onPress={() => { handleTimeSelection(2); }}>
                                    <Text style={[ResponsiveFonts.textualStyles.medium, styles.timeText]}>
                                        {endTime ? formatToLocalTime(endTime).formattedTime : 'Select time'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {modalMsg1 && (<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                            <Text style={[ResponsiveFonts.textualStyles.smallBold, styles.cancelButtonText]}>
                                {modalMsg1}
                            </Text>
                        </View>)}
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => { setShowModal(false); setStartTime(null); setEndTime(null); setmodalmsg1("") }}>
                                <Text style={[ResponsiveFonts.textualStyles.smallBold, styles.cancelButtonText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={startTime && endTime ? false : true} style={startTime && endTime ? styles.createButton : styles.createButtonDis} onPress={handleCreateSlot}>
                                <Text style={[ResponsiveFonts.textualStyles.smallBold, styles.createButtonText]}>Create</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    {Loading &&
                        <View style={{ position: 'absolute', backgroundColor: "rgba(0,0,0,0.5)", height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Loader />
                        </View>}
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
            </Modal>

            {Loading && (
                <View style={styles.modalBg}>
                    <Loader />
                </View>
            )}

            {isModalVisible && (<DeleteConfirmationModal
                visible={isModalVisible}
                onConfirm={handleDeleteSlot}
                onCancel={() => setIsModalVisible(false)}
            />)}

            {errorModal && (
                <View style={{ width: width, height: height, position: 'absolute', zIndex: 8888888 }}>
                    <AnimatedModal visible={errorModal} onClose={() => { seterrorModal(false) }} >
                        <ModalPattern1
                            setValue={seterrorModal}
                            heading={modalMsg}
                            btnTittle={"Okay"}
                            OnPress={() => {
                                setmodalmsg("");
                                seterrorModal(false);
                            }}
                        />
                    </AnimatedModal>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingBottom: verticalScale(70)
    },
    scheduleText: {
        color: colors.black,
        marginBottom: 20,
        marginTop: 10,
    },
    scheduleText1: {
        color: colors.theme,
    },
    noScheduleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '50%'
    },
    noScheduleText: {
        color: colors.theme,
    },
    addSlotContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 888,
        bottom: 0,
    },
    addSlotButton: {
        backgroundColor: colors.theme,
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        width: '100%',
    },
    addSlotButtonText: {
        color: colors.white,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,

    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: colors.lightGrey,
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.theme
    },
    createButton: {
        backgroundColor: colors.theme,
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    createButtonDis: {
        backgroundColor: colors.blackOpacity50,
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: colors.theme,
    },
    createButtonText: {
        color: colors.white,
    },
    modalBg: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
    },
    timeContainer: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center', // Aligns text in the center horizontally
    },
    divider: {
        flex: 1,
        justifyContent: 'center', // Ensures vertical alignment
        alignItems: 'center',
    },
    dividerLine: {
        backgroundColor: 'black',
        width: 1,  // Divider width
        height: 50, // Divider height
    },
    startTimeText: {
        color: colors.theme,
        paddingBottom: 5,
    },
    timeText: {
        color: colors.black,
        paddingBottom: 10,
    },
    overlay: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',

    },
    modalContainer1: {
        width: '100%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default ScheduleAvailability;
