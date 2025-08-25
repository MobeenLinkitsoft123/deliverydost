import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    Bids: [],
    IsRefreshing: false,
    IsLoading: false,
    RideStatus: {
        RasturantOngoingOrder: false,
        MartOngoingJobs: false,
        Status: "",
        OrderId: "",
        BidsCount: 0,
        OrdersCount: 0
    },
    RideStatusMart: {
        MartOngoingJobs: false,
        Status: "",
        OrderId: "",
        OrdersCount: 0
    }
};

export const BidReducer = createSlice({
    name: 'BidReducer',
    initialState,
    reducers: {
        addBids: (state, action) => {
            state.Bids = action?.payload
        },
        removeSpecificBid: (state, action) => {

            const newFilterData = state?.Bids?.filter((data) => data?.Neworderid != action?.payload);
            state.Bids = newFilterData;
        },
        removeAllBids: (state, action) => {
            state.Bids = []
        },
        setRideStatus: (state, action) => {
            state.RideStatus = action.payload
        },
        setRideStatusMart: (state, action) => {
            state.RideStatusMart = action.payload
        },
        IsRefreshing: (state, action) => {
            state.IsRefreshing = action?.payload
        },
        IsLoading: (state, action) => {
            state.IsLoading = action?.payload
        },
    },
});

export let { addBids, removeSpecificBid, removeAllBids, setRideStatus, IsRefreshing, IsLoading, setRideStatusMart } = BidReducer.actions;
export default BidReducer.reducer;