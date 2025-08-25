import React, { useState, useEffect } from 'react'
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { moderateScale, textScale, width } from '../../../styles/responsiveSize'
import colors from '../../../styles/colors'
import fontFamily from '../../../styles/fontFamily'
import imagePath from '../../../constants/imagePath'

const NewRideModal = ({ visible, SetEarnMoreRidersBids, data }) => {


    const [Bidamount, setBidamount] = useState(0);
    const [seconds, setIntervalSeconds] = useState(60);
    const [intervalID, setIntervalID] = useState(0);

    const startTimer = () => {
        const _intervalID = setInterval(() => {
            setIntervalSeconds((previousValue) => {
                return previousValue - 1;
            });
        }, 1000);
        setIntervalID(_intervalID);
    };

    useEffect(() => {
        return () => {
            if (intervalID) {
                clearInterval(intervalID);
            }
        };

    }, []);

    useEffect(() => {
        if (seconds < 1 && intervalID) {
            SetEarnMoreRidersBids(false);
        } else if (seconds > 1 && intervalID == 0) {
            startTimer();
        }
    }, [seconds]);

    if (seconds <= 1) {
        SetEarnMoreRidersBids(false);
    }

    const FakeData = [
        {
            "CoordinatesOfUser": "{\"latitude\":24.9216468,\"longitude\":67.0925902}", "CoordinatesOfVendor": "{\"lat\":24.8831438,\"long\":67.0703903}",
            "Date": "2023-06-15T09:25:23.763", "Distance": "7.9 km", "Duration": "18 mins", "Id": 185,
            "LocOfUser": "W3CV+J3F, Block 5 Gulshan-e-Iqbal, Karachi, Karachi City, Sindh 75300, Pakistan",
            "LocOfVendor": "https://foodostiimagedb.blob.core.windows.net/martprofileimg/Imtiaz-5/31/202310:52:22AMgrocery.jpg",
            "OrderId": 1062, "PPK": "4",
            "ProfilePic": "https://foodostiimagedb.blob.core.windows.net/martprofileimg/Imtiaz-5/31/202310:52:22AMgrocery.jpg",
            "RemainingTime": 56, "Title": "Imtiaz", "Type": "mart", "UserId": 5, "VendorId": 1, "earnMore": 1,
            "identifier": "00000000-0000-0000-0000-000000000000", "max": 10, "min": 1, "schtype": 0, "status": 0
        }
    ]

    const MartData = data[0]


    return (
        <Modal visible={visible} transparent>
            <View
                activeOpacity={1}
                // onPress={SetEarnMoreRidersBids}
                style={styles.container}>
                <View style={styles.centerCon}>
                    <View style={styles.Header}>
                        <Text style={styles.headerText}>New Rides</Text>
                    </View>
                    <View style={[styles.storeImg, styles.circle]}>
                        <Image
                            style={[styles.img, styles.circle]}
                            source={{ uri: MartData?.ProfilePic }}
                            resizeMode='contain'
                        />
                    </View>
                    <View style={styles.storeNameCon}>
                        <Text style={styles.storeNameText}>{MartData?.Title}</Text>
                    </View>
                    {/* <View style={styles.pontingCon}>
                        <
                    </View> */}
                    <View style={styles.separator}>
                        <Image
                            source={imagePath.MartBidImage}
                            resizeMode='stretch'
                            style={styles.img}
                        />
                    </View>
                    <View style={styles.timerCon}>
                        <Text style={styles.timerText}>Bid Cancel in</Text>
                        <Text style={styles.timerText2}>{seconds}</Text>
                        <Text style={styles.timerText}>Seconds</Text>
                    </View>
                    <View style={styles.bottomCon}>
                        {data?.map((value, index) => {

                            let distanceFrom = value?.TotalDistanceFrom?.replace(/miles/g, "");
                            let distanceTo = value?.TotalDistanceTo?.replace(/miles/g, "");

                            const TotalDistance = Number(distanceFrom) + Number(distanceTo);

                            let TimeFrom = value?.TotalDurationfrom?.replace(/min/g, "");
                            let TimeFrom2 = TimeFrom?.replace(/s/g, "");
                            let TimeTo = value?.TotalDurationto?.replace(/min/g, "");
                            let TimeTo2 = TimeTo?.replace(/s/g, "");

                            return (
                                <View style={styles.bottomCard}>
                                    <View style={styles.bottomCardLeft}>
                                        <Image
                                            source={imagePath.CartIcons}
                                            resizeMode='contain'
                                            style={styles.img}
                                        />
                                    </View>
                                    <View style={styles.bottomRightCon}>
                                        <Text style={styles.bottomRightConText}>{value.OrderVendorName}</Text>
                                        <Text style={styles.bottomRightConText1}> {" "}
                                            Distance : {Number(distanceTo)?.toFixed(1)} +{" "}
                                            {Number(distanceFrom)?.toFixed(1)} = {TotalDistance?.toFixed(1)}{" "}
                                            miles</Text>
                                        <Text style={styles.bottomRightConText1}>
                                            {" "}
                                            Time {"      :"} {TimeTo2 == "NAN" ? "0" : TimeTo2} + {TimeFrom2} ={" "}
                                            {Number(TimeFrom2) + Number(TimeTo2)} mins
                                        </Text>
                                    </View>
                                    <TouchableOpacity>
                                        <Text style={styles.bottomRightConText}>PLACE BIDS</Text>
                                    </TouchableOpacity>

                                </View>
                            )
                        })}

                    </View>



                </View>
            </View>

        </Modal>
    )
}

export default NewRideModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    centerCon: {
        width: width * 0.9,
        paddingBottom: moderateScale(10),
        backgroundColor: colors.white,
        borderRadius: moderateScale(15)
    },
    Header: {
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(55),
        backgroundColor: colors.theme,
        zIndex: -99,
        borderTopLeftRadius: moderateScale(15),
        borderTopRightRadius: moderateScale(15),
    },
    headerText: {
        fontFamily: fontFamily.bold,
        color: colors.black,
        fontSize: textScale(22)
    },
    storeImg: {
        width: moderateScale(60),
        height: moderateScale(60),
        alignSelf: 'center',
        marginTop: -moderateScale(30)
    },
    circle: {
        borderRadius: width / 2
    },
    img: {
        height: '100%',
        width: '100%'
    },
    storeNameCon: {
        width: '100%',
        alignItems: "center",
        marginVertical: moderateScale(10)
    },
    storeNameText: {
        fontFamily: fontFamily.bold,
        color: colors.gray,
        fontSize: textScale(20)
    },
    pontingCon: {
        width: '100%',
        alignItems: 'center'
    },
    separator: {
        width: '100%',
        height: moderateScale(26)
    },
    timerCon: {
        width: '100%',
        alignItems: 'center',
        marginVertical: moderateScale(15)
    },
    timerText: {
        fontFamily: fontFamily.regular,
        color: colors.gray,
        fontSize: textScale(20)
    },
    timerText2: {
        fontFamily: fontFamily.bold,
        color: colors.gray,
        fontSize: textScale(20)
    },
    timerText3: {
        fontFamily: fontFamily.regular,
        color: colors.gray,
        fontSize: textScale(20)
    },
    bottomCon: {
        width: '80%',
        alignSelf: 'center'
    },
    bottomCard: {
        width: '100%',
        borderColor: colors.theme,
        borderWidth: 1,
        borderRadius: moderateScale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(15),
        alignItems: 'center',
        paddingVertical: moderateScale(10),
        marginBottom: moderateScale(10)
    },
    bottomCardLeft: {
        height: moderateScale(40),
        width: moderateScale(40)
    },
    bottomRightCon: {
        width: '70%'
    },
    bottomRightConText: {
        fontFamily: fontFamily.bold,
        fontSize: textScale(18),
        color: colors.gray
    },
    bottomRightConText1: {
        fontFamily: fontFamily.regular,
        fontSize: textScale(15),
        color: colors.gray
    },
})