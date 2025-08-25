import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    CompleteOrders: [],
    BidHistoryData: [],
    FirstLogin: true,
    showNotificationModal: false,
    scheduleData: [],
    newUpdate: false,
    UserIds: [],
};

export const AppReducer = createSlice({
    name: 'JumbilinAuth',
    initialState,
    reducers: {
        CompleteOrders: (state, action) => {
            state.CompleteOrders = action.payload;
        },
        BidHistoryData: (state, action) => {
            state.BidHistoryData = action.payload;
        },
        FirstLogin: (state, action) => {
            state.FirstLogin = action.payload;
        },
        showNotificationModal: (state, action) => {
            state.showNotificationModal = action.payload;
        },
        scheduleData: (state, action) => {
            state.scheduleData = action.payload;
        },
        shownNewModal: (state, action) => {
            const userId = action.payload;
            if (!(state.UserIds)?.includes(userId)) {
                state.newUpdate = true;
                state.UserIds = [...(state?.UserIds || []), userId];
            }
        },
        setNewUpdate: (state, action) => {
            state.newUpdate = false
        },
    },
});

export let { CompleteOrders, BidHistoryData, FirstLogin, showNotificationModal, scheduleData, shownNewModal, setNewUpdate } = AppReducer.actions;
export default AppReducer.reducer;