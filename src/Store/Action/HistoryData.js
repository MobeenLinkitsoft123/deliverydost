import { CompleteOrders, BidHistoryData } from "../Reducers/AppReducer/AppReducer";
import { GET_METHOD, GET_METHOD_AUTH } from "../../utils/ApiCallingMachnisem";

const GetCompleteOrders = async (dispatch, Setloading, UserDetail, TokenId) => {
    try {
        Setloading(true)
        GET_METHOD_AUTH(`api/V2DMSOrder?riderid=${UserDetail?.Id}`, TokenId)
            .then(async result => {
                // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>result",result)
                let res = result?.reverse()
                dispatch(CompleteOrders(res))
                Setloading(false)
            })
            .catch((err) => {
                // alert(err)
                console.error(err);
                Setloading(false)
                dispatch(CompleteOrders([]))
            });

    } catch (error) {
        // alert(error)
        Setloading(false)
    }
}

const GetBidHistory = async (dispatch, Setloading, UserDetail, TokenId) => {
    try {
        Setloading(true)
        GET_METHOD_AUTH(`api/DMSBid?rdr=${UserDetail?.Id}`, TokenId)
            .then(async result => {
                if (result != 'No record found') {
                    dispatch(BidHistoryData(result?.reverse()))
                    // console.log('BidHistoryData', result?.reverse())
                } else dispatch(BidHistoryData([]))

                Setloading(false);
            })
            .catch((err) => {
                // alert(err)
                console.error(err);
                Setloading(false)
                dispatch(BidHistoryData([]))
            });
    } catch (error) {
        console.log("error", error)
        // alert(error)
        Setloading(false)
    }
}

export {
    GetCompleteOrders,
    GetBidHistory
}