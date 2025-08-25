import React, { useEffect, useRef, useState } from 'react';

import NetInfo from "@react-native-community/netinfo";
import { useDispatch, useSelector } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';

import { CheckAnyPendingOrdersMain, checkOrderForMarts, GetBidAmount, GetNewBidsMain } from '../../../Store/Action/BidsActionsMain';
import { removeAllBids, removeSpecificBid } from '../../../Store/Reducers/AppReducer/BidReducer';
import CustomModalFixed from '../../../Components/Modals/CustomModalFixed';
import PlaceBidModal from '../../../Components/Modals/Modals/PlaceBidModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedModal from '../../../Components/AnimtedModal/AnimatedModal';
import ModalPattern1 from '../../../Components/Modals/Modals/ModalPattern1';
import Sound from 'react-native-sound';
import UpdateSSNModal from '../../../Components/Modals/Modals/UpdateSSNModal';
import { returnUserDetailData } from '../../../utils/helperFunctions';


const BidLogic = () => {

    const dispatch = useDispatch();
    const soundRef = useRef(null);

    const { TokenId, UserDetail, LoginUser } = useSelector((state) => state?.AuthReducer);
    const { Bids, RideStatus } = useSelector((state) => state?.BidReducer);

    const [PlaceBidModalShow, setPlaceBidModal] = useState(false);
    const [BidModalData, setBidModalData] = useState({});
    const [BiddingAmount, SetBiddingAmount] = useState();
    const [ErrorModel, setErrorModel] = useState(false);
    const [ModalMessage, setModalMessage] = useState("");
    const [biddingMissData, setBiddingMissData] = useState({});
    const [biddingMiss, SetBiddingMiss] = useState(false);
    const [newBidUpdate, setNewBidUpdate] = useState(true);
    const [checkOrderProgress, setcheckOrderProgress] = useState(true);
    const [innerModal, setinnerModal] = useState(false);
    const [updateSSNModal, setUpdateSSNModal] = useState(false);
    const userDetailDecrypted = returnUserDetailData(UserDetail);

    const soundReff = () => {
        soundRef.current = new Sound(require('../../../utils/delivery.mp3'), error => {
            if (error) {
                console.error('Error initializing sound:', error);
                soundRef.current = null;
            }
        });

    }


    const playSoundThreeTimes = () => {
        if (!soundRef.current) return;

        let count = 0;

        const play = () => {
            soundRef.current.play((success) => {
                if (success && count < 2) { // 0, 1, 2 = 3 times
                    count++;
                    setTimeout(play, 500); // Add small delay between plays if needed
                }
            });
        };

        play();
    };

    const checkSoundPLay = async () => {
        if (Bids.length > 0 && PlaceBidModalShow) {
            if (soundRef.current) {
                playSoundThreeTimes();
            }
        } else {
            soundRef.current?.stop();
        }
    };

    const checkOrders = () => {
        CheckAnyPendingOrdersMain(userDetailDecrypted, TokenId, dispatch)
        checkOrderForMarts(UserDetail, undefined, () => { }, TokenId, () => { }, () => { }, dispatch, true, false)
    };

    const onBackButtonPress = () => {
        dispatch(removeAllBids());
        setPlaceBidModal(false);
        checkOrders()
    }

    const getBids = () => {
        if (LoginUser) { GetNewBidsMain(userDetailDecrypted, TokenId, true, BiddingAmount, setErrorModel, dispatch); }
    }

    useEffect(() => {
        checkSoundPLay()
    }, [Bids, PlaceBidModalShow]);

    useEffect(() => {
        soundReff()
        GetBidAmount(SetBiddingAmount)
        BiddingAmount && getBids()
        checkOrders()

        return () => {
            if (soundRef.current) {
                soundRef.current.release();
                soundRef.current = null;
            }
        };
    }, []);


    useEffect(() => {
        if (LoginUser == true) {
            if (userDetailDecrypted?.socialSecurityNumber == "" || userDetailDecrypted?.socialSecurityNumber == undefined) {
                setUpdateSSNModal(true)
            } else {
                setUpdateSSNModal(false)
            }
        } else {
            setUpdateSSNModal(false)
        }
    }, [userDetailDecrypted, LoginUser]);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected) {
                setTimeout(() => {
                    getBids()
                }, 1000);
            }
        });

        return () => unsubscribe();
    }, []);


    useEffect(() => {
        setNewBidUpdate(true);
        setTimeout(() => {
            getBids()
        }, 700);
        checkOrders();
    }, [newBidUpdate])

    useEffect(() => {
        setcheckOrderProgress(true)
        checkOrders();
    }, [checkOrderProgress])


    const onBidTimeOut = () => {
        if (RideStatus?.Status?.trim()?.length == 0) {
            if ((biddingMissData?.data?.orderId || 1) == (BidModalData?.Neworderid || 0)) {
                Bids.length == 1 && setPlaceBidModal(false);
                setBiddingMissData({});
                // if (biddingMissData?.type != 'mart') {
                //     setModalMessage("Sorry! Another driver won this order, more chances are coming soon.");
                //     setErrorModel(true);
                // }
                setcheckOrderProgress(false)
            }
        }
    }

    useEffect(() => {
        if (biddingMiss) {
            onBidTimeOut();
            SetBiddingMiss(false)
        }
    }, [biddingMiss]);

    useEffect(() => {
        const onBidRejectedByUser = EventRegister.addEventListener("OnBidRejectedByUser", (data) => {
            // Bids?.length == 1 && setPlaceBidModal(false);
            setBiddingMissData({});
            let parseData = data && JSON.parse(data)

            if (parseData?.type == 'userOrderCancel') {
                dispatch(removeSpecificBid(parseData?.orderId))
                setModalMessage("Sorry! Order Canceled by User.");
                setErrorModel(true);
                setcheckOrderProgress(false)
            }

            if (parseData?.Result?.bidStatus == 6) {
                setPlaceBidModal(false);
                setModalMessage("You have exceed your job limit");
                setErrorModel(true);
                setcheckOrderProgress(false)

            } else {
                dispatch(removeSpecificBid(parseData?.ID || parseData?.Result?.orderId || parseData?.Result?.OrderId))
                setModalMessage("Sorry! Order Canceled by User.");
                setErrorModel(true);
                setcheckOrderProgress(false)

            }
        });

        const GetUpdatedStatus = EventRegister.addEventListener("ONBIDREJECTED", (data) => {
            setcheckOrderProgress(false)

        });

        const GetUpdatedOrderCancelByAdmin = EventRegister.addEventListener("OrderCancel", (data) => {
            setcheckOrderProgress(false)

        });


        const BidTimeOut = EventRegister.addEventListener("BidTimeOut", async (data) => {
            const ActiveBidPlaced = await AsyncStorage.getItem('ActiveBidPlaced');
            if (ActiveBidPlaced == 0) {
                AsyncStorage.setItem('ActiveBidPlaced', "1")
            } else {
                getBids();
                setBiddingMissData(data)
                setTimeout(() => {
                    SetBiddingMiss(true)
                }, 600);
            }
            setcheckOrderProgress(false)

        });

        const NewBidsOrderAccepted = EventRegister.addEventListener("NewBidsOrderAccepted", (data) => {
            setNewBidUpdate(false)
        });

        const showBidModal = EventRegister.addEventListener("showBidModal", (data) => {
            setPlaceBidModal(true);
        });

        return () => {
            EventRegister?.removeEventListener(NewBidsOrderAccepted);
            EventRegister?.removeEventListener(onBidRejectedByUser);
            EventRegister?.removeEventListener(BidTimeOut);
            EventRegister?.removeEventListener(GetUpdatedStatus);
            EventRegister?.removeEventListener(showBidModal);
            EventRegister?.removeEventListener(GetUpdatedOrderCancelByAdmin);

        };
    }, []);


    return (
        <>
            {PlaceBidModalShow && (
                <CustomModalFixed visible={PlaceBidModalShow} onClose={() => setPlaceBidModal(false)} HideOnBackDropPress={false}>
                    <PlaceBidModal
                        setBidModalData={setBidModalData}
                        UserDetail={userDetailDecrypted}
                        BidModalData={BidModalData}
                        CloseBidModal={() => {
                            setPlaceBidModal(false)
                        }}
                        onIgnoreBid={() => {
                            setPlaceBidModal(false);
                            if (Bids.length == 1) {
                                dispatch(removeAllBids())
                            }
                        }}
                        TokenId={TokenId}
                        RidreProgressCheck={() => checkOrders()}
                        BiddingAmount={BiddingAmount}
                        stopSound={() => setPlaceBidModal(false)}
                        Bids={Bids}
                        bids={() => {
                            dispatch(removeAllBids())
                        }}
                        onBidTimeOut={() => SetBiddingMiss(true)}
                        UserDetailType={userDetailDecrypted?.Type}
                        getBids={getBids}
                        onBackButtonPress={onBackButtonPress}
                        setPlaceBidModal={setPlaceBidModal}
                        innerModal={innerModal}
                        setinnerModal={setinnerModal}
                        ErrorModel={ErrorModel}
                        setErrorModel={setErrorModel}
                        ModalMessage={ModalMessage}
                        setModalMessage={setModalMessage}

                    />
                </CustomModalFixed>
            )}

            {ErrorModel && (
                <AnimatedModal visible={ErrorModel} onClose={() => { setErrorModel(false) }}>
                    <ModalPattern1 setValue={setErrorModel} heading={ModalMessage} btnTittle={"Okay"}
                        OnPress={() => {
                            getBids()
                            setModalMessage("");
                            setErrorModel(false);
                        }}
                    />
                </AnimatedModal>
            )}

            {updateSSNModal && <UpdateSSNModal updateSSNModal={updateSSNModal} setUpdateSSNModal={() => setUpdateSSNModal(false)} />}

        </>
    )
}

export default BidLogic