import React, { useEffect, useState } from 'react';
import { View, StyleSheet, } from 'react-native';
import colors from '../../styles/colors';

import { verticalScale, moderateScale } from '../../styles/responsiveSize';
import BidListItem from './BidListItem';

const NewBidesModalize = ({ setPlaceBidModal, CloseOnTimeFinish, Bids,  UserDetailType }) => {

    const [ItemCount, setItemCount] = useState([]);

    useEffect(() => {
        if (ItemCount?.length === Bids?.length) {
            CloseOnTimeFinish()
        }
    }, [ItemCount, Bids])

    return (
        <View style={styles.container}>
            {Bids?.map((value, index) => {
                return (
                    <BidListItem value={value} key={index} setPlaceBidModal={setPlaceBidModal} setItemCount={setItemCount} ItemCount={ItemCount} time={value?.TimeOut} UserDetailType={UserDetailType} />
                )
            })}
        </View>
    );
};



export default NewBidesModalize;


const styles = StyleSheet.create({
    modalStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "#fff",
        // flex: 1
    },
    info: {
        alignItems: "flex-start"
    },
    time: {
        justifyContent: "center"
    },
    text: {
        color: colors.blackOpacity60
    },
    title: {
        color: colors.theme,
        margin: moderateScale(5),
        textAlign: "center"
    },
    Itemcontainer: {
        width: '100%',
        marginTop: verticalScale(30),
        height: verticalScale(90),
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        borderWidth: 2,
        borderColor: colors.theme

    },
    container: {
        width: '95%',
        alignSelf: "center",
        paddingBottom: verticalScale(20),
        paddingTop: verticalScale(1)
    },
    icon: {
        height: verticalScale(100),
        width: moderateScale(100),
        alignSelf: "center",
        marginTop: verticalScale(30),
        marginBottom: verticalScale(20)
    },
    okayicon: {
        height: verticalScale(60),
        width: moderateScale(60)
    },
    HEADER: {
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    row2: {
        alignSelf: 'center',
        marginTop: verticalScale(20)
    },
    resrturentImg: {
        height: '100%',
        width: '100%',
    },
    imgContainer: {
        height: verticalScale(55),
        width: moderateScale(50),
        borderRadius: moderateScale(50),
        overflow: "hidden"
    },
    imagheader: {
        position: "absolute",
        bottom: 0,
        top: 12,
        marginLeft: 1
        // top: 20
    }
});



