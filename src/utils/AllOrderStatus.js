
const AllOrderStatus = Object.freeze({
    WaitingForBidAcceptance: 0,
    StartRideFirst: 1,
    Reached: 2,
    StartRide: 3,
    OrderDispatch: 4,
    CompleteOrder: 6,
    FinishRide: 5,


    ChefWaitingForOrderAccept: 7,
    ChefAccept: 9,
    ChefAutoAccept: 10,
    OrderDispatchChef: 11,
    RiderReachedRest: 12,
    RiderStartRideToCustomer: 13,
    RiderFinishRider: 14,
    chefCompleteORder: 15,
    chefInitial: 22,
    CancelledByAdmin: 24,
    CancelledByAdmin1: 25,
});
export default AllOrderStatus;