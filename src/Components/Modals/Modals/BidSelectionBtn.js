import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'

import colors from '../../../styles/colors'
import { moderateScale, verticalScale } from '../../../styles/responsiveSize'
import TextLabel from '../../TextLabel/TextLable'
import { ResponsiveFonts } from '../../../constants/ResponsiveFonts'

const BidSelectionBtn = ({ value, setSelectedOrder, selected, setBidamount, setBidModalData }) => {

    const setTab = () => {
        setBidModalData(value)
        setSelectedOrder(value);
    }

    useEffect(() => {
        setTab()
    }, [])


    return (
        <TouchableOpacity onPress={() => { setTab() }}
            style={selected?.Neworderid == value?.Neworderid ? styles.container : styles.unSelectedContainer}>
            <TextLabel ResponsiveFonts={ResponsiveFonts.textualStyles.small} color={colors.white} label={`Order#${value?.Neworderid} `} />
            {(value?.orderType == 0 && value?.type != 'mart') && (<View style={selected?.Neworderid == value?.Neworderid ? styles.timer : styles.unSelectedtimer}>
                <Text style={[ResponsiveFonts.textualStyles.small, { color: selected?.Neworderid == value?.Neworderid ? 'black' : 'white' }]} adjustsFontSizeToFit>{value?.remainingTime || 0}</Text>
            </View>)}
        </TouchableOpacity>
    )
}

export default BidSelectionBtn

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.theme,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(5),
        paddingHorizontal: moderateScale(10),
        borderTopLeftRadius: moderateScale(7),
        borderTopRightRadius: moderateScale(7),
        marginRight: moderateScale(3),
        flexDirection: 'row',
    },
    unSelectedContainer: {
        backgroundColor: colors.blackOpacity40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(5),
        paddingHorizontal: moderateScale(10),
        borderTopLeftRadius: moderateScale(7),
        borderTopRightRadius: moderateScale(7),
        marginRight: moderateScale(3),
        flexDirection: 'row',
    },
    timer: {
        height: verticalScale(30),
        width: verticalScale(30),
        backgroundColor: 'white',
        color: 'black',
        // padding: moderateScale(5),
        borderRadius: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    unSelectedtimer: {
        height: verticalScale(30),
        width: verticalScale(30),
        backgroundColor: colors.theme,
        color: 'white',
        // padding: moderateScale(5),
        borderRadius: verticalScale(30),
        justifyContent: 'center',
        alignItems: 'center'
    },

})