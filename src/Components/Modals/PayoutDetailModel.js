
import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { height, moderateScale, verticalScale } from '../../styles/responsiveSize';
import { Modalize } from 'react-native-modalize';
import { ResponsiveFonts } from '../../constants/ResponsiveFonts';
import imagePath from '../../constants/imagePath';
import TextLabel from '../TextLabel/TextLable';
import colors from '../../styles/colors';
import { dateFormatter } from '../../Store/Action/AppFunctions';

const PayoutDetailModel = ({ payOutDetail, onClose, payOutSheetRef }) => {

 

    // Memoized renderItem for better performance
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.itemView1}>
                <Image source={imagePath.MartIcon8} style={styles.itemView} resizeMode="contain" />
            </View>
            <View style={styles.itemView2}>
                <Text style={[styles.orderId, ResponsiveFonts.textualStyles.medium]}>Order ID: {item.orderid}</Text>
                <Text style={[styles.date, ResponsiveFonts.textualStyles.smallBold]}>{dateFormatter(item.dateTime)}</Text>
            </View>
            <View style={styles.itemView3}>
                <Text style={[styles.amount, ResponsiveFonts.textualStyles.largeBold]}>$ {item.Amount.toFixed(2)}</Text>
                {/* <Text style={[styles.status, ResponsiveFonts.textualStyles.smallBold]}>
                    {item.status === 0 ? 'Requested' : 'Completed'}
                </Text> */}
            </View>
        </View>
    );

    return (
        <Modalize
            ref={payOutSheetRef}
            closeOnOverlayTap={true}
            modalStyle={styles.modalStyle}
            modalHeight={verticalScale(height / 1.4)}
            HeaderComponent={() => {
                return (
                    <View style={styles.modalHeader}>
                        <Text style={[styles.header, ResponsiveFonts.textualStyles.large]}>Payout Details
                            <Text style={[{ color: 'gray' }, ResponsiveFonts.textualStyles.medium]}> - {payOutDetail?.length || 0} Result(s)</Text></Text>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeText}>❌</Text>
                        </TouchableOpacity>
                    </View>
                )
            }}>

            {/* FlatList for optimized performance */}
            <FlatList
                data={payOutDetail}
                keyExtractor={(item) => item.orderid}
                renderItem={useMemo(() => renderItem, [])} // Memoized rendering for optimization
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </Modalize>

    );
};

export default PayoutDetailModel;

const styles = StyleSheet.create({
    modalStyle: {
        borderTopLeftRadius: verticalScale(20),
        borderTopRightRadius: verticalScale(20),
        overflow: 'hidden',
        height: verticalScale(400),
        padding: 10
    },
    header: {
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 8,
        borderRadius: 10,
        width: "96%",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: colors.blackOpacity15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderId: {
        color: colors.black,
    },
    amount: {
        color: colors.theme,
        marginTop: 4,
    },
    status: {
        color: '#bf8334',
        marginTop: 4,
        backgroundColor: '#fdeacd',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 100
    },
    date: {
        color: colors.blackOpacity40,
        marginTop: 4,
    },
    closeButton: {
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center"
    },
    closeText: {
        fontSize: 20,
    },
    itemView: { width: 30, height: 30, marginRight: 10 },
    itemView1: { flex: 0.4, justifyContent: 'center', alignItems: 'center' },
    itemView2: { flex: 2 },
    itemView3: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalHeader: { justifyContent: "space-between", alignItems: 'center', height: 50, flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10 },
});