import { GET_METHOD_AUTH, POST_METHOD_AUTH, POST_METHOD_AUTH3 } from "../../utils/ApiCallingMachnisem";

const GET_TOTAL_AMOUNT = (TokenId, UserDetail, SetTotalAmount, setLoading) => {
    try {
        setLoading(true)
        GET_METHOD_AUTH(`api/v2/Topup?riderId=${UserDetail?.Id}`, TokenId)
            .then((responseJson) => {
                if (responseJson.status == 'success') {
                    SetTotalAmount(responseJson?.sum)
                    setLoading(false);

                }
            })
            .catch((error) => {
                setLoading(false);
                console.log("GET_TOTAL_AMOUNT", error);
            }).finally(() => {
                setLoading(false)
            })
    } catch (error) {
        console.log("GET_TOTAL_AMOUNT", error);
    }
};


const GET_EARNING_HISTORY = (TokenId, UserDetail, setEarningHistory, setLoading, from, to) => {
    try {
        setLoading(true)
        GET_METHOD_AUTH(`api/V2/TopUp/GetPayoutHistoryRider?rdrId=${UserDetail?.Id}&startTime=${from}&endTime=${to}`, TokenId)
            .then((responseJson) => {
                setEarningHistory(responseJson)
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log("GET_TOTAL_AMOUNT", error);
            }).finally(() => {
                setLoading(false)
            })
    } catch (error) {
        console.log("GET_TOTAL_AMOUNT", error);
    }
}

const GET_TOTAL_PAYABLE = (TokenId, UserDetail, setData, setLoading, from, to) => {
    try {
        setLoading(true);
        const url = `api/v3/TopUp/TotalPayableRider?riderId=${UserDetail?.Id}&startTime=${from}&endTime=${to}`
        GET_METHOD_AUTH(url, TokenId)
            .then((responseJson) => {
                if (responseJson?.outstandingPayment != undefined) {
                    setData(responseJson)
                } else {
                    setData({ "outstandingPayment": 0, "recievedAmount": 0, "tipCollection": 0, "totalEarnings": 0, "todaysEarnings": 0, "TotalTips": 0 })
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log("GET_TOTAL_AMOUNT", error);
            }).finally(() => {
                setLoading(false)
            })
    } catch (error) {
        setLoading(false)
        console.log("GET_TOTAL_PAYABLE", error);
    }
};


const GET_SINGLE_PAYOUT_HISTORY = (transctionId, setData, onViewPayoutDetail) => {
    try {
        const body = [transctionId]

        POST_METHOD_AUTH3(`api/TopUp/GetSinglePayoutHistoryRider`, body)
            .then((resp) => {
                setData(resp)
                onViewPayoutDetail(resp)
            }).catch((error) => {
                console.log('GET_PAYOUT_DETAIL===>', error);
            })
    } catch (error) {
        console.log('GET_PAYOUT_DETAIL error', error);
    }
}

export {
    GET_TOTAL_AMOUNT,
    GET_EARNING_HISTORY,
    GET_TOTAL_PAYABLE,
    GET_SINGLE_PAYOUT_HISTORY
}