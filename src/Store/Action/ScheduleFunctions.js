import axios from "axios";
import { scheduleData } from "../Reducers/AppReducer/AppReducer";
import { SCEDULE_API_BASE_URL } from '@env'

const API_BASE_URL = SCEDULE_API_BASE_URL;

const getAllSchedule = async (dispatch, setLoading, UserDetail) => {
    try {
        setLoading(true)

        axios.get(`${API_BASE_URL}?riderId=${UserDetail?.Id}`)
            .then(async (res) => {

                dispatch(scheduleData(res.data));
                setLoading(false)

            })
            .catch((e) => {
                setLoading(false)
            });


    } catch (error) {
        console.error('Failed to load slots', error);
        setLoading(false)
    }
}

const createSchedule = async (UserDetail, dayy, startTime, endTime, dispatch, setLoading, seterrorModal, setmodalmsg) => {

    const newSlot = {
        riderId: UserDetail?.Id,
        day: dayy,
        timeFrom: startTime,
        timeTo: endTime
    };

    try {
        setLoading(true);

        const response = await axios.post(API_BASE_URL, newSlot, {
            headers: {
                'Content-Type': 'application/json',
            },
        });


        if (response.data.message === 'Schedule Overlapped') {
            setLoading(false);
            return response.data.message;

        } else if (response.data.message === 'Schedule Added') {
            await getAllSchedule(dispatch, setLoading, UserDetail);
            setLoading(false);
        }
        else {
            setLoading(false);
            seterrorModal(true)
            setmodalmsg(response.data.message)
        }

    } catch (error) {
        setLoading(false);
        seterrorModal(true)
        setmodalmsg('Failed to save slot', error)
        console.error('Failed to save slot', error);
    }
}

const deleteSchedule = async (id, dispatch, setLoading, UserDetail, seterrorModal, setmodalmsg) => {
    try {
        setLoading(true);

        const response = await axios.delete(`${API_BASE_URL}?scheduleId=${id}`);

        if (response.data) {
            await getAllSchedule(dispatch, setLoading, UserDetail);
            setLoading(false);
        }
    } catch (error) {
        setLoading(false);
        seterrorModal(true)
        setmodalmsg('Failed to delete slot', error)
        console.error('Failed to delete slot', error);
    }
}

const updateSchedule = async (UserDetail, id, date, start, end, dispatch, setLoading, seterrorModal, setmodalmsg) => {

    const updatedSlot = {
        riderId: UserDetail?.Id,
        day: date,
        timeFrom: start,
        timeTo: end,
        isActive: 1,
        isDeleted: 0
    };

    try {
        setLoading(true);

        const response = await axios.put(`${API_BASE_URL}?scheduleId=${id}`, updatedSlot, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.message === 'Schedule Updated') {
            await getAllSchedule(dispatch, setLoading, UserDetail);
            setLoading(false);

        } else if (response.data.message === 'Schedule Overlapped') {
            seterrorModal(true)
            setmodalmsg('Schedule time must not be the same from other schedule')
            setLoading(false);

        }
        else if (response.data.message === 'Invalid Body') {
            seterrorModal(true)
            setmodalmsg('Incorrect Schedule time')
            setLoading(false);

        } else {
            seterrorModal(true)
            setmodalmsg(response.data.message)
            setLoading(false);
        }
        return response.data

    } catch (error) {
        setLoading(false);
        seterrorModal(true)
        setmodalmsg('Failed to save slot', error)
        console.error('Failed to update slot', error);
    }

}


export {
    getAllSchedule,
    createSchedule,
    deleteSchedule,
    updateSchedule
}