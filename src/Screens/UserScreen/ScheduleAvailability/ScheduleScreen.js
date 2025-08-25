import React, { useEffect, useState } from 'react'
import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native' // Import navigation
import { useDispatch, useSelector } from 'react-redux'

import HeaderAuth from '../../../Components/HeaderAuth/HeaderAuth'
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts'
import colors from '../../../styles/colors'
import Loader from '../../../Components/Modals/Modals/Loader'
import { getAllSchedule } from '../../../Store/Action/ScheduleFunctions'
import imagePath from '../../../constants/imagePath'
import { returnUserDetailData } from '../../../utils/helperFunctions'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


const ScheduleScreen = () => {

    const [Loading, setLoading] = useState(false);
    const [Loading1, setLoading1] = useState(false);
    const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);
    const { scheduleData } = useSelector((state) => state?.AppReducer);

    const userDetailDecrypted = returnUserDetailData(UserDetail);

    const dispatch = useDispatch();
    const navigation = useNavigation();


    const loadSlots = async () => {
        getAllSchedule(dispatch, setLoading, userDetailDecrypted, TokenId);
    };

    useEffect(() => {
        loadSlots();
    }, []);

    const getSlotCountForDay = (day) => {
        return scheduleData?.filter(schedule => schedule.day === day).length || 0;
    };

    const handleDayClick = (day) => {
        const daySlots = scheduleData?.filter(schedule => schedule.day === day);
        navigation.navigate('ScheduleAvailabilityInner', { day, daySlots: daySlots }); // Pass day and slots as params
    };

    return (
        <>
            <HeaderAuth label={'Scheduling'} />
            <ScrollView contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={Loading1}
                        onRefresh={async () => {
                            await getAllSchedule(dispatch, setLoading1, userDetailDecrypted, TokenId);
                        }}
                    />
                }
            >
                <Text style={[ResponsiveFonts.textualStyles.medium, styles.scheduleText]}>
                    Create your own schedule
                </Text>

                {daysOfWeek.map((val, ind) => {
                    const slotCount = getSlotCountForDay(val); // Get slot count for the day
                    return (
                        <TouchableOpacity key={ind} onPress={() => handleDayClick(val)}>
                            <View style={styles.dayContainer}>
                                <View style={{ flex: 3 }}>
                                    <Text style={[ResponsiveFonts.textualStyles.large, styles.scheduleText1]}>
                                        {val}
                                    </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text style={[ResponsiveFonts.textualStyles.medium, styles.scheduleText3]}>
                                        {slotCount > 0 ? slotCount : 'No'} Schedule{slotCount > 1 ? 's' : ''}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <Image
                                        source={imagePath.rightArrow}
                                        style={styles.icon}
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            {Loading && (
                <View style={styles.modalBg}>
                    <Loader />
                </View>
            )}
        </>
    );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingBottom: 60
    },
    scheduleText: {
        color: colors.black,
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'center'
    },
    scheduleText3: {
        color: colors.blackOpacity60,
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'center'
    },
    scheduleText1: {
        color: colors.theme,
        marginBottom: 5,
        marginTop: 5,
    },
    dayContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 10,
        borderBottomColor: colors.blackOpacity40,
        borderBottomWidth: 1
    },
    icon: {
        width: 15,
        height: 15,
        tintColor: colors.black,
    },
    modalBg: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
});
